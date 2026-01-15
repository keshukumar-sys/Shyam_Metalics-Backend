const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

const activityLogger = require("./middleware/activityLogger");
const { authMiddleware } = require("./middleware/auth");
const User = require("./Model/UserModel");

const app = express();

/* =========================================================
   ✅ GLOBAL MIDDLEWARE (SAFE ORDER)
========================================================= */

// Body parsers (DO NOT SKIP multipart here ❗)
app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: true, limit: "3mb" }));

// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Activity Logger (UPLOAD SAFE)
app.use(activityLogger);

/* =========================================================
   ✅ BASIC ROUTES
========================================================= */

app.get("/", (req, res) => {
  res.send("✅ Backend of Shyam Metalics is running");
});

app.get("/hello", (req, res) => {
  res.status(200).send("Hello World from Backend");
});

/* =========================================================
   ✅ IMPORT ROUTES
========================================================= */

app.use("/policy", require("./Routes/PolicyRoutes"));
app.use("/environment", require("./Routes/EnvironmentRoutes"));
app.use("/tds", require("./Routes/TdsRoutes"));
app.use("/sebi", require("./Routes/SebiRoutes"));
app.use("/familiar", require("./Routes/FamiliarRoutes"));
app.use("/financial", require("./Routes/FinancialRoutes"));
app.use("/corporate", require("./Routes/CorporateAnnouncementRoutes"));
app.use("/stock", require("./Routes/StockExchangeComplianceRoutes"));
app.use("/investor-analyst", require("./Routes/InvestorAnalystRoutes"));
app.use("/investor-information", require("./Routes/InvestorInformationRoutes"));
app.use("/other", require("./Routes/OtherRoutes"));
app.use("/news", require("./Routes/EventNewsRoute"));
app.use("/stories", require("./Routes/EventStoriesRoute"));
app.use("/blog", require("./Routes/BlogRoute"));
app.use("/disclosure", require("./Routes/DisclosuresRoute"));
app.use("/award", require("./Routes/AwardRoute"));
app.use("/qip", require("./Routes/QipRoute"));

// ✅ Upload routes (multer lives INSIDE these routes)
app.use("/extra", require("./Routes/uploadRoute"));

// Auth & Logs
app.use("/auth", require("./Routes/AuthRoutes"));
app.use("/logs", require("./Routes/ActivityLogRoute"));

/* =========================================================
   ✅ AUTH MIDDLEWARE (POST / PUT / DELETE protected)
========================================================= */

app.use(authMiddleware);

/* =========================================================
   ✅ STOCK API (Yahoo Finance)
========================================================= */

app.get("/stock", async (req, res) => {
  try {
    const baseSymbol = req.query.symbol;
    if (!baseSymbol) {
      return res.status(400).json({ error: "symbol is required" });
    }

    const nseSymbol = `${baseSymbol}.NS`;
    const bseSymbol = `${baseSymbol}.BO`;

    const [nseQuote, bseQuote] = await Promise.all([
      yahooFinance.quote(nseSymbol).catch(() => null),
      yahooFinance.quote(bseSymbol).catch(() => null),
    ]);

    res.json({
      status: "success",
      nse: nseQuote
        ? {
            symbol: nseQuote.symbol,
            shortName: nseQuote.shortName,
            currentPrice: nseQuote.regularMarketPrice,
            high: nseQuote.regularMarketDayHigh,
            low: nseQuote.regularMarketDayLow,
            prevClose: nseQuote.regularMarketPreviousClose,
            change: nseQuote.regularMarketChange,
            changePercent: nseQuote.regularMarketChangePercent,
          }
        : null,
      bse: bseQuote
        ? {
            symbol: bseQuote.symbol,
            shortName: bseQuote.shortName,
            currentPrice: bseQuote.regularMarketPrice,
            high: bseQuote.regularMarketDayHigh,
            low: bseQuote.regularMarketDayLow,
            prevClose: bseQuote.regularMarketPreviousClose,
            change: bseQuote.regularMarketChange,
            changePercent: bseQuote.regularMarketChangePercent,
          }
        : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

/* =========================================================
   ✅ SERVER START (ONLY ONE LISTEN 🔥)
========================================================= */

const PORT = process.env.PORT || 3002;

app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");
    console.log(`🚀 Server running on port ${PORT}`);

    // Ensure default admin
    const adminEmail = "shyammetalics@admin.com";
    const adminPassword = "pass-12345678";

    const exists = await User.findOne({ email: adminEmail });
    if (!exists) {
      await User.create({
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      console.log("✅ Default admin created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (error) {
    console.error("❌ Startup error:", error);
  }
});
