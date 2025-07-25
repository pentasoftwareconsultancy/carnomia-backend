import express from "express";

import cookieParser from "cookie-parser";
import userRoutes from "./routes/user/user.route.js";
import pdiRoutes from "./routes/pdi/pdi.routes.js";
import commonRoutes from "./routes/meta/common.routes.js";
import metaRoutes from "./routes/meta/meta.routes.js";
import lookupRoutes from "./routes/meta/lookupRoutes.js";
import path from "path";

const app = express();
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Middleware
app.use(express.json());

// for store token in cookie
app.use(cookieParser());

//Customer Routes
app.use("/api/user", userRoutes);
app.use("/api/pdi", pdiRoutes);
app.use("/api/common", commonRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/lookups", lookupRoutes);

app.get("/", (req, res) => {
  res.send(" API is running...");
});

export default app;
