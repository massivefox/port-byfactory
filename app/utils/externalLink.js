import config from '../config';

const { chainId, explorer } = config;
const { cypressScope, baobabscope, cypressFinder, baobabFinder } = explorer;

export const scopeBaseUrl = chainId === '8217' ? cypressScope : baobabscope;
export const accountScopeLink = account => `${scopeBaseUrl}/account/${account}`;

export const finderBaseUrl = chainId === '8217' ? cypressFinder : baobabFinder;
export const accountFinderLink = account =>
  `${finderBaseUrl}/account/${account}`;
