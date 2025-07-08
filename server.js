require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow only your frontend (GitHub Pages or local dev)
app.use(
  cors({
    origin: [
      "http://localhost:5173",             // for local development
      "https://pawanmalkani.github.io"     // your deployed frontend (update if needed)
    ],
  })
);

app.use(express.json());

// ✅ Root route to test backend
app.get("/", (req, res) => {
  res.send("✅ Backend server is running!");
});

// ✅ POST route to handle contact form
app.post("/contact", async (req, res) => {
  const { name, email, number, message } = req.body;

  if (!name || !email || !number || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${process.env.SMTP_USER}>`,
    to: process.env.RECEIVER_EMAIL,
    replyTo: email,
    subject: `Contact from ${name}`,
    text: `
📩 New Message from Portfolio Contact Form:

Name: ${name}
Email: ${email}
Phone: ${number}

Message:
${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send message.",
    });
  }
});

// ✅ Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
