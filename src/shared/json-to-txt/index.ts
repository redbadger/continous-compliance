import * as fs from 'fs';
const {
  promises: { readFile, writeFile },
} = fs;

const doubleQuotes = /(\")/gm;
const curlyBraces = /(\{|\})/gm;
const squareBraces = /(\[|\])/gm;
const commas = /(\,)/gm;

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

    const txt = data
      .toString('utf8')
      .trim()
      .replace(doubleQuotes, '')
      .replace(curlyBraces, '')
      .replace(squareBraces, '')
      .replace(commas, '');

    await writeFile(txtFilePath, txt);
  } catch (error) {
    throw new Error(`
      Failed to create a txt file ${error.message}
    `);
  }
};

export default jsonToTxt;
