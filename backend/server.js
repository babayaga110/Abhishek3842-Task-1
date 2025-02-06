const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const fs = require("fs");

const app = express();
const PORT = 5002;


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load Google Service Account Credentials
const credentials = JSON.parse(fs.readFileSync("learnify-440307-582e41ec78cb.json"));

// Authenticate Google Sheets API
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Spreadsheet ID (Replace with your actual Google Sheet ID)
const SPREADSHEET_ID = "1IVUnQACt2O2BHoP8-IJ02jGQmjeW6RqDfAakjTjYSEo"; 

// API Endpoint to Save Form Data
app.post("/submit-form", async (req, res) => {
    const { id, name, email, message } = req.body;

    if (!id || !name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const sheets = google.sheets({ version: "v4", auth });
        
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Sheet1!A:D", // Update range if needed
            valueInputOption: "RAW",
            requestBody: {
                values: [[id, name, email, message]],
            },
        });

        res.status(200).json({ message: "Data saved successfully to Google Sheets!" });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ error: "Error saving data to Google Sheets" });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
