export default function AuthErrorPage({
  searchParams,
}: {
  searchParams?: { error?: string; code?: string; provider?: string };
}) {
  const e = searchParams?.error ?? searchParams?.code ?? "unknown_error";

  const messages: Record<string, string> = {
    token_expired: "That link expired. Please try again.",
    please_restart_the_process: "Login session expired. Try signing in again.",
    unauthorized:
      "You don't have access. Reach out to an admin to enable your account.",
    signup_disabled:
      "You don't have access. Reach out to an admin to enable your account.",
  };

  const message = messages[e] ?? "Something went wrong during sign-in.";

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-semibold mb-2">Unauthorized</h1>
      <p className="mb-6">{message}</p>
      <div className="flex gap-3">
        <a href="/" className="underline">
          Return to App
        </a>
      </div>
      <p className="mt-4 text-xs text-neutral-500">Error code: {e}</p>
    </main>
  );
}
