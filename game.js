const inquirer = require('inquirer');

let questions = [
    //question prompt for guessing the word
    {
        type : 'input',
        name : 'guessWord',
        message : 'guess the word',
        validate : function(value) {
            var passvalue = value.match(/^[A-Za-z]+$/);
            if(passvalue)
                return true;
            return 'Please enter alphabets only.'
        }
    },
    //question prompt for choosing what to do after incorrect answer
    {
        type : 'list',
        name : 'nextOption',
        message : 'what would you do now?',
        choices : ['Try Again', 'Hint', 'Quit']
    },
    //question prompt for choosing between hints
    {
        type : 'list',
        name : 'typeOfHint',
        message : 'which type of hint to you want',
        choices : ['Display the word randomly jumbled', 'Display another definition', 'Display another antonym', 'Display another synonym']
    }
]

function wordGuessPrompt()
{
    return new Promise((resolve, reject) => {
        inquirer
        .prompt(questions[0])
        .then((answer) => {
            resolve(answer);
        });
    });
}

function wrongGuessPrompt()
{
    return new Promise((resolve, reject) =>{
        inquirer
        .prompt(questions[1])
        .then((answer) => {
            resolve(answer);
        });
    });
}

function hintPrompt()
{
    return new Promise((resolve, reject) =>{
        inquirer
        .prompt(questions[2])
        .then((answer) => {
            resolve(answer);
        });
    });
}


function check(guess, ans, wordData)
{
    //Winning Condition: either guess the Right word OR guess its synonym.
    if(guess === ans || wordData['syn'].includes(guess))
    {
        console.log("You've WON!!!");
        if(guess === ans)
            console.log("You guessed the exact word.");
        else   
            console.log(`You guessed a synonym of ${ans}`);
        return true;
    }
    return false;
}

function InfoSoFar(given)
{
    console.log("information available so far :");
    console.log(given);
}

async function Game(wordData, ans, given)
{  
    //console.log(ans);
    
    let guess = await wordGuessPrompt();
    console.log(`Your guess : ${guess.guessWord}`);

    //Winning Condition: either guess the Right word OR guess its synonym. Send to check function
    if(check(guess.guessWord,ans, wordData))
    {
        console.log("First attempt win");
    }
    //Wrong guess -
    else
    {
        console.log("Wrong Answer.");
        let choice = await wrongGuessPrompt();              //Choose what to do next
        console.log(`You chose to ${choice.nextOption}`);

        if(choice.nextOption === 'Try Again')               //Keep trying as many times as you want to
        {
            InfoSoFar(given);
            let sec_attempt = await wordGuessPrompt();
            if(check(sec_attempt.guessWord, ans, wordData))
                console.log("second attempt win");
            else
                console.log(`You lost. Right answer is ${ans}`);
        }
        else if(choice.nextOption === 'Hint')
        {
            let hintType = await hintPrompt();                              //Ask for a hint
            hintType = hintType.typeOfHint;
            console.log(`You chose to ${hintType}`);

            if(hintType === 'Display the word randomly jumbled')            //shuffle the letters of word
            {
                console.log(`The word is jumbled as : ${jumble(ans)}`);     //jumble function defined on bottom    
                InfoSoFar(given);
                let sec_attempt = await wordGuessPrompt();                  //give user a second chance to win
                if(check(sec_attempt.guessWord, ans, wordData))
                    console.log("second attempt win");
                else
                    console.log(`You lost. Right answer is ${ans}`);
            }
            
            else if(hintType === 'Display another definition')              //display another information
            {
                //select another definition (randomly)
                let anotherOne = wordData.defn[ Math.floor( Math.random() * wordData.defn.length )];
                if(!given['defn'].includes(anotherOne))                     //new definition is not already given
                {
                    console.log("Another definition is :" + anotherOne);
                    given['defn'].push(anotherOne);                         //push the new definition to available information
                    InfoSoFar(given);
                    let sec_attempt = await wordGuessPrompt();              //give user a second chance to win
                    if(check(sec_attempt.guessWord, ans, wordData))
                        console.log("second attempt win");
                    else
                        console.log(`You lost. Right answer is ${ans}`);
                }
                else                                                        //new definition is already given
                {
                    //select another definition randomly
                    anotherOne = wordData.defn[ Math.floor( Math.random() * wordData.defn.length )];
                    console.log("Another definition is :" + anotherOne);
                    given['defn'].push(anotherOne);                         //push the new definition to available information
                    InfoSoFar(given);
                    let sec_attempt = await wordGuessPrompt();              //give user a second chance to win
                    if(check(sec_attempt.guessWord, ans, wordData))
                        console.log("second attempt win");
                    else
                        console.log(`You lost. Right answer is ${ans}`);
                }
            }

            else if(hintType === 'Display another antonym')                 //display another antonym
            {
                if(wordData.ant.length>0) {                                  //find another antonym only if word actually contains antonyms
                    let antonym = wordData.ant[Math.floor( Math.random() * wordData.ant.length )];
                    if(!given['ant'].includes(antonym))
                        given['ant'].push(antonym);                         //push the new antonym to available information
                    else
                    {
                        antonym = wordData.ant[Math.floor( Math.random() * wordData.ant.length )];
                        given['ant'].push(antonym);                        //push the new antonym to available information
                    }
                    console.log("new antonym : " + antonym);
                }
                //if antonyms dont exist for the word
                else {
                    console.log(`THIS WORD DOESN'T HAVE ANTONYMS. Try another hint next time`);
                    InfoSoFar(given);
                }
                
                let sec_attempt = await wordGuessPrompt();                      //give user a second chance to win
                if(check(sec_attempt.guessWord, ans, wordData))                 //check if he wins in second attempt
                    console.log("second attempt win");
                else
                    console.log(`You lost. Right answer is ${ans}`);
            }
            
            else if(hintType === 'Display another synonym') {
                let synonym = wordData.syn[Math.floor( Math.random() * wordData.syn.length )];
                console.log("new synonym : " + synonym);
                given['syn'].push(synonym);                                     //push the new synonym to given info
                InfoSoFar(given);
                let sec_attempt = await wordGuessPrompt();                      //give user a second chance to win
                if(check(sec_attempt.guessWord, ans, wordData))
                    console.log("second attempt win");
                else
                    console.log(`You lost. Right answer is ${ans}`);
            }
        }
        else
        {
            console.log(`Right answer is ${ans}.`);
            console.log(wordData);
        }
    }
}

function jumble(word){
    var jumbled = '';
    word = word.split('');
    while (word.length > 0) {
      jumbled +=  word.splice(word.length * Math.random() << 0, 1);
    }
    return jumbled;
}

module.exports = {Game};