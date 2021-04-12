import * as exec from '@actions/exec';
import * as core from '@actions/core';

import { COMPLIANCE_FOLDER } from '../../shared/constants';

const createUnixTimeLabel = (): number =>
  Number((new Date().getTime() / 1000).toFixed(0));

const compressComplianceFolder = async (): Promise<void> => {
  const unixTimeLabel = createUnixTimeLabel();

  try {
    core.info(
      `Compressing compliance folder and naming it ${unixTimeLabel}.zip 🗜`,
    );

    await exec.exec(`zip -r ${unixTimeLabel}.zip ./${COMPLIANCE_FOLDER}`);
    await exec.exec(`ls -lah`);

    core.info(`Compliance folder compressed`);
  } catch (error) {
    throw new Error(
      `Error: failed to compressed ${COMPLIANCE_FOLDER}, ${error.message}.`,
    );
  }
};

export default compressComplianceFolder;
