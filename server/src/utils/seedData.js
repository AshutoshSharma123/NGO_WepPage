import bcrypt from "bcryptjs";
import { AdminUser } from "../models/AdminUser.js";
import { GalleryImage } from "../models/GalleryImage.js";
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

  if ((await GalleryImage.countDocuments()) === 0) {
    await GalleryImage.insertMany([
      {
        title: "Nutrition Drive",
        imageUrl:
          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
        description: "Community food and nutrition support for families in need."
      },
      {
        title: "Children Learning Hub",
        imageUrl:
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
        description: "Students engaged in learning with books, mentoring, and digital resources."
      },
      {
        title: "Healthcare Outreach",
        imageUrl:
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
        description: "Field teams supporting health camps and essential medical outreach."
      }
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
