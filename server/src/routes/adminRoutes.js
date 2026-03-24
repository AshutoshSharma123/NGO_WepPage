import { Router } from "express";
import { getLoginPage, loginAdmin, logoutAdmin } from "../controllers/authController.js";
import { Donation } from "../models/Donation.js";
import { GalleryImage } from "../models/GalleryImage.js";
import { Impact } from "../models/Impact.js";
import { Involvement } from "../models/Involvement.js";
import { Program } from "../models/Program.js";
import { Volunteer } from "../models/Volunteer.js";
import { requireAdminAuth } from "../middleware/authMiddleware.js";
import { escapeHtml, layout } from "../utils/adminLayout.js";

const router = Router();

router.get("/login", getLoginPage);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

router.use(requireAdminAuth);

router.get("/", async (req, res) => {
  const [impactCount, programCount, involvementCount, volunteerCount, donationCount] =
    await Promise.all([
      Impact.countDocuments(),
      Program.countDocuments(),
      Involvement.countDocuments(),
      Volunteer.countDocuments(),
      Donation.countDocuments()
    ]);

  res.send(
    layout({
      title: "Admin Dashboard",
      adminName: req.admin.name,
      content: `
        <div class="stats">
          <div class="stat"><strong>${impactCount}</strong><div class="muted">Impact rows</div></div>
          <div class="stat"><strong>${programCount}</strong><div class="muted">Programs</div></div>
          <div class="stat"><strong>${involvementCount}</strong><div class="muted">Involvement items</div></div>
          <div class="stat"><strong>${volunteerCount}</strong><div class="muted">Volunteer leads</div></div>
          <div class="stat"><strong>${donationCount}</strong><div class="muted">Donations</div></div>
        </div>
      `
    })
  );
});

