import mongoose from "mongoose";
import puppeteer from "puppeteer";
import Contest from "../models/contestModel.js";

// Function to convert "Starts in: Xd Xh Xm Xs" to milliseconds
const parseDuration = (durationText) => {
  const match = durationText.match(/(?:(\d+)d )?(?:(\d+)h )?(?:(\d+)m )?(?:(\d+)s)?/);
  if (!match) return null;

  const [_, days = 0, hours = 0, minutes = 0, seconds = 0] = match.map((v) => Number(v) || 0);
  return ((days * 24 + hours) * 60 + minutes) * 60 * 1000 + seconds * 1000;
};

const scrapeCPHelper = async () => {
  try {
    console.log("🚀 Launching Puppeteer...");
    const browser = await puppeteer.launch({ headless: false, slowMo: 50 });

    const page = await browser.newPage();
    console.log("🌍 Navigating to CPHelper Contests Page...");

    await page.goto("https://cphelper.online/", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await page.waitForSelector(".platform-card.glass-panel", { timeout: 15000 });

    console.log("📡 Extracting Contests...");
    let contests = await page.$$eval(".platform-card.glass-panel", (cards) => {
      return cards.map((card) => {
        let platformElement = card.querySelector(".platform-header");
        let contestName = platformElement ? platformElement.innerText.split("\n")[0].trim() : "Unknown";

        let rawDuration = card.querySelector(".contest-status")?.innerText.trim() || "N/A";
        let contestUrl = card.querySelector("a")?.href || "N/A";

        return {
          name: contestName,
          url: contestUrl,
          platform: contestName, // Extracted correctly
          startTime: rawDuration.startsWith("Starts in:") ? rawDuration : rawDuration.includes("Ended") ? "Ended" : "N/A",
          duration: rawDuration,
        };
      });
    });

    // Convert duration to startTime (Date object)
    contests = contests.map((contest) => {
      if (contest.duration.startsWith("Starts in:")) {
        let ms = parseDuration(contest.duration.replace("Starts in: ", ""));
        if (ms !== null) {
          contest.startTime = new Date(Date.now() + ms); // Store as Date object
        }
      } else if (contest.startTime === "Ended") {
        contest.startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Set to a past date (7 days ago)
      }
      return contest;
    });

    console.log("✅ Scraped Contests:", contests);

    await browser.close();
    console.log("✅ Scraping Completed!");

    // Delete old data and save new contests to MongoDB
    await saveContestsToDB(contests);
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Function to delete old data and save new contests
const saveContestsToDB = async (contests) => {
  try {
    console.log("🗑 Deleting old contest data...");
    await Contest.deleteMany({}); // Delete all old contests

    console.log("💾 Saving new contests to MongoDB...");
    await Contest.insertMany(contests); // Insert all new contests at once

    console.log("✅ Contests saved successfully!");
  } catch (error) {
    console.error("❌ Error saving contests:", error);
  }
};

// Connect to MongoDB and scrape contests
const scrapeAll = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/contestTracker", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB!");

    await scrapeCPHelper();

    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed!");
  } catch (error) {
    console.error("❌ Error in MongoDB connection:", error);
  }
};

scrapeAll();
