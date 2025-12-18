const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
require("dotenv").config();
const cors = require('cors');
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to the db successfully");
        console.log("app is listening at port", process.env.PORT);
    } catch (error) {
        console.log("somethign wrong happend ", error);
    }
});
