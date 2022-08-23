const axios = require('axios');

const clc = require('cli-color')
let error = clc.red.bold;
let notice = clc.blue;
let warn = clc.yellow;
let magenta = clc.magenta
let blue = clc.blueBright

async function definition(url) {
    await axios
      .get(url)
      .then((res) => {
        let data = res.data;
        display(data);
      })
      .catch((err) => displayError(err.response.data.error));
  }

  function displayError(message){
    console.log(error(message));
  }
  
  function displayWarn(message){
    console.log(warn(message));
  }
  
  function displayHead(message){
    console.log(blue(message));
  }
  
  function display(list){
    list.map((item, index) =>
    console.log(`${index + 1}.${item.text || item} \n`)
  );
  }
  
  
  async function synonyms(url) {
    await axios
      .get(url)
      .then((res) => {
        let data = res.data;
        if(data.length < 2 && data[0].relationshipType=="antonym") {
          displayWarn("There are no synonym present in the dictionary.\n");
        } else {
          data.map((items, index) => {
              if (items.relationshipType == "synonym") {
                display(items.words);
              } 
            });
        }
        
      })
      .catch((err) => displayError(err.response.data.error));
  }
  
  async function antonyms(url) {
    await axios
      .get(url)
      .then((res) => {
        let data = res.data;
        if(data.length < 2 && data[0].relationshipType=="synonym") {
          displayWarn("There are no antonyms present in the dictionary.\n");
        }else {
          data.map((items, index) => {
              if (items.relationshipType == "antonym") {
                display(items.words);
              }
            });
        }
      })
      .catch(err => displayError(err.response.data.error));
  }
  
  async function examples(url) {
    await axios
      .get(url)
      .then((res) => {
        let data = res.data;
        data.examples.map((items, index) => {
          display(data.examples);
        });
      })
      .catch((err) => displayError(err.response.data.error));
  }
  
  async function all(urldef, urlsyn, urlant, urlex) {
    displayHead("Definitions\n");
    await definition(urldef);
    displayHead("Antonyms\n");
    await antonyms(urlsyn);
    displayHead("Synonyms\n");
    await synonyms(urlant);
    displayHead("Examples\n");
    await examples(urlex);
  }
  
  module.exports = {
    definition,
    display,
    displayError,
    displayHead,
    displayWarn,
    synonyms,
    antonyms,
    examples,
    all,
  }