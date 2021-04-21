import * as exec from '@actions/exec';
import * as core from '@actions/core';

import { COMPLIANCE_FOLDER } from '../../shared/constants';

/**
 * @name createUnixTimeLabel
 * @returns {number}
 * @function
 * @description Create a unix timestamp to use as file name for compressed folder
 */
const createUnixTimeLabel = (): number =>
  Number((new Date().getTime() / 1000).toFixed(0));

/**
 * @name compressComplianceFolder
 * @exports compressComplianceFolder
 * @function
 * @async
 * @returns {void}
 * @description Compress (zip) compliance folder and the zip file with an Unix timestamp, e.g. `1617971697.zip`
 */

const compressComplianceFolder = async (): Promise<void> => {
  // Create a unix timestamp

  const unixTimeLabel = createUnixTimeLabel();
  // Logging into the console
  try {
    core.info(
      `Compressing compliance folder and naming it ${unixTimeLabel}.zip 🗜`,
    );

    // Compress folder
    await exec.exec(`zip -r ${unixTimeLabel}.zip ./${COMPLIANCE_FOLDER}`);

    core.info(`Compliance folder compressed`);
  } catch (error) {
    throw new Error(
      `Error: failed to compressed ${COMPLIANCE_FOLDER}, ${error.message}.`,
    );
  }
};

export default compressComplianceFolder;
