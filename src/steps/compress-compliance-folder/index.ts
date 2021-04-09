import * as exec from '@actions/exec';

import { COMPLIANCE_FOLDER } from '../../shared/constants';
import logger from '../../shared/logger';

const createUnixTimeLabel = (): number =>
  Number((new Date().getTime() / 1000).toFixed(0));

const compressComplianceFolder = async (): Promise<void> => {
  const unixTimeLabel = createUnixTimeLabel();

  try {
    logger.info(
      `Compressing compliance folder and naming it ${unixTimeLabel}.zip 🗜`,
    );

    await exec.exec(`zip -r ${unixTimeLabel}.zip ./${COMPLIANCE_FOLDER}`);

    logger.info(`Compressing compliance folder compressed`);
  } catch (error) {
    throw new Error(
      `Error: failed to compressed ${COMPLIANCE_FOLDER}, ${error.message}.`,
    );
  }
};

export default compressComplianceFolder;
