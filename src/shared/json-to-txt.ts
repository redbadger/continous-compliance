import { promises } from 'fs';
const { readFile, writeFile } = promises;

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
  const data = await readFile(jsonFilePath);
  const txt = data
    .toString('utf8')
    .trim()
    .replace(doubleQuotes, '')
    .replace(curlyBraces, '')
    .replace(squareBraces, '')
    .replace(commas, '');

  await writeFile(txtFilePath, txt);
};

jsonToTxt({
  jsonFilePath: './src/shared/info.json',
  txtFilePath: './src/shared/info.txt',
});
