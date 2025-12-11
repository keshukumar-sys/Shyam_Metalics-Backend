const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
require("dotenv").config();
// Middleware

app.use(express.json({ limit: "3mb" })); // JSON body limit
app.use(express.urlencoded({ extended: true, limit: "3mb" })); // URL-encoded limit



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


app.get("/", (req, res) => {
    res.send("Hello! Backend of Shyam Metalics is running.");
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

// =========================
// Start server
// =========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to the db successfully");
        console.log("app is listening at port" , process.env.PORT);
    }catch(error){
        console.log("somethign wrong happend " , error);
    }
});
