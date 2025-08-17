import express from "express";

import cookieParser from "cookie-parser";
import userRoutes from "./routes/user/user.route.js";
import pdiRoutes from "./routes/pdi/pdi.routes.js";
import commonRoutes from "./routes/meta/common.routes.js";
import metaRoutes from "./routes/meta/meta.routes.js";
import lookupRoutes from "./routes/meta/lookup.routes.js";
import pdfRoutes from "./routes/pdf/pdf.routes.js";
import path from "path";
import cors from "cors";
import bcrypt from "bcryptjs";


const app = express(); // ✅ initialize first

// console.log("My Pass : ",await bcrypt.hash('Admin@123!!', 10));

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use(cors({
//   origin: "http://localhost:5173", // frontend Vite
//   credentials: true                // if using cookies/sessions
// }));
// app.use(cors({
//   origin: ['http://31.97.231.187:5000', 'http://localhost:5173'], // allow your frontend domains
//   credentials: true // if you use cookies or authentication headers
// }));
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://31.97.231.187:5000",    
    "https://carnomia.com",        
    "https://www.carnomia.com",   
    "https://api.carnomia.com"      
  ],
  credentials: true
}));

// Middleware
app.use(express.json());

// for store token in cookie
const token = app.use(cookieParser());

//Customer Routes
app.use("/api/user", userRoutes);
app.use("/api/pdi", pdiRoutes);
app.use("/api/common", commonRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/lookups", lookupRoutes);
app.use("/api/pdf", pdfRoutes);

app.get("/", (req, res) => {
  res.send(" API is running...");
});

export default app;
