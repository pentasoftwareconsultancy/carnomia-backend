import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { convertImageToBase64 } from '../../utils/imageHelper.js';

// Optional HTML escape helper (if user input is involved)
// const escapeHtml = (str = '') =>
//     str.replace(/&/g, '&amp;')
//        .replace(/</g, '&lt;')
//        .replace(/>/g, '&gt;')
//        .replace(/"/g, '&quot;')
//        .replace(/'/g, '&#39;');

export const generatePDF = async (req, res) => {
    try {
        const data = req.body;

        // Load HTML template
        const templatePath = path.resolve('templates/pdf-template.html');
        let html = fs.readFileSync(templatePath, 'utf-8');

        // Convert vehicle image to base64 (if provided)
        const vehicleImageBase64 = data.imageUrl
            ? await convertImageToBase64(data.imageUrl)
            : '';

        // Mapping of placeholders to data fields
        const replacements = {
            customerName: data.customerName,
            bookingId: data.bookingId,
            brand: data.brand,
            model: data.model,
            vehicleImage: vehicleImageBase64,
            location: data.location,
            engineer: data.engineer,
            pdiDate: data.pdiDate,
            pdiTime: data.pdiTime,
            address: data.address,
            status: data.status,
            vin: data.vin,
            variant: data.variant,
            transmission: data.transmission,
            fuel: data.fuel,
            engine: data.engine,
            engineType: data.engineType,
            emission: data.emission,
            keys: data.keys,
            score: data.score,
            scoreRemark: data.scoreRemark,
            carRunning: data.carRunning,
            avgRunning: data.avgRunning,
            carRunningPercentage: data.carRunningPercentage || '100',
        };

        // Replace all placeholders in HTML
        for (const [key, value] of Object.entries(replacements)) {
            const safeValue = value || ''; // Optionally use escapeHtml(value)
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, safeValue);
        }

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0', timeout: 0 });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        await browser.close();

        // Return the PDF as response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=inspection_report.pdf');
        res.send(pdfBuffer);

    } catch (err) {
        console.error('PDF generation error:', err);
        res.status(500).send('Error generating PDF');
    }
};
