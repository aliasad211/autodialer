import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/format";
import RegionsView from "./RegionsView";

export default async function RegionsPage() {
  const today = startOfDay(new Date());

  const regions = await prisma.region.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { users: true, leads: true } },
    },
  });

  const regionsWithCalls = await Promise.all(
    regions.map(async (region) => ({
      ...region,
      callsToday: await prisma.callLog.count({
        where: { lead: { regionId: region.id }, startedAt: { gte: today } },
      }),
    }))
  );

  return <RegionsView regions={regionsWithCalls} />;
}
