const axios = require('axios');
const colors = require('colors');

class Dictionary {
  constructor(apiKey) {
    this.api_key = apiKey;
    this.api_host = 'https://fourtytwowords.herokuapp.com';
  }

  getDefinition(word) {
    return axios
      .get(`${this.api_host}/word/${word}/definitions?api_key=${this.api_key}`)
      .then((response) => {
        return (response.data);
      })
      .catch((err) => handleError(err));
  }
  getRelatedWord(word) {
    return axios
      .get(`${this.api_host}/word/${word}/relatedWords?api_key=${this.api_key}`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => handleError(err));
  }

  async getSynonym(word) {
    const res = await this.getRelatedWord(word);
    if (res.length > 1) return res[1].words;
    else return res[0].words;
  }
  async getAntonym(word) {
    const res = await this.getRelatedWord(word);
    if (res.length > 1) return res[0].words;
    else return 'No antonym found';
  }
  getExample(word) {
    return axios
      .get(`${this.api_host}/word/${word}/examples?api_key=${this.api_key}`)
      .then((response) => {
        return (response.data.examples);
      })
      .catch((err) => handleError(err));
  }
  async getRandomWord() {
    try {
      const res = await axios.get(
        `${this.api_host}/words/randomWord?api_key=${this.api_key}`
      );
      let randWordDetails = {};

      const randomWord = res.data.word;
      const definitions = this.getDefinition(randomWord);
      const example = this.getExample(randomWord);
      const relatedWords = this.getRelatedWord(randomWord);

      const values = await Promise.all([definitions, example, relatedWords]);

      randWordDetails['word'] = randomWord;
      randWordDetails['definition'] = values[0];
      randWordDetails['example'] = values[1];
      if (values[2].length > 1) {
        randWordDetails['antonym'] = values[2][0].words;
        randWordDetails['synonym'] = values[2][1].words;
      } else randWordDetails['synonym'] = values[2][0].words;
      return randWordDetails;
    } catch (err) {
      console.error(err);
    }
  }
}

function handleError(err) {
  //to handle authorization
  if (err.response.status === 401) {
    console.log(
      'Invalid API key -Go to https://fourtytwowords.herokuapp.com'.bgRed
    );
  } else if (err.response.status === 404) {   // to handle unreachable condition
    console.log('Cannot reach the server, Try again later'.bgYellow);
  } else {                  //to handle when word doesn't exists
    console.log('Word Not Found'.red); 
  }
  process.exit();  //to exit the process
}

module.exports = Dictionary;