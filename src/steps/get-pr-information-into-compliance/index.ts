import * as core from '@actions/core';
import * as github from '@actions/github';
import * as io from '@actions/io';

import {
  getCommitsByPr,
  getPullRequestByCommitSHA,
  githubFolder,
  GitHubEvidence,
  writeGhInfoIntoDisk,
} from './helper';

const getPrInformationIntoComplianceFolder = async (): Promise<void> => {
  let gitEvidence: GitHubEvidence = {
    pull_request: undefined,
    commits: undefined,
  };
  const ghToken = core.getInput('github-token');
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

    // Get PR by commit SHA
    const pull_request = await getPullRequestByCommitSHA({ octokit, sha });

    if (pull_request) {
      // Create github folder
      await io.mkdirP(githubFolder);

      gitEvidence = { ...gitEvidence, pull_request };
      const { number: pull_number } = pull_request;

      core.info(`Gathering information about PR #${pull_number} :octocat:`);

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
      } else {
        core.warning(`No commits associated with PR #${pull_number}`);
      }
      await writeGhInfoIntoDisk(gitEvidence);
    } else {
      core.warning(`Pull request associated with commit ${sha} not found`);
    }
  } else {
    return;
  }
};

export default getPrInformationIntoComplianceFolder;
