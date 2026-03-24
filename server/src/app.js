import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import adminRoutes from "./routes/adminRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import ngoRoutes from "./routes/ngoRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import { Donation } from "./models/Donation.js";
import { escapeHtml } from "./utils/adminLayout.js";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://ngo-wep-page-client.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      const isAllowedVercelOrigin =
        typeof origin === "string" &&
        /^https:\/\/([a-z0-9-]+)\.vercel\.app$/i.test(origin);

      if (!origin || allowedOrigins.includes(origin) || isAllowedVercelOrigin) {
        return callback(null, true);
      }

      console.error("Blocked CORS origin:", origin);
      return callback(new Error("CORS origin not allowed"));
    }
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/admin");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/certificates/:id", async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).lean();

    if (!donation || donation.paymentStatus !== "paid") {
      return res.status(404).send("Certificate not found");
    }

    return res.send(`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Donation Certificate</title>
        <style>
          body {
            margin: 0;
            font-family: Georgia, serif;
            background: #f2efe5;
            color: #1f2d2f;
            display: grid;
            place-items: center;
            min-height: 100vh;
          }
          .certificate {
            width: min(900px, calc(100% - 32px));
            background: #fffdf8;
            border: 12px solid #c89b3c;
            padding: 56px;
            box-shadow: 0 18px 60px rgba(0, 0, 0, 0.12);
          }
          h1, h2, p { text-align: center; margin: 0; }
          h1 { font-size: 44px; margin-bottom: 12px; }
          h2 { font-size: 26px; margin-bottom: 28px; color: #7a5a1c; }
          p { font-size: 18px; line-height: 1.7; margin-bottom: 14px; }
          .name { font-size: 34px; font-weight: bold; margin: 20px 0; }
          .meta { margin-top: 26px; font-size: 16px; color: #5d5f57; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h1>Certificate of Appreciation</h1>
          <h2>Sri Ram Charitable Trust, Jammu</h2>
          <p>This certificate is proudly presented to</p>
          <p class="name">${escapeHtml(donation.donorName)}</p>
          <p>in recognition of the generous donation of Rs. ${escapeHtml(donation.amount)} towards ${escapeHtml(donation.purpose)}.</p>
          <p>Your support strengthens our mission of community care and service.</p>
          <p class="meta">Certificate No: ${escapeHtml(donation.certificateNumber)}</p>
          <p class="meta">Date: ${new Date(donation.donatedAt).toLocaleDateString("en-IN")}</p>
        </div>
      </body>
    </html>`);
  } catch (error) {
    return res.status(400).send("Certificate not found");
  }
});

app.use("/admin", adminRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/volunteers", volunteerRoutes);

export default app;
