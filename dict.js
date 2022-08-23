#! /usr/bin/env node
const lib = require('./modules/dictFunctions')

const definition = lib.definition
const antonyms = lib.antonyms
const synonyms = lib.synonyms
const all = lib.all
const examples = lib.examples
const display = lib.display
const displayError = lib.displayError
const displayHead = lib.displayHead
const displayWarn = lib.displayWarn

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

//color coding
let error = clc.red.bold;
let notice = clc.blue;
let warn = clc.yellow;
let magenta = clc.magenta
let blue = clc.blueBright

let urldef , urlsyn , urlant,urlex;

async function wordOfTheDay(){
    await axios.get(urlrand).then(res => {
        let word = res.data.word
        console.log(magenta(word.toUpperCase() , "\n"));
        generateLink(word);
        all(urldef,urlsyn,urlant,urlex);
    })
}


function generateLink(word){
  urldef = `${api_host}/word/${word}/definitions?api_key=${api_key}`;
  urlsyn = `${api_host}/word/${word}/relatedWords?api_key=${api_key}`;
  urlant = `${api_host}/word/${word}/relatedWords?api_key=${api_key}`;
  urlex = `${api_host}/word/${word}/examples?api_key=${api_key}`;
}

const urlrand = `${api_host}/words/randomWord?api_key=${api_key}`;

if (len > 3) {
  generateLink(word);
  switch (cmd) {

    case "def":
      displayHead("Definitions\n");
     definition(urldef);
      break;

    case "syn":
      displayHead("Synonyms\n");
      synonyms(urlsyn);
      break;

    case "ant":
      displayHead("Antonyms\n");
      antonyms(urlant);
      break;

    case "ex":
      displayHead("Examples\n");
      examples(urlex);
      break;

    default:
      displayError("Invalid command");

  }
} else if (len > 2 && !flag) {

  displayHead("Full Deatils");
  all(urldef, urlsyn, urlant, urlex);

} else if (len > 1 && !flag) {

  displayHead("Word of the day\n");
  wordOfTheDay();

} else if (len > 0 && flag) {

  console.log(clc.magenta("Lets play"));

} else {

  displayError("Invalid Command");

}

