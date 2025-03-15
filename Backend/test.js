import puppeteer from "puppeteer";

const parseDuration = (durationText) => {
    const match = durationText.match(/(\d+)d (\d+)h (\d+)m (\d+)s/);
    if (!match) return null;

    const [_, days, hours, minutes, seconds] = match.map(Number);
    return ((days * 24 + hours) * 60 + minutes) * 60 * 1000 + seconds * 1000;
};

const scrapeCPHelper = async () => {
    try {
        console.log("🚀 Launching Puppeteer...");
        const browser = await puppeteer.launch({ headless: false, slowMo: 50 });

        const page = await browser.newPage();
        console.log("🌍 Navigating to CPHelper Contests Page...");
        
        await page.goto("https://cphelper.online/", { waitUntil: "networkidle2", timeout: 60000 });

        await page.waitForSelector(".platform-card.glass-panel", { timeout: 15000 });

        console.log("📡 Extracting Contests...");
        let contests = await page.$$eval(".platform-card.glass-panel", (cards) => {
            return cards.map(card => {
                let rawPlatform = card.querySelector(".platform-header")?.innerText.trim() || "N/A";
                let contestName = rawPlatform.split("\n")[0];//  Extracting name
                let platform_=rawPlatform.split(" ")[0];
                let rawDuration = card.querySelector(".contest-status")?.innerText.trim() || "N/A";

                return {
                    name: contestName,
                    url: card.querySelector("a")?.href || "N/A",
                    platform: platform_,
                    startTime: rawDuration.startsWith("Starts in:") ? rawDuration : "N/A",
                    duration: rawDuration,
                };
            });
        });

        // Convert duration to start time
        contests = contests.map(contest => {
            if (contest.duration.startsWith("Starts in:")) {
                let ms = parseDuration(contest.duration.replace("Starts in: ", ""));
                if (ms !== null) {
                    contest.startTime = new Date(Date.now() + ms).toLocaleString(); // Convert to readable date
                }
            }
            return contest;
        });

        console.log("✅ Scraped Contests:", contests);

        await browser.close();
        console.log("✅ Scraping Completed!");
    } catch (error) {
        console.error("❌ Error:", error);
    }
};

// Run the scraper
scrapeCPHelper();
