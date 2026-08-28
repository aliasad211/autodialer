import AgentSidebar from "@/components/agent/AgentSidebar";
import { requireAgent } from "@/lib/dal";

export default async function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAgent();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AgentSidebar />

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}