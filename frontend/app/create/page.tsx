import { CreatePotForm } from "@/components/CreatePotForm";
import { PageHeader } from "@/components/ui/PageHeader";

export default function CreatePotPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-8 px-6 py-10 sm:py-16">
      <PageHeader
        title="Start a pot"
        subtitle="Collect money from a group without becoming the group's debt collector."
      />

      <CreatePotForm />
    </main>
  );
}
