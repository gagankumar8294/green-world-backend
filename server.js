import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import './config/passport.js';
import passport from "passport";
import Authrouter from "./src/routes/authRoutes.js";
import ProductRouter from "./src/products/productRoutes.js";
// import loggerMiddleware from "./middlewares/logger.middleware.js";
import cartRouter from "./src/cart/cartRouter.js";

const isProduction = process.env.NODE_ENV === "production";

dotenv.config();

const app = express();
app.use(express.json());

// app.use(loggerMiddleware)

// ✅ Enable file serving
// app.use("/uploads", express.static("uploads"));

// ✅ Allow localhost (for dev) + your live frontend (Vercel domain)
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Session setup (important fix)
app.set("trust proxy", 1); // needed if you’re on Render or any proxy
  
// ✅ Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret", // <-- required
    resave: false,
    saveUninitialized: false,
    cookie: {

      maxAge: 24 * 60 * 60 * 1000, // 1 day
      // If you are on HTTP (localhost), secure must be false
      secure: isProduction,      
      
      // If secure:false then sameSite cannot be "none"
      sameSite: isProduction ? "none" : "lax",
      // sameSite: "none", // ✅ required for cross-domain cookies
      // secure: true,     // ✅ required for HTTPS (Render uses HTTPS)
    },
  })
);

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
 
// ✅ Routes
app.use("/api/products", ProductRouter);
app.use("/api/auth", Authrouter);
app.use("/api/cart", cartRouter);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// ✅ Start server
const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});


//http://localhost:3200/api/auth/google/callback