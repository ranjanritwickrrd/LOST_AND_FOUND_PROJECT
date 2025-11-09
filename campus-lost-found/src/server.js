// --- server.js (Campus Connect Main Auth & Dashboard) ---
import express from "express";
import cors from "cors";

const app = express();

// Parse JSON requests
app.use(express.json());

// ✅ Allow Swagger UI (8080 / 8081) and frontend (3000)
app.use(
  cors({
    origin: [
      "http://localhost:8081", // Swagger UI on 8081
      "http://localhost:8080", // Swagger UI on 8080
      "http://localhost:3000"  // Frontend (if any)
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// ✅ Handle CORS preflights
app.options("*", cors());

// --- routes (adjust imports to your files) ---
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";
import profileRoutes from "./routes/profile.js";

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/profile", profileRoutes);

// --- health check ---
app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, message: "Server is running" });
});

// --- start server ---
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
