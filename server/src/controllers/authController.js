import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminUser } from "../models/AdminUser.js";
import { loginLayout } from "../utils/adminLayout.js";

function renderLogin(errorMessage = "") {
  return loginLayout({
    title: "Admin Login",
    content: `
      <h1>Admin Login</h1>
      <p class="muted">Use your admin credentials to manage Sri Ram Charitable Trust, Jammu.</p>
      <form class="stack" method="post" action="/admin/login">
        <input name="email" type="email" placeholder="Admin email" required />
        <input name="password" type="password" placeholder="Password" required />
        ${errorMessage ? `<p class="error">${errorMessage}</p>` : ""}
        <button type="submit">Sign In</button>
      </form>
    `
  });
}

export function getLoginPage(req, res) {
  if (req.cookies?.adminToken) {
    return res.redirect("/admin");
  }

  return res.send(renderLogin());
}

export async function loginAdmin(req, res) {
  const admin = await AdminUser.findOne({ email: String(req.body.email).toLowerCase() });

  if (!admin) {
    return res.status(401).send(renderLogin("Invalid credentials"));
  }

  const isValid = await bcrypt.compare(req.body.password, admin.passwordHash);
  if (!isValid) {
    return res.status(401).send(renderLogin("Invalid credentials"));
  }

  const token = jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      name: admin.name
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("adminToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  });

  return res.redirect("/admin");
}

export function logoutAdmin(req, res) {
  res.clearCookie("adminToken");
  return res.redirect("/admin/login");
}
