import express from "express";

import cookieParser from "cookie-parser";
import userRoutes from "./routes/user/user.route.js";
import pdiRoutes from "./routes/pdi/pdi.routes.js";
import commonRoutes from "./routes/meta/common.routes.js";
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

// app.use("/api/user", userRoutes);
// app.use("/api/pdi", vehiclePDI);

//Superadmin Routes
// app.use("/api/superadmin", SuperAdminRoutes);
// app.use("/api/superadmin", signup);
// app.use("/api/addvehicles", vehicleRoutes);

// Admin routes
// app.use("/api/admin", assignEngineerRoutes);
// app.use("/api/admin", pdiRequestRoutes);

app.get("/", (req, res) => {
  res.send(" API is running...");
});

export default app;
