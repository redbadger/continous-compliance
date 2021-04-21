import * as core from '@actions/core';
import * as github from '@actions/github';
import * as io from '@actions/io';

import {
  getCommitsByPr,
  getIssues,
  getPullRequestByCommitSHA,
  GitHubEvidence,
  githubFolder,
  writeGhInfoIntoDisk,
} from './helper';

/**
 * @async
 * @description If `github-token` input is given it would gather information about the current pull request, issues and commits associated with it and paste it into compliance folder
 * @exports getGhInformationIntoComplianceFolder
 * @function
 * @name getGhInformationIntoComplianceFolder
 * @returns {void}
 */

const getGhInformationIntoComplianceFolder = async (): Promise<void> => {
  // Create an object where store Github API data
  let gitEvidence: GitHubEvidence = {
    pull_request: undefined,
    commits: undefined,
    issues: undefined,
  };
  // Get Github token from input 'github-token'
  const ghToken = core.getInput('github-token');
  // Check if token is present
  const isGhToken = Boolean(ghToken);

  if (isGhToken) {
    // Intantiate GH API Client
    const octokit = github.getOctokit(ghToken);

    const {
      context: {
        repo: { repo, owner },
        sha,
      },
    } = github;

    try {
      // Get PR by commit SHA
      const pull_request = await getPullRequestByCommitSHA({ octokit, sha });

      if (pull_request) {
        await io.mkdirP(githubFolder);

        const issues = await getIssues({
          octokit,
          owner,
          repo,
          pull_request,
        });
        // Create github folder and write to disk

        gitEvidence = { ...gitEvidence, pull_request, issues };
        await writeGhInfoIntoDisk(gitEvidence);

        const { number: pull_number } = pull_request;
        core.info(`Gathering information about PR #${pull_number}`);

        // Get commits by PR number
        const commits = await getCommitsByPr({
          octokit,
          owner,
          repo,
          pull_number,
        });

        if (commits) {
          gitEvidence = { ...gitEvidence, commits };
          core.info(
            `Gathering information about commits associated with PR #${pull_number} 📝`,
          );
          // Writing Github API data on JSON file
          await writeGhInfoIntoDisk(gitEvidence);
        } else {
          core.warning(`No commits associated with PR #${pull_number}`);
        }
      } else {
        core.warning(
          `No pull request associated with commit ${sha} not found.`,
        );
      }
    } catch (error) {
      throw new Error(
        `Failed to gather evidence from GitHub API, ${error.message}`,
      );
    }
  } else {
    return;
  }
};

export default getGhInformationIntoComplianceFolder;
