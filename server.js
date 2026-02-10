// // server.js
// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const { Resend } = require("resend");

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Resend client
// const resend = new Resend(process.env.RESEND_API_KEY);

// // Ensure uploads folder exists (for multer temp)
// const uploadsDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

// // Multer setup for file uploads
// const upload = multer({
//   dest: uploadsDir,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit (adjust if needed)
// });

// // Helper: send email via Resend
// async function sendMail({ to, subject, html, text, attachments }) {
//   // attachments: [{ filename, contentBase64, encoding: 'base64' }, ...]
//   const formattedAttachments = (attachments || []).map((a) => ({
//     filename: a.filename,
//     content: a.contentBase64,
//     encoding: "base64",
//   }));

//   return await resend.emails.send({
//     from: process.env.FROM_EMAIL || "no-reply@yourdomain.com",
//     to,
//     subject,
//     html,
//     text,
//     attachments: formattedAttachments.length ? formattedAttachments : undefined,
//   });
// }

// // Debug ping
// app.get("/ping", (req, res) => res.send("✅ Server is working!"));

// // Contact: Scroll
// app.post("/api/contact-scroll", async (req, res) => {
//   console.log("Received /api/contact-scroll request:", req.body);
//   const { name, email, phoneNumber, company, subject, message } = req.body;
//   const subjectLine = subject || "New Contact (Scroll Section)";

//   const html = `
//     <h3>📩 New Contact from ScrollContactSection</h3>
//     <p><strong>Name:</strong> ${name || "-"}</p>
//     <p><strong>Email:</strong> ${email || "-"}</p>
//     <p><strong>Phone:</strong> ${phoneNumber || "-"}</p>
//     <p><strong>Company:</strong> ${company || "-"}</p>
//     <p><strong>Message:</strong><br/>${(message || "-").replace(/\n/g, "<br/>")}</p>
//   `;

//   try {
//     await sendMail({
//       to: process.env.EMAIL_TO,
//       subject: subjectLine,
//       html,
//       text: `Name: ${name}\nEmail: ${email}\nPhone: ${phoneNumber}\nCompany: ${company}\nMessage:\n${message}`,
//     });
//     res.status(200).json({ success: true, message: "Email sent successfully" });
//   } catch (err) {
//     console.error("Error sending mail:", err);
//     res.status(500).json({ success: false, message: "Error sending email" });
//   }
// });

// // Contact: Contact Page
// app.post("/api/contact-page", async (req, res) => {
//   console.log("Received /api/contact-page request:", req.body);
//   const { firstName, lastName, email, country, message } = req.body;

//   const html = `
//     <h3>📩 New Contact from ContactUsPage</h3>
//     <p><strong>First Name:</strong> ${firstName || "-"}</p>
//     <p><strong>Last Name:</strong> ${lastName || "-"}</p>
//     <p><strong>Email:</strong> ${email || "-"}</p>
//     <p><strong>Country:</strong> ${country || "-"}</p>
//     <p><strong>Message:</strong><br/>${(message || "-").replace(/\n/g, "<br/>")}</p>
//   `;

//   try {
//     await sendMail({
//       to: process.env.EMAIL_TO,
//       subject: "New Contact (Contact Page)",
//       html,
//       text: `First Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nCountry: ${country}\nMessage:\n${message}`,
//     });
//     res.status(200).json({ success: true, message: "Email sent successfully" });
//   } catch (err) {
//     console.error("Error sending mail:", err);
//     res.status(500).json({ success: false, message: "Error sending email" });
//   }
// });

// // Chatbot form
// app.post("/api/chatbot", async (req, res) => {
//   console.log("Received /api/chatbot request:", req.body);
//   const { name, email, datetime, topic } = req.body;

//   const html = `
//     <h3>💬 New Chatbot Message</h3>
//     <p><strong>Name:</strong> ${name || "-"}</p>
//     <p><strong>Email:</strong> ${email || "-"}</p>
//     <p><strong>Date/Time:</strong> ${datetime || "-"}</p>
//     <p><strong>Topic:</strong> ${topic || "-"}</p>
//     <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
//   `;

//   try {
//     await sendMail({
//       to: process.env.EMAIL_TO,
//       subject: `💬 New Chatbot Message - ${topic || "General"}`,
//       html,
//       text: `Name: ${name}\nEmail: ${email}\nDate/Time: ${datetime}\nTopic: ${topic}\nSubmitted At: ${new Date().toLocaleString()}`,
//     });
//     res.status(200).json({ success: true, message: "Email sent successfully" });
//   } catch (err) {
//     console.error("Error sending mail:", err);
//     res.status(500).json({ success: false, message: "Error sending email" });
//   }
// });

// // Career apply with resume upload
// app.post("/api/career-apply", upload.single("resume"), async (req, res) => {
//   console.log("Received /api/career-apply request:", req.body);
//   const { fullName, email, phone, message, jobTitle } = req.body;
//   const resumeFile = req.file; // multer saved the file to uploads/

