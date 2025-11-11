const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");



const app = express();
app.use(cors());
app.use(express.json());

// ==================== Resend clients ====================
const resendInfo = new Resend(process.env.RESEND_API_KEY_INFO);
const resendCareer = new Resend(process.env.RESEND_API_KEY_CAREER);

// ==================== Multer ====================
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
const upload = multer({ dest: uploadsDir });

// 📨 Contact form 1 (ScrollContactSection)
app.post("/api/contact-scroll", async (req, res) => {
  const { name, email, phoneNumber, company, subject, message } = req.body;

  try {
    await resendInfo.emails.send({
      from: "info@nextmetaforce.com",
      to: "info@nextmetaforce.com",
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
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Error sending info mail:", err);
    res.status(500).json({ success: false });
  }
});

// 📨 Contact form 2 (ContactUsPage)
app.post("/api/contact-page", async (req, res) => {
  const { firstName, lastName, email, country, message } = req.body;

  try {
    await resendInfo.emails.send({
      from: "info@nextmetaforce.com",
      to: "info@nextmetaforce.com",
      subject: "New Contact (Contact Page)",
      text: `
📩 New Contact from ContactUsPage

First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Country: ${country}
Message: ${message}
      `,
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Error sending info mail:", err);
    res.status(500).json({ success: false });
  }
});

// 💬 Chatbot form
app.post("/api/chatbot", async (req, res) => {
  const { name, email, datetime, topic } = req.body;

  try {
    await resendInfo.emails.send({
      from: "info@nextmetaforce.com",
      to: "info@nextmetaforce.com",
      subject: `💬 New Chatbot Message - ${topic || "General"}`,
      text: `
Name: ${name || "N/A"}
Email: ${email || "N/A"}
Date/Time: ${datetime || "N/A"}
Topic: ${topic || "N/A"}
Time Submitted: ${new Date().toLocaleString()}
      `,
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Error sending info mail:", err);
    res.status(500).json({ success: false });
  }
});

// 🧑‍💼 Career form
app.post("/api/career-apply", upload.single("resume"), async (req, res) => {
  const { fullName, email, phone, message, jobTitle } = req.body;
  const resumeFile = req.file;

  try {
    await resendCareer.emails.send({
      from: "careers@nextmetaforce.com",
      to: "careers@nextmetaforce.com",
      subject: `🧑‍💼 New Job Application - ${jobTitle}`,
      text: `
📄 New Job Application

Job Title: ${jobTitle}
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Message: ${message || "N/A"}
Submitted: ${new Date().toLocaleString()}
      `,
      attachments: resumeFile
        ? [
            {
              filename: resumeFile.originalname,
              path: resumeFile.path,
            },
          ]
        : [],
    });

    // Cleanup
    if (resumeFile) fs.unlinkSync(resumeFile.path);

    res.json({ success: true });
  } catch (err) {
    console.error("Error sending career mail:", err);
    res.status(500).json({ success: false });
  }
});


