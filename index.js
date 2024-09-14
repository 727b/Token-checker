const fs = require('fs');
const { Client } = require('discord.js-selfbot-v13');
const colors = require('colors');

const filePath = './tokens.txt'; 

function readTokens() {
  try {
    return fs.readFileSync(filePath, 'utf-8').split(/\r?\n/).filter(token => token.trim() !== '');
  } catch (error) {
    console.error(colors.bgRed.white('Error reading tokens file:'), error);
    process.exit(1);
  }
}

async function checkToken(token) {
  const client = new Client();

  return new Promise((resolve) => {
    client.once('ready', () => {
      console.log(colors.bgWhite.green(`Valid --> ${client.user.tag}.`));
      client.destroy(); 
      resolve(true); 
    });

    client.once('error', (error) => {
      console.error(colors.bgWhite.red('Failed'));
      client.destroy(); 
      resolve(false); 
    });

    client.login(token).catch((error) => {
      console.error(colors.bgWhite.red('Failed'));
      client.destroy(); 
      resolve(false); 
    });
  });
}

function displayResults(total, valid, invalid, invalidTokens) {
  console.clear(); 
  console.log(colors.bgMagenta.white(`Token Checker _/ `));
  console.log(colors.bgMagenta.white(`Checked: ${total}`));
  console.log(colors.bgMagenta.white(`Valid tokens: ${valid}`));
  console.log(colors.bgMagenta.white(`Invalid tokens ×: ${invalid}`));
  console.log(colors.bgBlack.black(''));

  if (invalidTokens.length > 0) {
    invalidTokens.forEach((token, index) => {
      console.log(colors.bgRed.black(`${index + 1}. ${token}`));
    });
  } else {
    console.log(colors.bgGreen.black('Successful --> %100'));
  }

  console.log(colors.bgYellow.bgBlue('Thx For Use This Script Coded by Turki ^-^'));
}

async function main() {
  const tokens = readTokens();
  if (tokens.length === 0) {
    console.log(colors.bgRed.white('No Tokens Found'));
    return;
  }
  console.log(colors.bgWhite.black(`Tokens Total--> {${tokens.length}}`));
  const results = await Promise.all(tokens.map(token => checkToken(token)));
  const validCount = results.filter(result => result).length;
  const invalidCount = results.length - validCount;
  const invalidTokens = tokens.filter((_, index) => !results[index]);

  displayResults(tokens.length, validCount, invalidCount, invalidTokens);

  setInterval(() => {}, 1000); 
}

main();
