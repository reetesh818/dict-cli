const {api_host,api_key} = require('./config')
const Dictionary = require('./Dictionary');
const colors = require('colors');
const readline = require('readline');

//to create a jumbled word to offer as a hint
const jumbleWord = (word) => {
  if (word.length < 2) {
    return word;
  }
  let jumbled = [];
  for (let i = 0; i < word.length; i++) {
    let char = word[i];
    let remainingChars =
      word.slice(0, i) + word.slice(i + 1, word.length);
    for (let jumble of jumbleWord(remainingChars)) {
      jumbled.push(char + jumble);
    }
  }
  return jumbled;
};

const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);
//Beginning of Helper functions

//to take input from user
const input = (questionText) => {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
};

//to show the user options after he/she fails to guess correct
const showOptions = async () => {
  console.log('Enter option\n1. To Try again\n2. Show Hint\n3. Skip \n4. Score \n5. Quit'.blue);
  let option = await input('');
  return Number(option);
};

const userGuess = async () => {
  let response = await input('Enter your word\n'.blue);
  return response;
};

const checkGuess = (word1, word2) => {
  return word1 === word2;
};

//to display the result data in bullets 
const display = (data) => {
  data.map((item,index) => {
      console.log(`${index+1}.${item.text || item}`.yellow)
  })
}

const displayAllDetails = (data) => {
  console.log('Definitions'.blue);
  display(data.definition);
  console.log('Synonym'.blue);
  display(data.synonym);
  console.log('Examples'.blue);
  display(data.example);
}
//End of Helper functions

let def_index = 0;
let syn_index = 0;
let ant_index = 0;
const showRandomHints = (wordDetails) => {
  let hint;
  if (wordDetails['antonym'] != undefined) {
    hint = Math.floor(Math.random() * 4);
  } else hint = Math.floor(Math.random() * 3);

  if (hint === 0) {
    if (def_index <= wordDetails['definition'].length) {
      console.log('definition: ', wordDetails['definition'][def_index++].text);
    }
  } else if (hint === 1) {
    if (syn_index <= wordDetails['synonym'].length) {
      console.log('synonym: ', wordDetails['synonym'][syn_index++]);
    }
  } else if (hint === 2) {
    let jumbled = jumbleWord(wordDetails['word']);
    const temp = Math.floor(Math.random() * jumbled.length + 1);
    console.log('jumbled: ', jumbled[temp]);
  } else if (hint === 3) {
    if (ant_index <= wordDetails['antonym'].length) {
      console.log('antonym: ', wordDetails['antonym'][ant_index++]);
    }
  }
};

const word = {
  async def(opt) {
    try {
      const api = new Dictionary(api_key);
      const response = await api.getDefinition(opt.word);
      console.log('\nDefinitions\n'.blue.bold);
      display(response);
      process.exit();
    } catch (err) {
      console.error(err.message.red);
    }
  },
  async syn(opt) {
    try {
      const api = new Dictionary(api_key);
      const response = await api.getSynonym(opt.word);
      console.log('\nSynonyms\n'.blue.bold);
      display(response);
      process.exit();
    } catch (err) {
      console.error(err.message.red);
    }
  },
  async ant(opt) {
    try {
      const api = new Dictionary(api_key);
      const response = await api.getAntonym(opt.word);
      console.log('\nAntonyms\n'.blue.bold);
      display(response);
      process.exit();
    } catch (err) {
      console.error(err.message.red);
    }
  },
  async ex(opt) {
    try {
      const api = new Dictionary(api_key);
      const response = await api.getExample(opt.word);
      console.log('\nExamples\n'.blue.bold);
      display(response);
      process.exit();
    } catch (err) {
      console.error(err.message.red);
    }
  },
  async wod() {
    try {
      const api = new Dictionary(api_key);
      const response = await api.getRandomWord();
      console.log('\nWord of the Day\n'.blue.bold);
      console.log(response.word);
      displayAllDetails(response);
      process.exit();
    } catch (err) {
      console.error(err.message.red);
    }
  },
  async play() {
    let score = 0;
    let api = new Dictionary(api_key);

    let play_again = true;
    console.log('\nLets Play'.bgGreen.bold);
    while (play_again) {
      console.log('------------------------'.magenta);
      console.log('Score:'.green,score);
      const wordDetails = await api.getRandomWord();

      showRandomHints(wordDetails);
      while (true) {
        const guess = await userGuess();
        let correct = checkGuess(guess, wordDetails['word']);

        if (!correct) {
          console.log('Incorrect Answer'.red);
          score = score > 0 ? score-4 : 0;
          let option = await showOptions();
          if (option === 2) {
            score = score > 0 ? score-3 : 0;
            showRandomHints(wordDetails);
          }else if(option===3){ 
            score = score > 0 ? score - 4 : 0;
            api = new Dictionary(api_key);
            console.log('Word\n'.blue,wordDetails.word);
            displayAllDetails(wordDetails);
            break;
          }else if(option == 4){
            console.log('Score'.green,score);
            
          }
          else if (option === 5) {
            play_again = false;
            break;
          }
        } else {
          score += 10;
          console.log('Correct answer'.green, score);
          break;
        }
      }
      
    }
    if (!play_again) process.exit();
  },
};

module.exports = word;