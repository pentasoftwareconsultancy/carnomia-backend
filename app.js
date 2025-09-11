import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import { fileURLToPath } from "url";

// --------- Routes --------- //
import userRoutes from "./routes/user/user.route.js";
import pdiRoutes from "./routes/pdi/pdi.routes.js";
import commonRoutes from "./routes/meta/common.routes.js";
import metaRoutes from "./routes/meta/meta.routes.js";
import lookupRoutes from "./routes/meta/lookup.routes.js";
import pdfRoutes from "./routes/pdf/pdf.routes.js";

// --------- ESM dirname setup --------- //
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", true);

// ---------------- Security Middleware ---------------- //
app.use(helmet()); // Secure HTTP headers

// ---------------- CORS ---------------- //
// Allowed frontend domains
const frontendOrigins = [
  "http://localhost:5173",
  "https://api.carnomia.com",
  "http://31.97.231.187:5000",
  "https://carnomia.com",
  "https://www.carnomia.com",
  "https://carnomia-backend.onrender.com",
  "https://carnomia-frontend.vercel.app",
];

// Global CORS for API routes
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || frontendOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ---------------- Static Uploads ---------------- //
// Use process.cwd() to ensure correct root folder resolution
app.use(
  "/uploads",
  cors({
    origin: frontendOrigins,
    credentials: true,
  }),
  express.static(path.join(process.cwd(), "uploads"))
);

// ---------------- Middleware ---------------- //
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ---------------- Routes ---------------- //
app.use("/api/user", userRoutes);
app.use("/api/pdi", pdiRoutes);
app.use("/api/common", commonRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/lookups", lookupRoutes);
app.use("/api/pdf", pdfRoutes);

// ---------------- Health Check ---------------- //
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// ---------------- Global Error Handler ---------------- //
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Something went wrong",
  });
});

export default app;
