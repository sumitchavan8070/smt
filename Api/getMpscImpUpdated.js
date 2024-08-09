const axios = require("axios");
const cheerio = require("cheerio");

const fetchImportantUpdates = async () => {
  try {
    const response = await axios.get("https://mpsc.gov.in/");
    const $ = cheerio.load(response.data);

    const importantUpdates = [];

    // Example: Extracting titles of news updates
    $("div.news-items a").each((index, element) => {
      const title = $(element).text();
      importantUpdates.push({ title });
    });

    return importantUpdates;
  } catch (error) {
    console.error("Error fetching important updates:", error);
    return [];
  }
};

fetchImportantUpdates().then((updates) => {
  console.log("Important updates:", updates);
});
