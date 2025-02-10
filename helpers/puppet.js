const path = require("path");
const puppeteer = require("puppeteer");
const fs = require("fs");
const csvtojson = require("csvtojson/v2");

const downloadPath = path.resolve("./tmpDownload/");
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
async function convertCSVToJSON(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    return csvtojson({ output: "json" })
      .fromString(data)
      .then((json) => json);
  } catch (e) {
    console.log(e);
    return false;
  }
}
async function deleteFile(filePath) {
  try {
    await fs.promises.unlink(filePath);
    console.log(`File deleted: ${filePath}`);
  } catch (err) {
    console.error(`Error deleting file ${filePath}`, err);
  }
}
async function deleteDownloadedCSV(date) {
  // date in DD-MM-YYYY
  const [yyyy, mm, dd] = date.split("-");
  const isoDate = `${yyyy}-${mm}-${dd}`;
  const fileName = `Today's Price - ${isoDate}.csv`;
  const filePath = path.join("./tmpDownload", fileName);
  console.log("Deleting filepath", filePath);

  await deleteFile(filePath);
}
// Wrap code in an async function to accept the "date" parameter
const savedataFromPuppet = async (date, resolve, reject) => {
  const [dd, mm, yyyy] = date.split("-");

  date = `${mm}/${dd}/${yyyy}`;
  const isoDate = `${yyyy}-${mm}-${dd}`;

  const fileName = `Today's Price - ${isoDate}.csv`;
  const filePath = path.join(downloadPath, fileName);
  // Launch the browser (non-headless mode)
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const cdp = await page.target().createCDPSession();
  await cdp.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadPath,
  });

  // Go to the webpage
  await page.goto("https://nepalstock.com/today-price", {
    waitUntil: "networkidle2",
  });
  if (date) {
    await page.waitForSelector("input[bsdatepicker]");

    await page.evaluate(() => {
      const dateInput = document.querySelector("input[bsdatepicker]");
      if (dateInput) {
        dateInput.value = "";
      }
    });

    // "MM/DD/YYYY" it needs to be in this format.
    await page.type("input[bsdatepicker]", date);

    // Thins thing clicks the filter button
    await page.click(".box__filter--search");

    // might need time to load the table data
    await delay(1000);
  }

  await page.waitForSelector(".table__file");

  // this thing clicks download button
  await page.click(".table__file");

  await delay(3000);
  await browser.close();

  const jsonData = await convertCSVToJSON(filePath);
  if (jsonData) {
    console.log(`Downloaded and converted CSV to JSON for: ${date}`);
    return jsonData;
  }
  return false;
};
module.exports = { savedataFromPuppet, deleteDownloadedCSV };
// savedataFromPuppet("03-02-2025");
