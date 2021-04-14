import * as github from '@actions/github';
import * as core from '@actions/core';

const getIssuesInformationIntoCompliance = async (): Promise<void> => {
  const ghToken = core.getInput('github-token');

  const {
    context: {
      repo: { repo, owner },
      sha,
    },
  } = github;

  const octokit = github.getOctokit(ghToken);

  // Get PR by commit SHA
  const q = `q=SHA=${sha}`;
  const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
    q,
  });

  const {
    items: [pull_request],
  } = prs;
  const pull_number = pull_request.number;

  // GET commits by PR number
  const { data: commits } = await octokit.rest.pulls.listCommits({
    owner,
    repo,
    pull_number,
  });

  console.log({ commits });
};

export default getIssuesInformationIntoCompliance;
