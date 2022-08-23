#! /usr/bin/env node

const axios = require("axios");
const clc = require('cli-color')

const api_host = "https://fourtytwowords.herokuapp.com";
const api_key =
  "be45adfee7c617ff1b22a4ffccdf2687a8b7f484d1fc0603388c9f5d51879871e6fa92b0cb6fa6915f86e5c59d2c815b45496db11041a065ff6339318c925201";
const cmd = process.argv[2];
const len = process.argv.length;

const word = len > 3 ? process.argv[3] : process.argv[2];

const string = process.argv;
const flag = string.includes("play") ? true : false;

// console.log(len);

// // console.log(cmd,word)
async function definition(url) {
  await axios
    .get(url)
    .then((res) => {
      let data = res.data;
      data.map((item, index) => console.log(`${index + 1}.${item.text} \n`));
    })
    .catch((err) => console.log(clc.red.bold(err.response.data.error)));
}

async function synonyms(url) {
  await axios
    .get(url)
    .then((res) => {
      let data = res.data;
      if(data.length < 2 && data[0].relationshipType=="antonym") {
        console.log(clc.red("There are no synonym present in the dictionary.\n"));
      } else {
        data.map((items, index) => {
            if (items.relationshipType == "synonym") {
              items.words.map((item, index) =>
                console.log(`${index + 1}.${item} \n`)
              );
            } 
          });
      }
      
    })
    .catch((err) => console.log(clc.red.bold(err.response.data.error)));
}

async function antonyms(url) {
  await axios
    .get(url)
    .then((res) => {
      let data = res.data;
      if(data.length < 2 && data[0].relationshipType=="synonym") {
        console.log(clc.red("There are no antonyms present in the dictionary.\n"));
      }else {
        data.map((items, index) => {
            if (items.relationshipType == "antonym") {
              items.words.map((item, index) =>
                console.log(`${index + 1}.${item} \n`)
              );
            }
          });
      }
    })
    .catch((err) => console.log(clc.red.bold(err.response.data.error)));
}

async function examples(url) {
  await axios
    .get(url)
    .then((res) => {
      let data = res.data;
      data.examples.map((items, index) => {
        console.log(`${index + 1}. ${items.text} \n`);
      });
    })
    .catch((err) => console.log(clc.red.bold(err.response.data.error)));
}
async function all(urldef, urlsyn, urlant, urlex) {
  console.log(clc.yellow("Definitions\n"));
  await definition(urldef);
  console.log(clc.yellow("Antonyms\n"));
  await antonyms(urlsyn);
  console.log(clc.yellow("Synonyms\n"));
  await synonyms(urlant);
  console.log(clc.yellow("Examples\n"));
  await examples(urlex);
}

async function wordOfTheDay(){
    await axios.get(urlrand).then(res => {
        let data = res.data
        console.log(clc.blue.bold(data.word , "\n"));
        let urldef  = `${api_host}/word/${data.word}/definitions?api_key=${api_key}`
        let urlsyn = `${api_host}/word/${data.word}/relatedWords?api_key=${api_key}`
        let urlant = `${api_host}/word/${data.word}/relatedWords?api_key=${api_key}`
        let urlex = `${api_host}/word/${data.word}/examples?api_key=${api_key}`
        all(urldef,urlsyn,urlant,urlex);
    })
}

const urldef = `${api_host}/word/${word}/definitions?api_key=${api_key}`;
const urlsyn = `${api_host}/word/${word}/relatedWords?api_key=${api_key}`;
const urlant = `${api_host}/word/${word}/relatedWords?api_key=${api_key}`;
const urlex = `${api_host}/word/${word}/examples?api_key=${api_key}`;
const urlrand = `${api_host}/words/randomWord?api_key=${api_key}`;

if (len > 3) {
  switch (cmd) {
    case "def":
        console.log(clc.yellow("Definitions\n"));

      definition(urldef);
      break;
    case "syn":
        console.log(clc.yellow("Antonyms\n"));

      synonyms(urlsyn);
      break;
    case "ant":
        console.log(clc.yellow("Synonyms\n"));

      antonyms(urlant);
      break;
    case "ex":
        console.log(clc.yellow("Examples\n"));

      examples(urlex);
      break;
    default:
      console.log("Invalid command");
  }
} else if (len > 2 && !flag) {
  console.log(clc.blue("Full Deatils"));
  all(urldef, urlsyn, urlant, urlex);
} else if (len > 1 && !flag) {
  console.log(clc.green("Word of the day\n"));
  wordOfTheDay();
} else if (len > 0 && flag) {
  console.log(clc.magenta("Lets play"));
} else {
  console.log(clc.red.bold("Invalid Command"));
}
