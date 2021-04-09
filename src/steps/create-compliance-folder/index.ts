import * as io from '@actions/io';
import * as core from '@actions/core';

import { COMPLIANCE_FOLDER } from '../../shared/constants';

const createComplianceFolder = async (): Promise<void> => {
  try {
    core.info(`Creating Compliance folder on ${COMPLIANCE_FOLDER}.`);

    await io.mkdirP(COMPLIANCE_FOLDER);

    core.info(`Compliance folder created 📂.`);
  } catch (error) {
    throw new Error(
      `Error: failed to create compliance folder ${COMPLIANCE_FOLDER}, ${error.message}.`,
    );
  }
};

export default createComplianceFolder;
