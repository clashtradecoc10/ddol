import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
//import { Resend } from "resend";
//import { sendSignUpEmail } from "@/lib/mail";
const prisma = new PrismaClient();
//const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error(
        "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
      );
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occured -- no svix headers", {
        status: 400,
      });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occured", {
        status: 400,
      });
    }

    // Handle the webhook
    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === "user.created") {
      // Ensure id is a string
      const clerkId = evt.data.id;
      if (typeof clerkId !== "string") {
        console.error("Invalid or missing Clerk ID");
        return new Response("Error: Invalid or missing Clerk ID", {
          status: 400,
        });
      }

      // Create user and optionally assign admaven account
      await prisma.user.create({
        data: {
          clerk_id: clerkId,
          email: evt.data.email_addresses[0].email_address,
          first_name: evt.data.first_name,
          last_name: evt.data.last_name,
        },
      });

      //await sendSignUpEmail(evt.data.email_addresses[0].email_address);

      //await resend.contacts.create({
      //  email: evt.data.email_addresses[0].email_address,
      //  firstName: evt.data.first_name ?? "",
      //  lastName: evt.data.last_name ?? "",
      //  unsubscribed: false,
      //  audienceId: "fa72a0da-f2c7-46c9-bb1a-474476bb193e",
      //});
    }

    return new Response("", { status: 200 });
  } catch (error) {
    console.error("Error in Clerk webhook:", error);
    return new Response("Error occurred", {
      status: 500,
    });
  }
}
