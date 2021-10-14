//const PORT = 8000;
const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { response, json } = require("express");

//****Sources
//@ thetimes, theguardian, telegraph, nytimes, washingtonpost, latimes, bbc
const newspapers = [
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change/",
    base: "",
  },
  {
    name: "theguardian",
    address: "https://www.theguardian.com/environment/climate-crisis/",
    base: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change/",
    base: "https://www.telegraph.co.uk",
  },
  ,
  {
    name: "nytimes",
    address: "https://www.nytimes.com/section/climate?searchResultPosition=0/",
    base: "https://www.nytimes.com",
  },
  ,
  {
    name: "washingtonpost",
    address: "https://www.washingtonpost.com/climate-environment/",
    base: "https://www.washingtonpost.com",
  },

  ,
  {
    name: "latimes",
    address: "https://www.latimes.com/environment/",
    base: "https://www.latimes.com",
  },
  ,
  {
    name: "bbc",
    address: "https://www.bbc.com/news/science-environment-56837908",
    base: "https://www.bbc.com",
  },
];

//get express, call it and save it in = app
const app = express();

const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    $('a:contains("climate")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

//start scriping
//path '/': routing syntax (req, res) => {}:
app.get("/", (req, res) => {
  res.json("Welcome to my climate change news API");
});

//express
app.get("/news", (req, res) => {
  res.json(articles);
});

//get news from a news /  by id
app.get("/news/:newspaperId", (req, res) => {
  // console.log(req.params.newspaperId);
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].address;

  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      const specificArticles = [];

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");

        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      //display in the browser
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

//lister to port
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
