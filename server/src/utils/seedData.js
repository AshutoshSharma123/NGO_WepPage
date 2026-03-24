import bcrypt from "bcryptjs";
import { AdminUser } from "../models/AdminUser.js";
import { Impact } from "../models/Impact.js";
import { Involvement } from "../models/Involvement.js";
import { Program } from "../models/Program.js";

export async function seedDatabase() {
  if ((await Impact.countDocuments()) === 0) {
    await Impact.insertMany([
      { label: "Meals Delivered", value: "18K+" },
      { label: "Children Supported", value: "4.2K" },
      { label: "Active Volunteers", value: "260+" }
    ]);
  }

  if ((await Program.countDocuments()) === 0) {
    await Program.insertMany([
      { title: "Education Access", description: "Scholarships, digital classrooms, and community learning hubs." },
      { title: "Health Outreach", description: "Mobile checkups, medicine drives, and preventive health camps." },
      { title: "Women Empowerment", description: "Skill training, mentorship, and micro-entrepreneurship support." }
    ]);
  }

  if ((await Involvement.countDocuments()) === 0) {
    await Involvement.insertMany([
      { text: "Volunteer on weekends with local field teams." },
      { text: "Sponsor education and nutrition kits for a family." },
      { text: "Partner with us for CSR and long-term community impact." }
    ]);
  }

  const email = (process.env.ADMIN_EMAIL || "admin@srctjammu.org").toLowerCase();
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "ChangeMe123!", 10);
  const name = process.env.ADMIN_NAME || "SRCT Admin";

  await AdminUser.findOneAndUpdate(
    { email },
    {
      email,
      passwordHash,
      name
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );
}
