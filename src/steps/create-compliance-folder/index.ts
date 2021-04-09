import * as io from '@actions/io';

import { COMPLIANCE_FOLDER } from '../../shared/constants';
import logger from '../../shared/logger';

const createComplianceFolder = async (): Promise<void> => {
  try {
    logger.info(`Creating Compliance folder on ${COMPLIANCE_FOLDER}.`);

    await io.mkdirP(COMPLIANCE_FOLDER);

    logger.info(`Compliance folder created 📂.`);
  } catch (error) {
    throw new Error(
      `Error: failed to create compliance folder ${COMPLIANCE_FOLDER}, ${error.message}.`,
    );
  }
};

export default createComplianceFolder;
