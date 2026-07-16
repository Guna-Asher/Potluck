import { CreatePotForm } from "@/components/CreatePotForm";

export default function CreatePotPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-6 px-6 py-8 sm:py-12">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">Start a pot</h1>
        <p className="text-neutral-500">
          Collect money from a group without becoming the group&rsquo;s debt collector.
        </p>
      </div>

      <CreatePotForm />
    </main>
  );
}
