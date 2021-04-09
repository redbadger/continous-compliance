import * as core from '@actions/core';
import * as style from 'ansi-styles';

const info = (message: string) =>
  core.info(style.color.ansi16m(255, 255, 255) + message);

const warning = (message: string) =>
  core.info(style.color.ansi16m(255, 165, 0) + message);

export default {
  info,
  warning,
};
