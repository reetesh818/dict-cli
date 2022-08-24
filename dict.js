#! /usr/bin/env node
const {api_host, api_key} = require('./config')
// import { api_host, api_key } from './config.js'
const lib = require('./dictFunctions')



const definition = lib.definition
const antonyms = lib.antonyms
const synonyms = lib.synonyms
const all = lib.all
const examples = lib.examples
const display = lib.display
const displayError = lib.displayError
const displayHead = lib.displayHead
const displayWarn = lib.displayWarn
const play = lib.play
const randomWord = lib.randomWord
const generateLink = lib.generateLink

const axios = require("axios");
const clc = require('cli-color')

const cmd = process.argv[2];
const len = process.argv.length;
let word = len > 3 ? process.argv[3] : process.argv[2];
const string = process.argv;
const flag = string.includes("play") ? true : false;

//color coding
let error = clc.red.bold;
let notice = clc.blue;
let warn = clc.yellow;
let magenta = clc.magenta
let blue = clc.blueBright

let urldef , urlsyn , urlant,urlex;
let urlrand = `${api_host}/words/randomWord?api_key=${api_key}`;

// async function randomWord(){
//   return await axios.get(urlrand).then(res => {
//     return res.data.word;
//   })
// }
async function wordOfTheDay(){
        let rand_word = await randomWord((urlrand));
        console.log(magenta(rand_word.toUpperCase() , "\n"));
        generateLink(rand_word);
        all(urldef,urlsyn,urlant,urlex);
}


// function generateLink(word){
//   urldef = `${api_host}/word/${word}/definitions?api_key=${api_key}`;
//   urlsyn = `${api_host}/word/${word}/relatedWords?api_key=${api_key}`;
//   urlant = `${api_host}/word/${word}/relatedWords?api_key=${api_key}`;
//   urlex = `${api_host}/word/${word}/examples?api_key=${api_key}`;
// }



if (len > 3) {
  generateLink(word);
  switch (cmd) {

    case "def":
      displayHead("Definitions\n");
     definition();
      break;

    case "syn":
      displayHead("Synonyms\n");
      synonyms();
      break;

    case "ant":
      displayHead("Antonyms\n");
      antonyms();
      break;

    case "ex":
      displayHead("Examples\n");
      examples();
      break;

    default:
      displayError("Invalid command");

  }
} else if (len > 2 && !flag) {

  displayHead("Full Deatils");
  all();

} else if (len > 1 && !flag) {

  displayHead("Word of the day\n");
  wordOfTheDay();

} else if (len > 0 && flag) {

  displayHead("Let's Play!");
  play(urlrand);

} else {

  displayError("Invalid Command");

}

