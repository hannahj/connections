const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Go to the wordfinder page
    await page.goto('https://wordfinder.yourdictionary.com/nyt-connections/', { waitUntil: 'networkidle2' });

    // Wait for the words to load
    await page.waitForSelector('span.flip-front', { timeout: 10000 });

    // Extract the words
    const words = await page.evaluate(() => {
        const wordElements = document.querySelectorAll('span.flip-front');
        return Array.from(wordElements)
            .slice(0, 16)  // Get only the first 16 words
            .map(el => el.textContent.trim());
    });

    console.log(words);

    // Save the words to a JSON file
    fs.writeFileSync('words.json', JSON.stringify(words, null, 2));

    await browser.close();
})();
