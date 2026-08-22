import AgentSidebar from "@/components/agent/AgentSidebar";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AgentSidebar />

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}