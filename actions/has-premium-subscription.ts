"use server";

import { currentUser } from "@clerk/nextjs/server";

export async function hasValidSubscription(): Promise<boolean> {
  const user = await currentUser();

  if (!user) return false;

  const metadata = user.publicMetadata as {
    subscriptionPlan?: string;
    subscriptionEnd?: number;
  };

  return !!(
    metadata.subscriptionPlan &&
    metadata.subscriptionEnd! > new Date().getTime()
  );
}
