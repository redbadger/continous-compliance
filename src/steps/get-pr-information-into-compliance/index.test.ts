import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';
import * as io from '@actions/io';

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
    jest.spyOn(io, 'mkdirP').mockImplementation(jest.fn());
    jest.spyOn(helperFunctions, 'getPullRequestByCommitSHA');
    jest.spyOn(promises, 'writeFile');
    jest.spyOn(helperFunctions, 'getCommitsByPr');
    jest
      .spyOn(helperFunctions, 'writeGhInfoIntoDisk')
      .mockImplementation(jest.fn());

    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const getOctokitSpy = github.getOctokit as jest.Mock<any, any>;
    const mkdirPSpy = io.mkdirP as jest.Mock<any, any>;
    const infoSpy = core.info as jest.Mock<any, any>;
    const warningSpy = core.warning as jest.Mock<any, any>;
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
    expect(mkdirPSpy).toHaveBeenCalledTimes(0);
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
    expect(mkdirPSpy).toBeCalledWith('compliance/github');
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
    expect(infoSpy).toHaveBeenCalledTimes(2);
    expect(infoSpy).toHaveBeenNthCalledWith(
      1,
      'Gathering information about PR #36',
    );
    expect(infoSpy).toHaveBeenNthCalledWith(
      2,
      'Gathering information about commits associated with PR #36 📝',
    );
  });

  it('should do nothing if input "github-token" is not set', async () => {
    const ghToken = '';
    jest.spyOn(core, 'getInput').mockImplementation(jest.fn(() => ghToken));
    jest.spyOn(io, 'mkdirP').mockImplementation(jest.fn());
    jest.spyOn(helperFunctions, 'getPullRequestByCommitSHA');
    jest.spyOn(promises, 'writeFile');
    jest.spyOn(helperFunctions, 'getCommitsByPr');
    jest
      .spyOn(helperFunctions, 'writeGhInfoIntoDisk')
      .mockImplementation(jest.fn());

    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const getOctokitSpy = github.getOctokit as jest.Mock<any, any>;
    const mkdirPSpy = io.mkdirP as jest.Mock<any, any>;
    const infoSpy = core.info as jest.Mock<any, any>;
    const warningSpy = core.warning as jest.Mock<any, any>;
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
    expect(mkdirPSpy).toHaveBeenCalledTimes(0);
    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(getOctokitSpy).toHaveBeenCalledTimes(0);
    expect(getPullRequestByCommitSHASpy).toHaveBeenCalledTimes(0);
    expect(getCommitsByPrSpy).toHaveBeenCalledTimes(0);
    expect(writeGhInfoIntoDisk).toHaveBeenCalledTimes(0);
    expect(infoSpy).toHaveBeenCalledTimes(0);
    expect(warningSpy).toHaveBeenCalledTimes(0);

    // Call
    await getPrInformationIntoComplianceFolder();

    // Call
    await getPrInformationIntoComplianceFolder();

    // Positive assertions
    expect(getInputSpy).toHaveBeenCalled();
    expect(mkdirPSpy).not.toHaveBeenCalled();
    expect(getOctokitSpy).not.toHaveBeenCalled();
    expect(getPullRequestByCommitSHASpy).not.toHaveBeenCalled();
    expect(getCommitsByPrSpy).not.toHaveBeenCalled();
    expect(writeGhInfoIntoDisk).not.toHaveBeenCalled();
    expect(infoSpy).not.toHaveBeenCalled();
    expect(warningSpy).not.toHaveBeenCalled();
  });

  it('should throw an error when getPullRequestByCommitSHA fails', async () => {
    const ghToken = 'IamAToken';

    jest.spyOn(core, 'getInput').mockImplementation(jest.fn(() => ghToken));
    jest.spyOn(io, 'mkdirP').mockImplementation(jest.fn());
    jest
      .spyOn(helperFunctions, 'getPullRequestByCommitSHA')
      .mockImplementation(async () => {
        throw new Error('💣');
      });
    jest.spyOn(promises, 'writeFile');
    jest.spyOn(helperFunctions, 'getCommitsByPr');
    jest
      .spyOn(helperFunctions, 'writeGhInfoIntoDisk')
      .mockImplementation(jest.fn());

    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const getOctokitSpy = github.getOctokit as jest.Mock<any, any>;
    const mkdirPSpy = io.mkdirP as jest.Mock<any, any>;
    const infoSpy = core.info as jest.Mock<any, any>;
    const warningSpy = core.warning as jest.Mock<any, any>;
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
    expect(mkdirPSpy).toHaveBeenCalledTimes(0);
    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(getOctokitSpy).toHaveBeenCalledTimes(0);
    expect(getPullRequestByCommitSHASpy).toHaveBeenCalledTimes(0);
    expect(getCommitsByPrSpy).toHaveBeenCalledTimes(0);
    expect(writeGhInfoIntoDisk).toHaveBeenCalledTimes(0);
    expect(infoSpy).toHaveBeenCalledTimes(0);
    expect(warningSpy).toHaveBeenCalledTimes(0);

    try {
      // Call
      await getPrInformationIntoComplianceFolder();

      // Positive assertions
      expect(getInputSpy).toBeCalledWith('github-token');
      expect(getOctokitSpy).toBeCalledWith(ghToken);
      expect(getPullRequestByCommitSHASpy).toBeCalledWith({
        octokit: mockedOktokit,
        sha: 'iamacommitsha',
      });
      expect(
        async () => await getPrInformationIntoComplianceFolder(),
      ).toThrow();
    } catch (error) {
      expect(error.message).toBe(
        'Failed to gather evidence from GitHub API, 💣',
      );
    }
  });

  it('should throw an error when writeGhInfoIntoDisk fails', async () => {
    const ghToken = 'IamAToken';

    jest.spyOn(core, 'getInput').mockImplementation(jest.fn(() => ghToken));
    jest.spyOn(io, 'mkdirP').mockImplementation(jest.fn());
    jest.spyOn(helperFunctions, 'getPullRequestByCommitSHA');
    jest.spyOn(promises, 'writeFile');
    jest.spyOn(helperFunctions, 'getCommitsByPr');
    jest
      .spyOn(helperFunctions, 'writeGhInfoIntoDisk')
      .mockImplementation(async () => {
        throw new Error('💥');
      });

    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const getOctokitSpy = github.getOctokit as jest.Mock<any, any>;
    const mkdirPSpy = io.mkdirP as jest.Mock<any, any>;
    const infoSpy = core.info as jest.Mock<any, any>;
    const warningSpy = core.warning as jest.Mock<any, any>;
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
    expect(mkdirPSpy).toHaveBeenCalledTimes(0);
    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(getOctokitSpy).toHaveBeenCalledTimes(0);
    expect(getPullRequestByCommitSHASpy).toHaveBeenCalledTimes(0);
    expect(getCommitsByPrSpy).toHaveBeenCalledTimes(0);
    expect(writeGhInfoIntoDisk).toHaveBeenCalledTimes(0);
    expect(infoSpy).toHaveBeenCalledTimes(0);
    expect(warningSpy).toHaveBeenCalledTimes(0);

    try {
      // Call
      await getPrInformationIntoComplianceFolder();

      // Positive assertions
      expect(getInputSpy).toBeCalledWith('github-token');
      expect(getOctokitSpy).toBeCalledWith(ghToken);
      expect(getPullRequestByCommitSHASpy).toBeCalledWith({
        octokit: mockedOktokit,
        sha: 'iamacommitsha',
      });
      expect(mkdirPSpy).toBeCalledWith('compliance/github');
      expect(writeGhInfoIntoDisk).toHaveBeenNthCalledWith(1, {
        commits: undefined,
        pull_request: { number: 36 },
      });
      expect(
        async () => await getPrInformationIntoComplianceFolder(),
      ).toThrow();
    } catch (error) {
      expect(error.message).toBe(
        'Failed to gather evidence from GitHub API, 💥',
      );
    }
  });

  it('should throw an error when getCommitsByPr fails', async () => {
    const ghToken = 'IamAToken';

    jest.spyOn(core, 'getInput').mockImplementation(jest.fn(() => ghToken));
    jest.spyOn(io, 'mkdirP').mockImplementation(jest.fn());
    jest.spyOn(helperFunctions, 'getPullRequestByCommitSHA');
    jest.spyOn(promises, 'writeFile');
    jest
      .spyOn(helperFunctions, 'getCommitsByPr')
      .mockImplementation(async () => {
        throw new Error('🍌');
      });
    jest.spyOn(helperFunctions, 'writeGhInfoIntoDisk');

    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const getOctokitSpy = github.getOctokit as jest.Mock<any, any>;
    const mkdirPSpy = io.mkdirP as jest.Mock<any, any>;
    const infoSpy = core.info as jest.Mock<any, any>;
    const warningSpy = core.warning as jest.Mock<any, any>;
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
    expect(mkdirPSpy).toHaveBeenCalledTimes(0);
    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(getOctokitSpy).toHaveBeenCalledTimes(0);
    expect(getPullRequestByCommitSHASpy).toHaveBeenCalledTimes(0);
    expect(getCommitsByPrSpy).toHaveBeenCalledTimes(0);
    expect(writeGhInfoIntoDisk).toHaveBeenCalledTimes(0);
    expect(infoSpy).toHaveBeenCalledTimes(0);
    expect(warningSpy).toHaveBeenCalledTimes(0);

    try {
      // Call
      await getPrInformationIntoComplianceFolder();

      // Positive assertions
      expect(getInputSpy).toBeCalledWith('github-token');
      expect(getOctokitSpy).toBeCalledWith(ghToken);
      expect(getPullRequestByCommitSHASpy).toBeCalledWith({
        octokit: mockedOktokit,
        sha: 'iamacommitsha',
      });
      expect(mkdirPSpy).toBeCalledWith('compliance/github');
      expect(writeGhInfoIntoDisk).toHaveBeenNthCalledWith(1, {
        commits: undefined,
        pull_request: { number: 36 },
      });
      expect(getCommitsByPrSpy).toBeCalledWith({
        octokit: mockedOktokit,
        owner: 'owner',
        repo: 'repo',
        pull_number: 36,
      });
      expect(
        async () => await getPrInformationIntoComplianceFolder(),
      ).toThrow();
    } catch (error) {
      expect(error.message).toBe(
        'Failed to gather evidence from GitHub API, Failed to save GitHub evidence on compliance/github/info.json',
      );
    }
  });
});
