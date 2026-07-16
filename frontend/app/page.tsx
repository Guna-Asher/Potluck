import { CreatePotForm } from "@/components/CreatePotForm";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { NetworkGuard } from "@/components/NetworkGuard";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-8 px-6 py-12">
      <header className="flex items-center justify-between">
        <span className="text-lg font-semibold">Potluck</span>
        <WalletConnectButton />
      </header>

      <NetworkGuard />

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-neutral-900">Start a pot</h1>
        <p className="text-neutral-500">
          Collect money from a group without becoming the group&rsquo;s debt collector.
        </p>
      </div>

      <CreatePotForm />
    </main>
  );
}
