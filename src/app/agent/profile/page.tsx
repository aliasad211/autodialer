import { requireAgent } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import ProfileView from "./ProfileView";

export default async function AgentProfilePage() {
  const session = await requireAgent();

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.userId },
    include: { region: { select: { name: true } } },
  });

  return <ProfileView user={user} />;
}
