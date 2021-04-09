import * as exec from '@actions/exec';
import { COMPLIANCE_FOLDER } from '../../shared/constants';

const createUnixTimeLabel = (): number =>
  Number((new Date().getTime() / 1000).toFixed(0));

const compressComplianceFolder = async (): Promise<void> => {
  const unixTimeLabel = createUnixTimeLabel();

  try {
    await exec.exec(`zip -r ${unixTimeLabel}.zip ./${COMPLIANCE_FOLDER}`);
  } catch (error) {
    throw new Error(
      `Error: failed to compressed ${COMPLIANCE_FOLDER}, ${error.message}.`,
    );
  }
};

export default compressComplianceFolder;
