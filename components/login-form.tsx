"use client";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";

export const LoginForm = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/3">
      <SignIn.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignIn.Step name="start">
                <h2 className="text-xl font-bold mb-4">Login</h2>
                <div className="grid gap-y-4">
                  <div className="grid grid-cols-1 gap-x-4">
                    <Clerk.Connection name="google" asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        disabled={isGlobalLoading}
                      >
                        <Clerk.Loading scope="provider:google">
                          {(isLoading) =>
                            isLoading ? (
                              <Icons.spinner className="size-4 animate-spin" />
                            ) : (
                              <>
                                <Icons.google className="mr-2 size-4" />
                                Google
                              </>
                            )
                          }
                        </Clerk.Loading>
                      </Button>
                    </Clerk.Connection>
                  </div>
                  <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                    or
                  </p>
                  <Clerk.Field name="identifier" className="space-y-2">
                    <Clerk.Label asChild>
                      <Label>Email address</Label>
                    </Clerk.Label>
                    <Clerk.Input type="email" required asChild>
                      <Input />
                    </Clerk.Input>
                    <Clerk.FieldError className="block text-sm text-destructive" />
                  </Clerk.Field>
                </div>
                <div className="grid w-full gap-y-4">
                  <SignIn.Action submit asChild>
                    <Button
                      className="bg-pink-400 hover:bg-pink-500 text-black mt-4"
                      disabled={isGlobalLoading}
                    >
                      <Clerk.Loading>
                        {(isLoading) => {
                          return isLoading ? (
                            <Icons.spinner className="size-4 animate-spin" />
                          ) : (
                            "Continue"
                          );
                        }}
                      </Clerk.Loading>
                    </Button>
                  </SignIn.Action>

                  <Button variant="link" size="sm" asChild>
                    <Clerk.Link navigate="sign-up">
                      Don&apos;t have an account? Sign up
                    </Clerk.Link>
                  </Button>
                </div>
              </SignIn.Step>

              <SignIn.Step name="choose-strategy">
                <h2 className="text-xl font-bold mb-2">Use another method</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Facing issues? You can use any of these methods to sign in.
                </p>
                <div className="grid gap-y-4">
                  <SignIn.SupportedStrategy name="email_code" asChild>
                    <Button
                      type="button"
                      variant="link"
                      disabled={isGlobalLoading}
                    >
                      Email code
                    </Button>
                  </SignIn.SupportedStrategy>
                  <SignIn.SupportedStrategy name="password" asChild>
                    <Button
                      type="button"
                      variant="link"
                      disabled={isGlobalLoading}
                    >
                      Password
                    </Button>
                  </SignIn.SupportedStrategy>
                </div>
                <div className="grid w-full gap-y-4">
                  <SignIn.Action navigate="previous" asChild>
                    <Button
                      className="bg-pink-400 hover:bg-pink-500 text-black mt-4"
                      disabled={isGlobalLoading}
                    >
                      <Clerk.Loading>
                        {(isLoading) => {
                          return isLoading ? (
                            <Icons.spinner className="size-4 animate-spin" />
                          ) : (
                            "Go back"
                          );
                        }}
                      </Clerk.Loading>
                    </Button>
                  </SignIn.Action>
                </div>
              </SignIn.Step>

              <SignIn.Step name="verifications">
                <SignIn.Strategy name="password">
                  <h2 className="text-xl font-bold mb-2">Login</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    Enter your password to login
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Welcome back <SignIn.SafeIdentifier />
                  </p>
                  <div className="grid gap-y-4">
                    <Clerk.Field name="password" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Password</Label>
                      </Clerk.Label>
                      <Clerk.Input type="password" asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>
                  </div>
                  <div className="grid w-full gap-y-4">
                    <SignIn.Action submit asChild>
                      <Button
                        className="bg-pink-400 hover:bg-pink-500 text-black mt-4"
                        disabled={isGlobalLoading}
                      >
                        <Clerk.Loading>
                          {(isLoading) => {
                            return isLoading ? (
                              <Icons.spinner className="size-4 animate-spin" />
                            ) : (
                              "Continue"
                            );
                          }}
                        </Clerk.Loading>
                      </Button>
                    </SignIn.Action>
                    <SignIn.Action navigate="choose-strategy" asChild>
                      <Button type="button" size="sm" variant="link">
                        Use another method
                      </Button>
                    </SignIn.Action>
                  </div>
                </SignIn.Strategy>

                <SignIn.Strategy name="email_code">
                  <h2 className="text-xl font-bold mb-2">Check your email</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    Enter the verification code sent to your email
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Welcome back <SignIn.SafeIdentifier />
                  </p>
                  <div className="grid gap-y-4">
                    <Clerk.Field name="code">
                      <Clerk.Label className="sr-only">
                        Email verification code
                      </Clerk.Label>
                      <div className="grid gap-y-2 items-center justify-center">
                        <div className="flex justify-center text-center">
                          <Clerk.Input
                            type="otp"
                            autoSubmit
                            className="flex justify-center has-[:disabled]:opacity-50"
                            render={({ value, status }) => {
                              return (
                                <div
                                  data-status={status}
                                  className="relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md data-[status=selected]:ring-1 data-[status=selected]:ring-ring data-[status=cursor]:ring-1 data-[status=cursor]:ring-ring"
                                >
                                  {value}
                                </div>
                              );
                            }}
                          />
                        </div>
                        <Clerk.FieldError className="block text-sm text-destructive text-center" />
                        <SignIn.Action
                          asChild
                          resend
                          className="text-muted-foreground"
                          fallback={({ resendableAfter }) => (
                            <Button variant="link" size="sm" disabled>
                              Didn&apos;t receive a code? Resend (
                              <span className="tabular-nums">
                                {resendableAfter}
                              </span>
                              )
                            </Button>
                          )}
                        >
                          <Button variant="link" size="sm">
                            Didn&apos;t receive a code? Resend
                          </Button>
                        </SignIn.Action>
                      </div>
                    </Clerk.Field>
                  </div>
                  <div className="grid w-full gap-y-4">
                    <SignIn.Action submit asChild>
                      <Button
                        className="bg-pink-400 hover:bg-pink-500 text-black mt-4"
                        disabled={isGlobalLoading}
                      >
                        <Clerk.Loading>
                          {(isLoading) => {
                            return isLoading ? (
                              <Icons.spinner className="size-4 animate-spin" />
                            ) : (
                              "Continue"
                            );
                          }}
                        </Clerk.Loading>
                      </Button>
                    </SignIn.Action>
                    <SignIn.Action navigate="choose-strategy" asChild>
                      <Button size="sm" variant="link">
                        Use another method
                      </Button>
                    </SignIn.Action>
                  </div>
                </SignIn.Strategy>
              </SignIn.Step>
            </>
          )}
        </Clerk.Loading>
      </SignIn.Root>
    </div>
  );
};
