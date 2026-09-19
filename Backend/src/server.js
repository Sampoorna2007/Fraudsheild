const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const transactionRoutes = require("./routes/transactionRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { initializeSocket } = require("./socket/socket");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/transactions", transactionRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initializeSocket(server);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });

app.get("/", (req, res) => {
    res.json({
        message: "Fraudsheild Backend is running"
    });
});