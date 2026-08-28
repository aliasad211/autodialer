import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const regions = await Promise.all(
    ["Islamabad", "Rawalpindi", "Lahore", "Peshawar"].map((name) =>
      prisma.region.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@callcenter.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@callcenter.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const agentPasswordHash = await bcrypt.hash("Agent@123", 10);
  const agent = await prisma.user.upsert({
    where: { email: "agent@callcenter.com" },
    update: {},
    create: {
      name: "Ali Khan",
      email: "agent@callcenter.com",
      passwordHash: agentPasswordHash,
      role: "AGENT",
      status: "ACTIVE",
      regionId: regions[0].id,
    },
  });

  const sampleLeads = [
    {
      customerName: "Ahmed Khan",
      phone: "0300-1234567",
      city: "Islamabad",
      vehicleInterest: "Toyota Aqua",
      status: "NEW" as const,
    },
    {
      customerName: "Usman Ali",
      phone: "0312-7654321",
      city: "Islamabad",
      vehicleInterest: "Toyota Vitz",
      status: "NEW" as const,
    },
    {
      customerName: "Bilal Ahmed",
      phone: "0333-9876543",
      city: "Islamabad",
      vehicleInterest: "Honda Vezel",
      status: "INTERESTED" as const,
    },
  ];

  for (const lead of sampleLeads) {
    const exists = await prisma.lead.findFirst({ where: { phone: lead.phone } });
    if (!exists) {
      await prisma.lead.create({
        data: {
          ...lead,
          regionId: regions[0].id,
          agentId: agent.id,
          createdById: agent.id,
        },
      });
    }
  }

  console.log("Seeded:", { admin: admin.email, agent: agent.email, leads: sampleLeads.length });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
