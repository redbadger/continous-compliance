import * as glob from '@actions/glob';
import * as core from '@actions/core';

import { COMPLIANCE_FOLDER } from '../../shared/constants';
import jsonToTxt from '../../shared/json-to-txt';

const patterns = [`${COMPLIANCE_FOLDER}/**/**.json`];

const getTxtPath = (path: string): string => path.replace(/json/gm, 'txt');

const createTxtFiles = async () => {
  try {
    const globber = await glob.create(patterns.join('\n'));
    const files = await globber.glob();
    await Promise.all(
      files.map(async (file) => {
        const txtFilePath = getTxtPath(file);
        core.info(`Create text file ${txtFilePath}`);
        await jsonToTxt({
          jsonFilePath: file,
          txtFilePath,
        });
      }),
    );
  } catch (error) {
    throw new Error(`Failed to create text files, ${error.message}`);
  }
};

export default createTxtFiles;
