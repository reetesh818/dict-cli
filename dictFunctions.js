// import { api_host, api_key } from '../config';
// import inquirer from 'inquirer';
const {api_host, api_key} = require('./config')
// import { api_host, api_key } from './config';
const axios = require('axios');
let readline = require('readline');
// let inquirer = require('inquirer')


const clc = require('cli-color');
let error = clc.red.bold;
let notice = clc.blue;
let warn = clc.yellow;
let magenta = clc.magenta
let blue = clc.blueBright

let urldef,urlsyn,urlant,urlex;

  
let def_list = []
let syn_list = []
let ant_list = []


function generateLink(word){
  urldef = `${api_host}/word/${word}/definitions?api_key=${api_key}`;
  urlsyn = `${api_host}/word/${word}/relatedWords?api_key=${api_key}`;
  urlant = `${api_host}/word/${word}/relatedWords?api_key=${api_key}`;
  urlex = `${api_host}/word/${word}/examples?api_key=${api_key}`;
}

async function checkAns(res,rand_word){
  let ans = false;
  if(res== rand_word) ans = true;
  else{
    if(syn_list.includes(rand_word)) ans  = true;
  }
  return ans;

}
async function check(rand_word){
  let answer = getInput('Guess the word.')
    // if(checkAns(answer,rand_word))
    if(true)
    return true;
    else return false;
}

function showOptions(){
  console.log('1.Try again!');
  console.log('2.Hint');
  console.log('3.Skip');
}

function getInput(question){
  let result;
  // let rl = readline.createInterface(
  //   process.stdin, process.stdout);
  // rl.question(question, ans => {
  //   result = ans;
  //   rl.close();
  // })
  inquirer.prompt(question).then(ans => {return ans;})
  return result;
}

let score = 0;
async function play(urlrand){
  let rand_word = await randomWord(urlrand);
  generateLink(rand_word);
  let rand = Math.floor(Math.random()*3);
  definition(1);
  synonyms(urlrand,1);
  antonyms(urlrand,1); 
  switch(rand){
    case 0:
      def_list[0];
      break;
    case 1:
      syn_list[0];
      break;
    case 2:
      ant_list[0];
      break;
  }
  if(check(rand_word)){
    score+=10;
  }else {
    let go = true;
    score -= 2;
    while(go){
      showOptions();
      option = getInput('What\'s your choice?'); 
      switch(option){
        case 1: break; //Try again
        case 2: score -= 3; break; //another hint
        case 3: score -=  4; break; //skip 
      }
      showScore(score);
    }
    
  }
}



function set_definitions(list){
  list.map((item,index) => {
    def_list.push(item.text);
  })
}
function set_synonyms(list){
  list.map((item,index) => {
    syn_list.push(item.text||item);
  })
}
function set_antonyms(list){
  
  list.map((item,index) => {
    ant_list.push(item.text || item);
  })
}
async function definition(output=0) {
  
    await axios
      .get(urldef)
      .then((res) => {
        set_definitions(res.data);
        if(output == 0) display(def_list);
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
  
  
  async function synonyms(urlrand,output = 0) {
    await axios
      .get(urlsyn)
      .then((res) => {
        let data = res.data;
        if(data.length < 2 && data[0].relationshipType=="antonym") {
          if(output==0)displayWarn("There are no synonym present in the dictionary.\n");
          else play(urlrand);
        } else {
            data.map((items, index) => {
                  if (items.relationshipType == "synonym") {
                    set_synonyms(items.words); 
                    if(output == 0) { display(syn_list);}
                  } 
                });
        }
        
      })
      .catch((err) => displayError(err.response.data.error));
  }
  
  async function antonyms(urlrand,output = 0) {
    await axios
      .get(urlant)
      .then((res) => {
        let data = res.data;
       
        if(data.length < 2 && data[0].relationshipType=="synonym") {
          if(output == 0) displayWarn("There are no antonyms present in the dictionary.\n");
          else  play(urlrand);
        }else {
          data.map((items, index) => {
              if (items.relationshipType == "antonym") {
                set_antonyms(items.words);
                if(output == 0) {
                  display(ant_list); 
                }    }
            });
        }
      })
      .catch(err => displayError(err.response.data.error));
  }
  
  async function examples() {
    await axios
      .get(urlex)
      .then((res) => {
        let data = res.data;
        display(data.examples);
      })
      .catch((err) => displayError(err.response.data.error));
  }
  
  async function all() {
    displayHead("Definitions\n");
    await definition(urldef);
    displayHead("Antonyms\n");
    await antonyms(urlsyn);
    displayHead("Synonyms\n");
    await synonyms(urlant);
    displayHead("Examples\n");
    await examples(urlex);
  }
  async function randomWord(url){
    return await axios.get(url).then(res => {
      return res.data.word;
    })
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
    play,
    randomWord,
    generateLink,
  }