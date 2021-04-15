import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';

import getPrInformationIntoComplianceFolder from './index';
import * as helperFunctions from './helper';

const { promises } = fs;

const mockedOktokit = {
  rest: {
    search: {
      issuesAndPullRequests: jest.fn(() => ({
        data: {
          items: [
            {
              number: 36,
            },
          ],
        },
      })),
    },
    pulls: {
      listCommits: jest.fn(() => ({ data: ['bananas', 'oranges'] })),
    },
  },
};

jest.mock('@actions/github', () => ({
  getOctokit: jest.fn(() => mockedOktokit),
  context: {
    repo: {
      repo: 'repo',
      owner: 'owner',
    },
    sha: 'iamacommitsha',
  },
}));

describe('getPrInformationIntoComplianceFolder', () => {
  beforeEach(() => {
    // Prevent console.logs
    jest.spyOn(core, 'info').mockImplementation(jest.fn());
    jest.spyOn(core, 'warning').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should gather information from GH and save it on compliance folder', async () => {
    const ghToken = 'IamAToken';
    jest.spyOn(core, 'getInput').mockImplementation(jest.fn(() => ghToken));
    jest.spyOn(promises, 'writeFile').mockImplementation(jest.fn());
    jest.spyOn(helperFunctions, 'getPullRequestByCommitSHA');
    jest.spyOn(helperFunctions, 'getCommitsByPr');
    jest.spyOn(helperFunctions, 'writeGhInfoIntoDisk');

    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const infoSpy = core.info as jest.Mock<any, any>;
    const warningSpy = core.warning as jest.Mock<any, any>;
    const getOctokitSpy = github.getOctokit as jest.Mock<any, any>;
    const getPullRequestByCommitSHASpy = helperFunctions.getPullRequestByCommitSHA as jest.Mock<
      any,
      any
    >;
    const getCommitsByPrSpy = helperFunctions.getCommitsByPr as jest.Mock<
      any,
      any
    >;
    const writeGhInfoIntoDisk = helperFunctions.writeGhInfoIntoDisk as jest.Mock<
      any,
      any
    >;

    // sanity check
    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(getOctokitSpy).toHaveBeenCalledTimes(0);
    expect(getPullRequestByCommitSHASpy).toHaveBeenCalledTimes(0);
    expect(getCommitsByPrSpy).toHaveBeenCalledTimes(0);
    expect(writeGhInfoIntoDisk).toHaveBeenCalledTimes(0);
    expect(infoSpy).toHaveBeenCalledTimes(0);
    expect(warningSpy).toHaveBeenCalledTimes(0);

    // Call
    await getPrInformationIntoComplianceFolder();

    // Positive assertions
    expect(getInputSpy).toBeCalledWith('github-token');
    expect(getOctokitSpy).toBeCalledWith(ghToken);
    expect(getPullRequestByCommitSHASpy).toBeCalledWith({
      octokit: mockedOktokit,
      sha: 'iamacommitsha',
    });
    expect(getCommitsByPrSpy).toBeCalledWith({
      octokit: mockedOktokit,
      owner: 'owner',
      repo: 'repo',
      pull_number: 36,
    });
    expect(writeGhInfoIntoDisk).toHaveBeenCalledTimes(2);
    expect(writeGhInfoIntoDisk).toHaveBeenNthCalledWith(1, {
      commits: undefined,
      pull_request: { number: 36 },
    });
    expect(writeGhInfoIntoDisk).toHaveBeenNthCalledWith(2, {
      commits: ['bananas', 'oranges'],
      pull_request: { number: 36 },
    });
    expect(warningSpy).toHaveBeenCalledTimes(0);
    expect(infoSpy).toHaveBeenCalledTimes(4);
    expect(infoSpy).toHaveBeenNthCalledWith(
      1,
      'Saving GitHub evidence on compliance/github/info.json',
    );
    expect(infoSpy).toHaveBeenNthCalledWith(
      2,
      'Gathering information about PR #36',
    );
    expect(infoSpy).toHaveBeenNthCalledWith(
      3,
      'Gathering information about commits associated with PR #36 📝',
    );
    expect(infoSpy).toHaveBeenNthCalledWith(
      4,
      'Saving GitHub evidence on compliance/github/info.json',
    );
  });

  it('should do nothing if input "github-token" is not set', async () => {
    const ghToken = '';
    jest.spyOn(core, 'getInput').mockImplementation(jest.fn(() => ghToken));
    jest.spyOn(promises, 'writeFile').mockImplementation(jest.fn());
    jest.spyOn(helperFunctions, 'getPullRequestByCommitSHA');
    jest.spyOn(helperFunctions, 'getCommitsByPr');
    jest.spyOn(helperFunctions, 'writeGhInfoIntoDisk');

    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const infoSpy = core.info as jest.Mock<any, any>;
    const warningSpy = core.warning as jest.Mock<any, any>;
    const getOctokitSpy = github.getOctokit as jest.Mock<any, any>;
    const getPullRequestByCommitSHASpy = helperFunctions.getPullRequestByCommitSHA as jest.Mock<
      any,
      any
    >;
    const getCommitsByPrSpy = helperFunctions.getCommitsByPr as jest.Mock<
      any,
      any
    >;
    const writeGhInfoIntoDisk = helperFunctions.writeGhInfoIntoDisk as jest.Mock<
      any,
      any
    >;

    // sanity check
    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(getOctokitSpy).toHaveBeenCalledTimes(0);
    expect(getPullRequestByCommitSHASpy).toHaveBeenCalledTimes(0);
    expect(getCommitsByPrSpy).toHaveBeenCalledTimes(0);
    expect(writeGhInfoIntoDisk).toHaveBeenCalledTimes(0);
    expect(infoSpy).toHaveBeenCalledTimes(0);
    expect(warningSpy).toHaveBeenCalledTimes(0);

    // Call
    await getPrInformationIntoComplianceFolder();

    // Positive assertions
    expect(getInputSpy).toHaveBeenCalledTimes(1);
    expect(getOctokitSpy).not.toHaveBeenCalled();
    expect(getPullRequestByCommitSHASpy).not.toHaveBeenCalled();
    expect(getCommitsByPrSpy).not.toHaveBeenCalled();
    expect(writeGhInfoIntoDisk).not.toHaveBeenCalled();
    expect(infoSpy).not.toHaveBeenCalled();
    expect(warningSpy).not.toHaveBeenCalled();
  });
});
