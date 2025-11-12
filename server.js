import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // or axios

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Resend API
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM;
const RESEND_TO = process.env.RESEND_TO;

app.post("/api/contact-scroll", async (req, res) => {
  const { name, email, phoneNumber, company, subject, message } = req.body;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: RESEND_TO,
        subject: subject || "New Contact Form Submission",
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phoneNumber}\nCompany: ${company}\nMessage: ${message}`,
      }),
    });
    if (!response.ok) throw new Error("Failed to send email via Resend");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