router.get("/ngo", async (req, res) => {
  const [impact, programs, involvement, galleryImages] = await Promise.all([
    Impact.find().sort({ createdAt: -1 }).lean(),
    Program.find().sort({ createdAt: -1 }).lean(),
    Involvement.find().sort({ createdAt: -1 }).lean(),
    GalleryImage.find().sort({ createdAt: -1 }).lean()
  ]);

  const impactRows = impact
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.label)}</td>
          <td>${escapeHtml(item.value)}</td>
          <td>
            <form class="inline" method="post" action="/admin/impact/${item._id}/update">
              <input name="label" value="${escapeHtml(item.label)}" required />
              <input name="value" value="${escapeHtml(item.value)}" required />
              <div class="actions"><button class="alt" type="submit">Update</button></div>
            </form>
            <form method="post" action="/admin/impact/${item._id}/delete">
              <button class="danger" type="submit">Delete</button>
            </form>
          </td>
        </tr>`
    )
    .join("");

  const programRows = programs
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.title)}</td>
          <td>${escapeHtml(item.description)}</td>
          <td>
            <form class="inline" method="post" action="/admin/programs/${item._id}/update">
              <input name="title" value="${escapeHtml(item.title)}" required />
              <textarea name="description" required>${escapeHtml(item.description)}</textarea>
              <div class="actions"><button class="alt" type="submit">Update</button></div>
            </form>
            <form method="post" action="/admin/programs/${item._id}/delete">
              <button class="danger" type="submit">Delete</button>
            </form>
          </td>
        </tr>`
    )
    .join("");

  const involvementRows = involvement
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.text)}</td>
          <td>
            <form class="inline" method="post" action="/admin/involvement/${item._id}/update">
              <textarea name="text" required>${escapeHtml(item.text)}</textarea>
              <div class="actions"><button class="alt" type="submit">Update</button></div>
            </form>
            <form method="post" action="/admin/involvement/${item._id}/delete">
              <button class="danger" type="submit">Delete</button>
            </form>
          </td>
        </tr>`
    )
    .join("");

  const imageRows = galleryImages
    .map(
      (item) => `
        <tr>
          <td><img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" style="width:96px;height:72px;object-fit:cover;border-radius:12px;" /></td>
          <td>${escapeHtml(item.title)}</td>
          <td>${escapeHtml(item.description || "-")}</td>
          <td>
            <form class="inline" method="post" action="/admin/gallery/${item._id}/update">
              <input name="title" value="${escapeHtml(item.title)}" required />
              <input name="imageUrl" value="${escapeHtml(item.imageUrl)}" required />
              <textarea name="description">${escapeHtml(item.description || "")}</textarea>
              <div class="actions"><button class="alt" type="submit">Update</button></div>
            </form>
            <form method="post" action="/admin/gallery/${item._id}/delete">
              <button class="danger" type="submit">Delete</button>
            </form>
          </td>
        </tr>`
    )
    .join("");

  res.send(
    layout({
      title: "NGO Content",
      adminName: req.admin.name,
      content: `
        <div class="grid">
          <div class="card">
            <h2>Impact Table</h2>
            <div class="split">
              <div><table><thead><tr><th>Label</th><th>Value</th><th>Actions</th></tr></thead><tbody>${impactRows}</tbody></table></div>
              <div><form class="stack" method="post" action="/admin/impact"><input name="label" placeholder="Impact label" required /><input name="value" placeholder="Impact value" required /><button type="submit">Create Impact Row</button></form></div>
            </div>
          </div>
          <div class="card">
            <h2>Programs Table</h2>
            <div class="split">
              <div><table><thead><tr><th>Title</th><th>Description</th><th>Actions</th></tr></thead><tbody>${programRows}</tbody></table></div>
              <div><form class="stack" method="post" action="/admin/programs"><input name="title" placeholder="Program title" required /><textarea name="description" placeholder="Program description" required></textarea><button type="submit">Create Program</button></form></div>
            </div>
          </div>
          <div class="card">
            <h2>Involvement Table</h2>
            <div class="split">
              <div><table><thead><tr><th>Message</th><th>Actions</th></tr></thead><tbody>${involvementRows}</tbody></table></div>
              <div><form class="stack" method="post" action="/admin/involvement"><textarea name="text" placeholder="Call-to-action text" required></textarea><button type="submit">Create Involvement Row</button></form></div>
            </div>
          </div>
          <div class="card">
            <h2>Gallery Images</h2>
            <p class="muted">Add public image URLs and captions here. These images appear in the swipe gallery on the website.</p>
            <div class="split">
              <div><table><thead><tr><th>Preview</th><th>Title</th><th>Description</th><th>Actions</th></tr></thead><tbody>${imageRows}</tbody></table></div>
              <div><form class="stack" method="post" action="/admin/gallery"><input name="title" placeholder="Image title" required /><input name="imageUrl" placeholder="https://example.com/image.jpg" required /><textarea name="description" placeholder="Short description"></textarea><button type="submit">Add Gallery Image</button></form></div>
            </div>
          </div>
        </div>
      `
    })
  );
});

router.post("/impact", async (req, res) => {
  await Impact.create(req.body);
  res.redirect("/admin/ngo");
});

router.post("/impact/:id/update", async (req, res) => {
  await Impact.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
  res.redirect("/admin/ngo");
});

router.post("/impact/:id/delete", async (req, res) => {
  await Impact.findByIdAndDelete(req.params.id);
  res.redirect("/admin/ngo");
});

router.post("/programs", async (req, res) => {
  await Program.create(req.body);
  res.redirect("/admin/ngo");
});

router.post("/programs/:id/update", async (req, res) => {
  await Program.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
  res.redirect("/admin/ngo");
});

router.post("/programs/:id/delete", async (req, res) => {
  await Program.findByIdAndDelete(req.params.id);
  res.redirect("/admin/ngo");
});

router.post("/involvement", async (req, res) => {
  await Involvement.create({ text: req.body.text });
  res.redirect("/admin/ngo");
});

router.post("/involvement/:id/update", async (req, res) => {
  await Involvement.findByIdAndUpdate(req.params.id, { text: req.body.text }, { runValidators: true });
  res.redirect("/admin/ngo");
});

router.post("/involvement/:id/delete", async (req, res) => {
  await Involvement.findByIdAndDelete(req.params.id);
  res.redirect("/admin/ngo");
});

router.post("/gallery", async (req, res) => {
  await GalleryImage.create(req.body);
  res.redirect("/admin/ngo");
});

router.post("/gallery/:id/update", async (req, res) => {
  await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
  res.redirect("/admin/ngo");
});

router.post("/gallery/:id/delete", async (req, res) => {
  await GalleryImage.findByIdAndDelete(req.params.id);
  res.redirect("/admin/ngo");
});

router.get("/volunteers", async (req, res) => {
  const volunteers = await Volunteer.find().sort({ createdAt: -1 }).lean();
  const rows = volunteers
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.name)}</td>
          <td>${escapeHtml(item.email)}</td>
          <td>${escapeHtml(item.interest)}</td>
          <td>${escapeHtml(new Date(item.createdAt).toLocaleString("en-IN"))}</td>
          <td>
            <form class="inline" method="post" action="/admin/volunteers/${item._id}/update">
              <input name="name" value="${escapeHtml(item.name)}" required />
              <input name="email" type="email" value="${escapeHtml(item.email)}" required />
              <input name="interest" value="${escapeHtml(item.interest)}" required />
              <div class="actions"><button class="alt" type="submit">Update</button></div>
            </form>
            <form method="post" action="/admin/volunteers/${item._id}/delete">
              <button class="danger" type="submit">Delete</button>
            </form>
          </td>
        </tr>`
    )
    .join("");

  res.send(
    layout({
      title: "Volunteers",
      adminName: req.admin.name,
      content: `
        <div class="card">
          <h2>Volunteer Leads</h2>
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Interest</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>${rows || '<tr><td colspan="5">No volunteer submissions yet.</td></tr>'}</tbody>
          </table>
        </div>
      `
    })
  );
});

router.post("/volunteers/:id/update", async (req, res) => {
  await Volunteer.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
  res.redirect("/admin/volunteers");
});

router.post("/volunteers/:id/delete", async (req, res) => {
  await Volunteer.findByIdAndDelete(req.params.id);
  res.redirect("/admin/volunteers");
});

router.get("/donations", async (req, res) => {
  const donations = await Donation.find().sort({ createdAt: -1 }).lean();
  const rows = donations
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.donorName)}</td>
          <td>${escapeHtml(item.email)}</td>
          <td>${escapeHtml(String(item.amount))}</td>
          <td>${escapeHtml(item.purpose)}</td>
          <td>${escapeHtml(item.paymentStatus)}</td>
          <td>${item.paymentStatus === "paid" ? `<a href="/certificates/${item._id}" target="_blank">View Certificate</a>` : "-"}</td>
          <td>${escapeHtml(item.razorpayOrderId || "-")}</td>
        </tr>`
    )
    .join("");

  res.send(
    layout({
      title: "Donations",
      adminName: req.admin.name,
      content: `
        <div class="card">
          <h2>Donation Records</h2>
          <table>
            <thead><tr><th>Donor</th><th>Email</th><th>Amount</th><th>Purpose</th><th>Status</th><th>Certificate</th><th>Order ID</th></tr></thead>
            <tbody>${rows || '<tr><td colspan="7">No donations yet.</td></tr>'}</tbody>
          </table>
        </div>
      `
    })
  );
});

export default router;
