import puppeteer from "puppeteer";
import mongoose from "mongoose";
import Contest from "../models/contestModel.js";


const scrapeCodeChef = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.codechef.com/contests");

  const contests = await page.evaluate(() => {
    const contestRows = Array.from(document.querySelectorAll("#future-contests tbody tr"));
    return contestRows.map(row => {
      const cols = row.querySelectorAll("td");
      return {
        name: cols[0].innerText.trim(),
        url: "https://www.codechef.com" + cols[0].querySelector("a").getAttribute("href"),
        platform: "CodeChef",
        startTime: new Date(cols[1].innerText.trim()),
        duration: cols[2].innerText.trim(),
      };
    });
  });

  await Contest.deleteMany({ platform: "CodeChef" });
  await Contest.insertMany(contests);
  await browser.close();
  console.log("✅ CodeChef contests updated");
};


const scrapeCodeforces = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://codeforces.com/contests");

  const contests = await page.evaluate(() => {
    const contestRows = Array.from(document.querySelectorAll(".datatable tbody tr"));
    return contestRows.map(row => {
      const cols = row.querySelectorAll("td");
      return {
        name: cols[0].innerText.trim(),
        url: "https://codeforces.com" + cols[0].querySelector("a").getAttribute("href"),
        platform: "Codeforces",
        startTime: new Date(cols[2].innerText.trim()),
        duration: cols[3].innerText.trim(),
      };
    });
  });

  await Contest.deleteMany({ platform: "Codeforces" });
  await Contest.insertMany(contests);
  await browser.close();
  console.log("✅ Codeforces contests updated");
};


const scrapeLeetCode = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://leetcode.com/contest/");

  const contests = await page.evaluate(() => {
    const contestRows = Array.from(document.querySelectorAll(".swiper-wrapper .swiper-slide"));
    return contestRows.map(slide => {
      const contestLink = slide.querySelector("a");
      return {
        name: contestLink.innerText.trim(),
        url: "https://leetcode.com" + contestLink.getAttribute("href"),
        platform: "LeetCode",
        startTime: new Date(slide.querySelector(".text-label-2").innerText.trim()),
        duration: "Unknown", // LeetCode doesn't show duration directly
      };
    });
  });

  await Contest.deleteMany({ platform: "LeetCode" });
  await Contest.insertMany(contests);
  await browser.close();
  console.log("✅ LeetCode contests updated");
};

// Run all scrapers
const scrapeAll = async () => {
  await mongoose.connect("mongodb://localhost:27017/contestTracker", { useNewUrlParser: true, useUnifiedTopology: true });
  await scrapeCodeChef();
  await scrapeCodeforces();
  await scrapeLeetCode();
  mongoose.connection.close();
};

scrapeAll();
