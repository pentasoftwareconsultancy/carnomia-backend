import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fetch from "node-fetch";

export const createPdf = async (formData) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Loop through each tab (18 tabs)
  for (const tab of formData.tabs) {
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { title, text, images } = tab;

    // Title
    page.drawText(title, {
      x: 50,
      y: 800,
      size: 20,
      font,
      color: rgb(0, 0.53, 0.71),
    });

    // Text
    if (text) {
      page.drawText(text, {
        x: 50,
        y: 760,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
    }

    // Images
    if (images && images.length > 0) {
      let posY = 700;
      for (const imgUrl of images) {
        try {
          const response = await fetch(imgUrl);
          const imageBuffer = await response.arrayBuffer();

          let img;
          if (imgUrl.endsWith(".jpg") || imgUrl.endsWith(".jpeg")) {
            img = await pdfDoc.embedJpg(imageBuffer);
          } else if (imgUrl.endsWith(".png")) {
            img = await pdfDoc.embedPng(imageBuffer);
          }

          page.drawImage(img, {
            x: 50,
            y: posY,
            width: 200,
            height: 150,
          });

          posY -= 160;
        } catch (err) {
          console.log("Error embedding image:", imgUrl, err);
        }
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
