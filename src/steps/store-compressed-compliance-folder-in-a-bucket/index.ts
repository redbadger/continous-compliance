import * as core from '@actions/core';

const storeCompressedComplianceFolderInABucket = async (): Promise<void> => {
  const gcpProjectId = core.getInput('gcp-project-id', { required: true });
  const gcpApplicationCredentials = core.getInput(
    'gcp-application-credentials',
    { required: true },
  );

  const isGcpProjectIdSet = Boolean(gcpProjectId);
  const isGcpApplicationCredentials = Boolean(gcpApplicationCredentials);

  console.log({
    gcpProjectId,
    gcpApplicationCredentials,
    isGcpProjectIdSet,
    isGcpApplicationCredentials,
  });

  try {
    /*
    TODO:
    Check if inputs are given, if not return
    Get credentials
    decode base64 credentials and stored
    initialize GCP client
    Send ZIP file to bucket
    Set output to be URL of the file
    */
  } catch (error) {
    throw new Error(
      `Error: failed to send zip to Google Cloud storage, ${error.message}`,
    );
  }
};

export default storeCompressedComplianceFolderInABucket;

// gcp-project-id
// gcp-application-credentials
