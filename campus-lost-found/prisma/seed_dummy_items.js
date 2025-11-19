import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function slugFromTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Seeding users (upsert)...");

  const userData = [
    { username: "alice",   name: "Alice Kumar",   passwordHash: "hash1",  role: "STUDENT", faculty: "CSE",   phone: "9000000001" },
    { username: "bob",     name: "Bob Singh",     passwordHash: "hash2",  role: "STUDENT", faculty: "ECE",   phone: "9000000002" },
    { username: "charlie", name: "Charlie Rao",   passwordHash: "hash3",  role: "STUDENT", faculty: "EEE",   phone: "9000000003" },
    { username: "diana",   name: "Diana Patel",   passwordHash: "hash4",  role: "STUDENT", faculty: "MECH",  phone: "9000000004" },
    { username: "edward",  name: "Edward Roy",    passwordHash: "hash5",  role: "STUDENT", faculty: "CIVIL", phone: "9000000005" },
    { username: "fatima",  name: "Fatima Khan",   passwordHash: "hash6",  role: "STUDENT", faculty: "IT",    phone: "9000000006" },
    { username: "george",  name: "George Das",    passwordHash: "hash7",  role: "STUDENT", faculty: "CSE",   phone: "9000000007" },
    { username: "harini",  name: "Harini Iyer",   passwordHash: "hash8",  role: "STUDENT", faculty: "AI&DS", phone: "9000000008" },
    { username: "ishaan",  name: "Ishaan Verma",  passwordHash: "hash9",  role: "STUDENT", faculty: "CSE",   phone: "9000000009" },
    { username: "julia",   name: "Julia Menon",   passwordHash: "hash10", role: "STUDENT", faculty: "ECE",   phone: "9000000010" },
  ];

  for (const u of userData) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: u,
      create: u,
    });
  }

  const users = await prisma.user.findMany();
  console.log("Users count:", users.length);

  const now = new Date();

  const foundTitles = [
    "Black Wallet", "Red Umbrella", "Blue Backpack", "Silver Water Bottle",
    "Wireless Earbuds", "Casio Calculator", "College ID Card", "Green Notebook",
    "Steel Tiffin Box", "Black Spectacles", "USB Pendrive 32GB",
    "Scientific Calculator FX-991", "Black Laptop Charger",
    "Sports Water Bottle", "White Power Bank", "Bluetooth Speaker",
    "Mechanical Pencil Case", "Drawing Kit", "Football", "Lab Coat"
  ];

  const lostTitles = [
    "Blue Wallet", "Black Umbrella", "Grey Backpack", "Red Water Bottle",
    "Noise Earbuds", "FX-991EX Calculator", "Library ID Card", "Red Notebook",
    "Plastic Lunch Box", "Reading Glasses", "USB Pendrive 16GB",
    "Graph Sheet Notebook", "Laptop Mouse", "Sports Shoes", "White Notebook",
    "Headphones", "Geometry Box", "College Hoodie", "Cricket Bat", "ID Lanyard"
  ];

  const locations = [
    "Main Library", "CSE Block", "ECE Block", "Mechanical Block",
    "Cafeteria", "Hostel Gate", "Ground", "Parking Area",
    "Auditorium", "Exam Hall"
  ];

  const categories = [
    "Electronics", "Stationery", "ID Card", "Clothing",
    "Sports", "Food Container", "Accessories"
  ];

  function makeItems(titles, type) {
    return titles.map((title, i) => {
      const u = users[i % users.length];
      const slug = slugFromTitle(title);
      const imageUrl = `https://picsum.photos/seed/${slug}/800/500`;  // REAL photo based on item name

      return {
        ownerId: u.id,
        type,
        title,
        description: `${title} - ${type.toLowerCase()} dummy data`,
        category: categories[i % categories.length],
        locationFound: locations[i % locations.length],
        dateFound: new Date(now.getTime() - i * 86400000),
        imageUrl,
        isResolved: false,
      };
    });
  }
  const foundItems = makeItems(foundTitles, "FOUND");
  const lostItems  = makeItems(lostTitles, "LOST");

  console.log("Creating FOUND items...");
  for (const item of foundItems) {
    await prisma.item.create({ data: item });
  }

  console.log("Creating LOST items...");
  for (const item of lostItems) {
    await prisma.item.create({ data: item });
  }

  console.log("✅ DONE: 20 FOUND + 20 LOST items inserted with REAL image URLs.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
