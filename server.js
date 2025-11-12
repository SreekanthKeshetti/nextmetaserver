import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/contact-scroll", async (req, res) => {
  const { name, email, phoneNumber, company, subject, message } = req.body;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "noreply@yourdomain.com",  // must be verified in Resend
        to: [process.env.EMAIL_TO],
        subject: subject || "New Contact Form Submission",
        text: `
Name: ${name}
Email: ${email}
Phone: ${phoneNumber}
Company: ${company}
Message: ${message}
        `,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Resend error:", errText);
      return res.status(500).json({ success: false, message: "Failed to send email" });
    }

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
