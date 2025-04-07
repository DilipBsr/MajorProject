require("dotenv").config();
const PORT = process.env.PORT || 5001;
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const fontkit = require("fontkit");

const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

require("./Models/db");

const app = express();
const authRoutes = require("./routes/authRoutes");

const testRoutes = require("./routes/testRoutes");

const courseRoutes = require("./routes/courseRoutes");

const ensureAuth = require("./Middleware/Auth");
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
// app.use("/course",ensureAuth, courseRoutes);

app.use("/api", testRoutes);

app.get("/hello", (req, res) => {
  res.send("World");
});


app.post("/generate-certificate", async (req, res) => {

  function drawCenteredText(page, text, y, font, maxWidth, initialFontSize = 36, minFontSize = 12, color = rgb(0, 0, 0)) {
    if (!text || text.trim().length === 0) return; // Skip if text is empty
  
    let fontSize = initialFontSize;
    let textWidth = font.widthOfTextAtSize(text, fontSize);
  
    // Shrink font if text exceeds max width
    while (textWidth > maxWidth && fontSize > minFontSize) {
      fontSize--;
      textWidth = font.widthOfTextAtSize(text, fontSize);
    }
  
    const pageWidth = page.getSize().width;
    const x = (pageWidth - textWidth) / 2;
  
    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color,
    });
  }

  const { name, course } = req.body;
  const existingPdfBytes = fs.readFileSync(
    "./certificates/certificate_template.pdf"
  );
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  
  pdfDoc.registerFontkit(fontkit);
  const customFontBytes = fs.readFileSync("./fonts/CopperPennyDTP.ttf"); // Adjust path if needed
  const customFont = await pdfDoc.embedFont(customFontBytes);
  
  const date = new Date().toLocaleDateString();
  const certId = "CERT-" + Date.now();
  
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  

  drawCenteredText(firstPage, name, 240, customFont, 500);
  drawCenteredText(firstPage, course, 150, customFont, 500, 28);

  firstPage.drawText(date, {
    x: 740,
    y: 20,
    size: 14,
    font: customFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  firstPage.drawText(certId, {
    x: 20,
    y: 20,
    size: 14,
    font: customFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  const pdfBytes = await pdfDoc.save();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=certificate.pdf");
  res.send(Buffer.from(pdfBytes));

  fs.writeFileSync("debug_certificate.pdf", pdfBytes);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
