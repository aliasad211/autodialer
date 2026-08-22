export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2>ADMIN CRM</h2>

      <main>{children}</main>
    </div>
  );
}