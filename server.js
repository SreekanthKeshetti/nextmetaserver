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

// // Initialize Resend client
// const resend = new Resend(process.env.RESEND_API_KEY);

// // Ensure uploads folder exists
// const uploadsDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

// // Multer setup for file uploads
// const upload = multer({
//   dest: uploadsDir,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });

// // --------------------------------------------------------------------
// // Helper: Send email via Resend
// // --------------------------------------------------------------------
// async function sendMail({ to, subject, html, text, attachments }) {
//   const formattedAttachments = (attachments || []).map((a) => ({
//     filename: a.filename,
//     content: a.contentBase64,
//     encoding: "base64",
//   }));

//   // ✅ Convert comma-separated string or single email to array
//   const toList =
//     typeof to === "string"
//       ? to.split(",").map((email) => email.trim())
//       : Array.isArray(to)
//       ? to
//       : [to];

//   console.log("📤 Sending email to:", toList);

//   return await resend.emails.send({
//     from: process.env.FROM_EMAIL || "onboarding@resend.dev",
//     to: toList,
//     subject,
//     html,
//     text,
//     attachments: formattedAttachments.length ? formattedAttachments : undefined,
//   });
// }

// // --------------------------------------------------------------------
// // ROUTES
// // --------------------------------------------------------------------

// // Health check
// app.get("/ping", (req, res) => res.send("✅ Server is working!"));

// // Contact: Scroll Section
// app.post("/api/contact-scroll", async (req, res) => {
//   console.log("📩 Received /api/contact-scroll request:", req.body);
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
//     console.error("❌ Error sending mail:", err);
//     res.status(500).json({ success: false, message: "Error sending email" });
//   }
// });

// // Contact: Contact Page
// app.post("/api/contact-page", async (req, res) => {
//   console.log("📩 Received /api/contact-page request:", req.body);
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
//     console.error("❌ Error sending mail:", err);
//     res.status(500).json({ success: false, message: "Error sending email" });
//   }
// });

// // Chatbot form
// app.post("/api/chatbot", async (req, res) => {
//   console.log("🤖 Received /api/chatbot request:", req.body);
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
//     console.error("❌ Error sending chatbot mail:", err);
//     res.status(500).json({ success: false, message: "Error sending email" });
//   }
// });

// // Career apply with resume upload
// app.post("/api/career-apply", upload.single("resume"), async (req, res) => {
//   console.log("🧑‍💼 Received /api/career-apply request:", req.body);
//   const { fullName, email, phone, message, jobTitle } = req.body;
//   const resumeFile = req.file;

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
//     if (resumeFile?.path) {
//       try {
//         fs.unlinkSync(resumeFile.path);
//       } catch (err) {
//         console.warn("⚠️ Failed to delete temp resume:", err);
//       }
//     }

//     res.status(200).json({ success: true, message: "Application sent successfully" });
//   } catch (err) {
//     console.error("❌ Error sending career application:", err);
//     if (resumeFile?.path) {
//       try {
//         fs.unlinkSync(resumeFile.path);
//       } catch (e) {}
//     }
//     res.status(500).json({ success: false, message: "Error sending application" });
//   }
// });

// // Serve static (optional)
// app.use(express.static(path.join(__dirname, "public")));

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists (for multer temp)
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer setup for file uploads
const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// ✅ Setup Nodemailer transporter for GoDaddy SMTP
const transporter = nodemailer.createTransport({
  host: "mail.nextmetaforce.com", // from cPanel settings
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER, // info@nextmetaforce.com
    pass: process.env.EMAIL_PASS, // email password
  },
});

