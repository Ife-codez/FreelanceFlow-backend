import "dotenv/config"; // must be first
import { PrismaClient } from "../src/generated/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const userId = process.env.USER_ID;
const clients = [
  {
    clientName: "Adeola Johnson",
    companyName: "BrightTech Solutions",
    email: "adeola.johnson@brighttech.com",
    phone: "+234 801 234 5678",
    userId: userId
  },
  {
    clientName: "Michael Okoro",
    companyName: "Nova Logistics",
    email: "michael.okoro@novalogistics.com",
    phone: "+234 803 456 7890",
    userId: userId
  },
  {
    clientName: "Fatima Bello",
    companyName: "Zeenah Fashion House",
    email: "fatima.bello@zeenahfashion.com",
    phone: "+234 805 678 9012",
    userId: userId
  },
  {
    clientName: "David Mensah",
    companyName: "FinEdge Consulting",
    email: "david.mensah@finedgeconsult.com",
    phone: "+234 807 890 1234",
    userId: userId
  },
  {
    clientName: "Chioma Nwosu",
    companyName: "HealthBridge Clinic",
    email: "chioma.nwosu@healthbridgeclinic.com",
    phone: "+234 809 123 4567",
    userId: userId
  },
]

const main = async() => {
  console.log("seeding clients...");
  for (const client of clients) {
    await prisma.client.create({
      data: client,
    });
    console.log(`created client: ${client.clientName}`)
  }
  console.log("seeding completed!")
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
}).finally(async ()=> {
  await prisma.$disconnect();
});