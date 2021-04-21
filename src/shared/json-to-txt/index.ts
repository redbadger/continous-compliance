import * as fs from 'fs';
import * as prettier from 'prettier';

const {
  promises: { readFile, writeFile },
} = fs;

const doubleQuotes = /(\")/gm;
const curlyBraces = /(\{|\})/gm;
const squareBraces = /(\[|\])/gm;
const commas = /(\,)/gm;
const semiColon = /(\;)/gm;

const prettierOptions: prettier.Options = {
  trailingComma: 'all',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  parser: 'json-stringify',
};

interface JsonToTxt {
  jsonFilePath: string;
  txtFilePath: string;
}

/**
 * @async
 * @description
 * From the contents of a JSON file beautify the code and make human readeable
 * @exports jsonToTxt
 * @function
 * @name jsonToTxt
 * @param {JsonToTxt}
 * @returns {void}
 */

const jsonToTxt = async ({
  jsonFilePath,
  txtFilePath,
}: JsonToTxt): Promise<void> => {
  try {
    // Read the contents of a JSON file
    const data = await readFile(jsonFilePath);

    // Using prettier make JSON to be human readeable
    const txt = prettier
      .format(data.toString('utf8').trim(), prettierOptions)
      // Remove Double quotes, curly braces, square braces, commas and semi colons
      .replace(doubleQuotes, '')
      .replace(curlyBraces, '')
      .replace(squareBraces, '')
      .replace(commas, '')
      .replace(semiColon, '');

    // Write into disk
    await writeFile(txtFilePath, txt);
  } catch (error) {
    throw new Error(`
      Failed to create a txt file ${error.message}
    `);
  }
};

export default jsonToTxt;
