import * as fs from 'fs';
import jsonToTxt from './index';

jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn().mockResolvedValue(jest.fn()),
    readFile: jest.fn().mockResolvedValue(
      JSON.stringify({
        name: 'pedro',
        fruits: ['banana', 'apple'],
      }),
    ),
  },
}));

const { promises } = fs;

describe('jsonToTxt', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should write a human readeable txt file', async () => {
    const readFileSpy = promises.readFile as jest.Mock<any, any>;
    const writeFileSpy = promises.writeFile as jest.Mock<any, any>;

    expect(readFileSpy).toHaveBeenCalledTimes(0);
    expect(writeFileSpy).toHaveBeenCalledTimes(0);

    await jsonToTxt({
      jsonFilePath: 'info.json',
      txtFilePath: 'info.txt',
    });

    expect(readFileSpy).toHaveBeenCalledWith('info.json');
    expect(writeFileSpy).toHaveBeenCalledWith(
      'info.txt',
      'name:pedrofruits:bananaapple',
    );
  });
});
