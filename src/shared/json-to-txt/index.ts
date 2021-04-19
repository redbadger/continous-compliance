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
  // parser: 'babel',
};

interface JsonToTxt {
  jsonFilePath: string;
  txtFilePath: string;
}

const jsonToTxt = async ({
  jsonFilePath,
  txtFilePath,
}: JsonToTxt): Promise<void> => {
  try {
    const data = await readFile(jsonFilePath);

    const raw = prettier.format(data.toString('utf8').trim(), prettierOptions);

    console.log({ raw });

    const txt = raw
      .replace(doubleQuotes, '')
      .replace(curlyBraces, '')
      .replace(squareBraces, '')
      .replace(commas, '')
      .replace(semiColon, '');

    await writeFile(txtFilePath, txt);
  } catch (error) {
    throw new Error(`
      Failed to create a txt file ${error.message}
    `);
  }
};

export default jsonToTxt;
