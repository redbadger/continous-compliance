import * as github from '@actions/github';
import * as core from '@actions/core';

const getIssuesInformationIntoCompliance = async (): Promise<void> => {
  console.log('Process env', process.env);
};

export default getIssuesInformationIntoCompliance;