// Helper: send email via GoDaddy SMTP
async function sendMail({ to, subject, html, text, attachments }) {
  const formattedAttachments = (attachments || []).map((a) => ({
    filename: a.filename,
    content: Buffer.from(a.contentBase64, "base64"),
  }));

  const mailOptions = {
    from: `"Nextmetaforce" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
    attachments: formattedAttachments.length ? formattedAttachments : undefined,
  };

  return await transporter.sendMail(mailOptions);
}

// Debug route
app.get("/ping", (req, res) => res.send("✅ Server is working!"));

// Contact: Scroll Section
app.post("/api/contact-scroll", async (req, res) => {
  const { name, email, phoneNumber, company, subject, message } = req.body;
  const subjectLine = subject || "New Contact (Scroll Section)";
  const html = `
    <h3>📩 New Contact from Scroll Section</h3>
    <p><strong>Name:</strong> ${name || "-"}</p>
    <p><strong>Email:</strong> ${email || "-"}</p>
    <p><strong>Phone:</strong> ${phoneNumber || "-"}</p>
    <p><strong>Company:</strong> ${company || "-"}</p>
    <p><strong>Message:</strong><br/>${(message || "-").replace(/\n/g, "<br/>")}</p>
  `;

  try {
    await sendMail({
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: subjectLine,
      html,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phoneNumber}\nCompany: ${company}\nMessage:\n${message}`,
    });
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Error sending contact-scroll mail:", err);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// Contact: Contact Page
app.post("/api/contact-page", async (req, res) => {
  const { firstName, lastName, email, country, message } = req.body;
  const html = `
    <h3>📩 New Contact from Contact Us Page</h3>
    <p><strong>First Name:</strong> ${firstName || "-"}</p>
    <p><strong>Last Name:</strong> ${lastName || "-"}</p>
    <p><strong>Email:</strong> ${email || "-"}</p>
    <p><strong>Country:</strong> ${country || "-"}</p>
    <p><strong>Message:</strong><br/>${(message || "-").replace(/\n/g, "<br/>")}</p>
  `;

  try {
    await sendMail({
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: "New Contact (Contact Page)",
      html,
      text: `First Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nCountry: ${country}\nMessage:\n${message}`,
    });
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Error sending contact-page mail:", err);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// Chatbot form
app.post("/api/chatbot", async (req, res) => {
  const { name, email, datetime, topic } = req.body;
  const html = `
    <h3>💬 New Chatbot Message</h3>
    <p><strong>Name:</strong> ${name || "-"}</p>
    <p><strong>Email:</strong> ${email || "-"}</p>
    <p><strong>Date/Time:</strong> ${datetime || "-"}</p>
    <p><strong>Topic:</strong> ${topic || "-"}</p>
    <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
  `;

  try {
    await sendMail({
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `💬 New Chatbot Message - ${topic || "General"}`,
      html,
      text: `Name: ${name}\nEmail: ${email}\nDate/Time: ${datetime}\nTopic: ${topic}\nSubmitted At: ${new Date().toLocaleString()}`,
    });
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Error sending chatbot mail:", err);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// Career form with file upload
app.post("/api/career-apply", upload.single("resume"), async (req, res) => {
  const { fullName, email, phone, message, jobTitle } = req.body;
  const resumeFile = req.file;
  const html = `
    <h3>🧑‍💼 New Job Application</h3>
    <p><strong>Job Title:</strong> ${jobTitle || "-"}</p>
    <p><strong>Name:</strong> ${fullName || "-"}</p>
    <p><strong>Email:</strong> ${email || "-"}</p>
    <p><strong>Phone:</strong> ${phone || "-"}</p>
    <p><strong>Message:</strong><br/>${(message || "-").replace(/\n/g, "<br/>")}</p>
    <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
  `;

  try {
    let attachments = [];
    if (resumeFile && resumeFile.path) {
      const fileBuffer = fs.readFileSync(resumeFile.path);
      attachments.push({
        filename: resumeFile.originalname,
        contentBase64: fileBuffer.toString("base64"),
      });
    }

    await sendMail({
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `🧑‍💼 New Job Application - ${jobTitle || "Unknown"}`,
      html,
      text: `Job Title: ${jobTitle}\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nMessage:\n${message}`,
      attachments,
    });

    if (resumeFile && resumeFile.path) fs.unlinkSync(resumeFile.path);
    res.status(200).json({ success: true, message: "Application sent successfully" });
  } catch (err) {
    console.error("❌ Error sending career application:", err);
    if (resumeFile && resumeFile.path) fs.unlinkSync(resumeFile.path);
    res.status(500).json({ success: false, message: "Error sending application" });
  }
});

// Serve static if needed
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));



