//const express = require('express');
const mongoose = require('mongoose');
//const app = express();
const path = require('path');
require("dotenv").config();
const cors = require('cors');
const express = require("express");
const YahooFinance = require("yahoo-finance2").default;

const app = express();

// ✅ create ONE instance, ONE time
const yahooFinance = new YahooFinance();

// Middleware

app.use((req, res, next) => {
    if (req.is("multipart/form-data")) {
        return next(); // 🚀 skip body parsing
    }
    express.json({ limit: "3mb" })(req, res, next);
});

app.use((req, res, next) => {
    if (req.is("multipart/form-data")) {
        return next(); // 🚀 skip body parsing
    }
    express.urlencoded({ extended: true, limit: "3mb" })(req, res, next);
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))


// Importing routes
const Policyrouter = require("./Routes/PolicyRoutes");
const EnvironmentRouter = require("./Routes/EnvironmentRoutes");
const TdsRouter = require("./Routes/TdsRoutes");
const SebiRouter = require("./Routes/SebiRoutes");
const FamiliarRouter = require("./Routes/FamiliarRoutes");
const FinancialRouter = require("./Routes/FinancialRoutes");
const CorporateRouter = require("./Routes/CorporateAnnouncementRoutes");
const StockExchangeRouter = require("./Routes/StockExchangeComplianceRoutes");
const InvestorAnalystRouter = require("./Routes/InvestorAnalystRoutes");
const InvestorInformationRouter = require("./Routes/InvestorInformationRoutes");
const OtherRouter = require("./Routes/OtherRoutes");
const NewsRouter = require("./Routes/EventNewsRoute");
const StoriesRouter = require("./Routes/EventStoriesRoute");
const blogRouter = require("./Routes/BlogRoute");
const DisclosureRoute = require("./Routes/DisclosuresRoute");
const AwardRouter = require("./Routes/AwardRoute");
const AuthRouter = require("./Routes/AuthRoutes");
const { authMiddleware } = require("./middleware/auth");
const User = require("./Model/UserModel");
app.get("/", (req, res) => {
    res.send("Hello! Backend of Shyam Metalics is running.");
});


app.get("/hello", (req, res) => {
    res.status(200).send("Hello World from Backend");
});

app.use("/policy", Policyrouter);
app.use("/environment", EnvironmentRouter);
app.use("/tds", TdsRouter);
app.use("/sebi", SebiRouter);
app.use("/familiar", FamiliarRouter);
app.use("/financial", FinancialRouter);
app.use("/corporate", CorporateRouter);
app.use("/stock", StockExchangeRouter);
app.use("/investor-analyst", InvestorAnalystRouter);
app.use("/investor-information", InvestorInformationRouter);
app.use("/other", OtherRouter);
app.use("/news", NewsRouter);
app.use("/stories", StoriesRouter);
app.use("/blog", blogRouter);
app.use("/disclosure", DisclosureRoute);
app.use("/award", AwardRouter);
app.use("/extra", require("./Routes/uploadRoute"));

// auth routes (login, create uploader)
app.use("/auth", AuthRouter);

// global auth middleware: allow GETs freely; require token for POST/PUT/DELETE
app.use(authMiddleware);


// app.get("/stock", async (req, res) => {
//     try {
//         const response = await fetch(
//             "https://www.nseindia.com/api/quote-equity?symbol=SHYAMMETL",
//             {
//                 headers: {
//                     "User-Agent": "Mozilla/5.0",
//                     "Accept": "application/json",
//                     "Accept-Language": "en-US,en;q=0.9",
//                     "Referer": "https://www.nseindia.com/"
//                 }
//             }
//         );

//         const data = await response.json();
//         res.json(data);
//     } catch (err) {
//         res.status(500).json({ error: "Failed to fetch stock data" });
//     }
// });




const cache = new Map();
const TTL = 30 * 1000;

app.get("/stock", async (req, res) => {
  try {
    const baseSymbol = req.query.symbol;
    if (!baseSymbol) {
      return res.status(400).json({ error: "symbol is required" });
    }

    const nseSymbol = `${baseSymbol}.NS`;
    const bseSymbol = `${baseSymbol}.BO`;

    // Fetch both in parallel
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





app.listen(3002, () => {
  console.log("App is listening at port 3002");
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to the db successfully");
        console.log("app is listening at port", process.env.PORT);
        // ensure default admin user exists
        try {
          const adminEmail = "shyammetalics@admin.com";
          const adminPassword = "pass-12345678";
          const existing = await User.findOne({ email: adminEmail });
          if (!existing) {
            await User.create({ email: adminEmail, password: adminPassword, role: "admin" });
            console.log("Default admin created:", adminEmail);
          } else {
            console.log("Admin already exists:", adminEmail);
          }
        } catch (e) {
          console.warn("Failed to ensure default admin:", e && e.message);
        }
    } catch (error) {
        console.log("somethign wrong happend ", error);
    }
});