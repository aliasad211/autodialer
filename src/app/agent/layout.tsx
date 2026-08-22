export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2>AGENT PANEL</h2>

      <main>{children}</main>
    </div>
  );
}