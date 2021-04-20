import * as core from '@actions/core';
import * as github from '@actions/github';
import * as io from '@actions/io';
import * as util from 'util';

import {
  getCommitsByPr,
  getPullRequestByCommitSHA,
  githubFolder,
  GitHubEvidence,
  writeGhInfoIntoDisk,
} from './helper';

const getGhInformationIntoComplianceFolder = async (): Promise<void> => {
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

    console.log(util.inspect(github.context, true, Infinity, true));

    try {
      // Get PR by commit SHA
      const pull_request = await getPullRequestByCommitSHA({ octokit, sha });

      if (pull_request) {
        // Create github folder and write to disk
        await io.mkdirP(githubFolder);
        gitEvidence = { ...gitEvidence, pull_request };
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

// TODO:
// Check context
// Depending on context decide:
// if PR, get PR -> commits
// if PR body with issues, get issues
// if not PR get commit info
