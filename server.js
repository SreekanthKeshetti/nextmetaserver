import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url"; // Needed for path in ES Modules

dotenv.config();

const app = express();

// Updated CORS to allow your frontend
app.use(cors({
  origin: "*", // Allow all connections for now to rule out CORS issues
  methods: ["POST", "GET"],
  credentials: true
}));

app.use(express.json());

// 🗂️ Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// ---------------------------------------------------------
// 🚨 THIS IS THE FIX: UPDATED TRANSPORTER SETTINGS 🚨
// ---------------------------------------------------------
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,              // ✅ SWITCH TO SSL PORT
  secure: true,           // ✅ MUST BE TRUE FOR PORT 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // ⬇️ ADD THESE CONNECTION SETTINGS TO FIX TIMEOUTS ⬇️
  connectionTimeout: 10000, // Wait 10 seconds for connection
  greetingTimeout: 5000,    // Wait 5 seconds for greeting
  socketTimeout: 10000,     // Wait 10 seconds for data
  tls: {
    rejectUnauthorized: false 
  }
});

// Verify connection configuration immediately on server start
transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ Transporter Error:", error);
  } else {
    console.log("✅ Server is ready to take our messages");
  }
});


// 📨 Contact form 1 (ScrollContactSection)
app.post("/api/contact-scroll", async (req, res) => {
  const { name, email, phoneNumber, company, subject, message } = req.body;

  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`, // Shows sender name but uses your auth email
    replyTo: email, // When you click reply, it goes to the client
    to: process.env.EMAIL_TO,
    subject: subject || "New Contact (Scroll Section)",
    text: `
      📩 New Contact from ScrollContactSection

      Name: ${name}
      Email: ${email}
      Phone: ${phoneNumber}
      Company: ${company}
      Subject: ${subject}
      Message: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Error sending mail:", err);
    res.status(500).json({ success: false, message: "Error sending email", error: err.message });
  }
});

// 📨 Contact form 2 (ContactUsPage)
app.post("/api/contact-page", async (req, res) => {
  const { firstName, lastName, email, country, message } = req.body;

  const mailOptions = {
    from: `"${firstName} ${lastName}" <${process.env.EMAIL_USER}>`,
    replyTo: email,
    to: process.env.EMAIL_TO,
    subject: "New Contact (Contact Page)",
    text: `
      📩 New Contact from ContactUsPage

      First Name: ${firstName}
      Last Name: ${lastName}
      Email: ${email}
      Country: ${country}
      Message: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Error sending mail:", err);
    res.status(500).json({ success: false, message: "Error sending email", error: err.message });
  }
});

// 💬 Chatbot form
app.post("/api/chatbot", async (req, res) => {
  const { name, email, datetime, topic } = req.body;

  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    replyTo: email,
    to: process.env.EMAIL_TO,
    subject: `💬 New Chatbot Message - ${topic || "General"}`,
    text: `
      Name: ${name || "N/A"}
      Email: ${email || "N/A"}
      Date/Time: ${datetime || "N/A"}
      Topic: ${topic || "N/A"}
      Time Submitted: ${new Date().toLocaleString()}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// 🧑‍💼 Career form (with resume upload)
app.post("/api/career-apply", upload.single("resume"), async (req, res) => {
  const { fullName, email, phone, message, jobTitle } = req.body;
  const resumeFile = req.file;

  const mailOptions = {
    from: `"${fullName}" <${process.env.EMAIL_USER}>`,
    replyTo: email,
    to: process.env.EMAIL_TO,
    subject: `🧑‍💼 New Job Application - ${jobTitle}`,
    text: `
      📄 New Job Application Received

      Job Title: ${jobTitle}
      Name: ${fullName}
      Email: ${email}
      Phone: ${phone}
      Message: ${message || "N/A"}

      Submitted At: ${new Date().toLocaleString()}
    `,
    attachments: resumeFile
      ? [
          {
            filename: resumeFile.originalname,
            path: resumeFile.path,
          },
        ]
      : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Application sent successfully" });

    // Delete temp file after sending
    if (resumeFile && fs.existsSync(resumeFile.path)) {
      fs.unlinkSync(resumeFile.path);
    }
  } catch (err) {
    console.error("Error sending career application:", err);
    res.status(500).json({ success: false, message: "Error sending application" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