//   const html = `
//     <h3>🧑‍💼 New Job Application</h3>
//     <p><strong>Job Title:</strong> ${jobTitle || "-"}</p>
//     <p><strong>Name:</strong> ${fullName || "-"}</p>
//     <p><strong>Email:</strong> ${email || "-"}</p>
//     <p><strong>Phone:</strong> ${phone || "-"}</p>
//     <p><strong>Message:</strong><br/>${(message || "-").replace(/\n/g, "<br/>")}</p>
//     <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
//   `;

//   try {
//     let attachments = [];

//     if (resumeFile && resumeFile.path) {
//       const fileBuffer = fs.readFileSync(resumeFile.path);
//       const contentBase64 = fileBuffer.toString("base64");
//       attachments.push({
//         filename: resumeFile.originalname,
//         contentBase64,
//       });
//     }

//     await sendMail({
//       to: process.env.EMAIL_TO,
//       subject: `🧑‍💼 New Job Application - ${jobTitle || "Unknown"}`,
//       html,
//       text: `Job Title: ${jobTitle}\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nMessage:\n${message}`,
//       attachments,
//     });

//     // cleanup temp file
//     if (resumeFile && resumeFile.path) {
//       try {
//         fs.unlinkSync(resumeFile.path);
//       } catch (err) {
//         console.warn("Failed to delete temp resume:", err);
//       }
//     }

//     res.status(200).json({ success: true, message: "Application sent successfully" });
//   } catch (err) {
//     console.error("Error sending career application:", err);
//     // cleanup temp file on error
//     if (resumeFile && resumeFile.path) {
//       try { fs.unlinkSync(resumeFile.path); } catch (e) {}
//     }
//     res.status(500).json({ success: false, message: "Error sending application" });
//   }
// });

// // Serve static if you want
// app.use(express.static(path.join(__dirname, "public")));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Resend } = require("resend");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Multer setup for file uploads
const upload = multer({ dest: uploadsDir });

// ========================== DEBUG ENDPOINT ==========================
app.get("/ping", (req, res) => res.send("✅ Server is working!"));

// ========================== API ROUTES ==========================

// 📨 Contact form 1 (ScrollContactSection)
app.post("/api/contact-scroll", async (req, res) => {
  const { name, email, phoneNumber, company, subject, message } = req.body;
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
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
    });
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// 📨 Contact form 2 (ContactUsPage)
app.post("/api/contact-page", async (req, res) => {
  const { firstName, lastName, email, country, message } = req.body;
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
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
    });
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// 💬 Chatbot form
app.post("/api/chatbot", async (req, res) => {
  const { name, email, datetime, topic } = req.body;
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.EMAIL_TO,
      subject: `💬 New Chatbot Message - ${topic || "General"}`,
      text: `
Name: ${name || "N/A"}
Email: ${email || "N/A"}
Date/Time: ${datetime || "N/A"}
Topic: ${topic || "N/A"}
Time Submitted: ${new Date().toLocaleString()}
      `,
    });
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// 🧑‍💼 Career form (with resume upload)
// app.post("/api/career-apply", upload.single("resume"), async (req, res) => {
//   const { fullName, email, phone, message, jobTitle } = req.body;
//   const resumeFile = req.file;

//   try {
//     const attachments = resumeFile
//       ? [
//           {
//             filename: resumeFile.originalname,
//             path: resumeFile.path,
//           },
//         ]
//       : [];

//     await resend.emails.send({
//       from: process.env.FROM_EMAIL,
//       to: process.env.EMAIL_TO,
//       subject: `🧑‍💼 New Job Application - ${jobTitle}`,
//       text: `
// 📄 New Job Application Received

// Job Title: ${jobTitle}
// Name: ${fullName}
// Email: ${email}
// Phone: ${phone}
// Message: ${message || "N/A"}

// Submitted At: ${new Date().toLocaleString()}
//       `,
//       attachments,
//     });

//     if (resumeFile) fs.unlinkSync(resumeFile.path);
//     res.status(200).json({ success: true, message: "Application sent successfully" });
//   } catch (err) {
//     console.error("Error sending career application:", err);
//     res.status(500).json({ success: false, message: "Error sending application" });
//   }
// });
app.post("/api/career-apply", upload.single("resume"), async (req, res) => {
  const { fullName, email, phone, message, jobTitle } = req.body;
  const resumeFile = req.file;

  try {
    let attachments = [];

    if (resumeFile) {
      const fileContent = fs.readFileSync(resumeFile.path).toString("base64");
      attachments = [
        {
          filename: resumeFile.originalname,
          content: fileContent, // ✅ Base64 instead of path
        },
      ];
    }

    await resend.emails.send({
      from: process.env.FROM_EMAIL,
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
      attachments,
    });

    if (resumeFile) fs.unlinkSync(resumeFile.path);
    res.status(200).json({ success: true, message: "Application sent successfully" });
  } catch (err) {
    console.error("Error sending career application:", err);
    res.status(500).json({ success: false, message: "Error sending application" });
  }
});


// ========================== REACT FRONTEND SERVING ==========================
app.use(express.static(path.join(__dirname, "public")));
app.get("/^/.*$/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ========================== START SERVER ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

