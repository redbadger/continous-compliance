import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { COMPLIANCE_FOLDER } from '../../shared/constants';

const createUnixTimeLabel = () =>
  Number((new Date().getTime() / 1000).toFixed(0));

const compressComplianceFolder = async (): Promise<void> => {
  const unixTimeLabel = createUnixTimeLabel();

  try {
    await exec.exec(`zip -r ${unixTimeLabel}.zip ./${COMPLIANCE_FOLDER}`);
  } catch (error) {
    core.setFailed(
      `Compress folder ${COMPLIANCE_FOLDER} failed with error: ${error.message}`,
    );
  }
};

export default compressComplianceFolder;
