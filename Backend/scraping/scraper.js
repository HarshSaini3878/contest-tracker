import mongoose from "mongoose";
import puppeteer from "puppeteer";
import cron from "node-cron";
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
    const browser = await puppeteer.launch({ headless: true });

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
        let rawPlatform = card.querySelector(".platform-header")?.innerText.trim() || "N/A";
        let contestName = rawPlatform.split("\n")[0].trim();
        let rawDuration = card.querySelector(".contest-status")?.innerText.trim() || "N/A";

        return {
          name: contestName,
          url: card.querySelector("a")?.href || "N/A",
          platform: rawPlatform.replace(/\n.*/, ""),
          startTime: rawDuration.startsWith("Starts in:") ? rawDuration : "N/A",
          duration: rawDuration,
        };
      });
    });

    // Convert duration to startTime (Date object)
    contests = contests.map((contest) => {
      if (contest.duration.startsWith("Starts in:")) {
        let ms = parseDuration(contest.duration.replace("Starts in: ", ""));
        if (ms !== null) {
          contest.startTime = new Date(Date.now() + ms);
        }
      } else if (contest.duration.includes("Ended")) {
        contest.startTime = new Date(Date.now() - 86400000); // Set ended contests to 1 day in the past
      }
      return contest;
    });

    console.log("✅ Scraped Contests:", contests);

    await browser.close();
    console.log("✅ Scraping Completed!");

    // Save contests to MongoDB
    await saveContestsToDB(contests);
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Function to save contests to MongoDB
const saveContestsToDB = async (contests) => {
  try {
    console.log("💾 Clearing old contests...");
    await Contest.deleteMany({}); // Delete all old data

    console.log("💾 Saving contests to MongoDB...");
    for (const contest of contests) {
      await Contest.findOneAndUpdate(
        { name: contest.name, platform: contest.platform },
        contest,
        { upsert: true, new: true }
      );
    }
    console.log("✅ Contests saved successfully!");
  } catch (error) {
    console.error("❌ Error saving contests:", error);
  }
};

// Connect to MongoDB and run scraper
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

cron.schedule("0 0 * * *", async () => {
  console.log("⏳ Running scheduled contest scraper...");
  await scrapeAll();
});

console.log("🕒 Cron job scheduled: Scraping contests midnight.");
