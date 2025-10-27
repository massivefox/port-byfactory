const config = {
  url: process.env.REACT_APP_BACKEND_URL,
  chainId: process.env.REACT_APP_CHAIN_ID,
  gaId: process.env.REACT_APP_GA_ID,
  contactEmail: process.env.REACT_APP_CONTACT_EMAIL,
  contract: {
    market: process.env.REACT_APP_CONTRACT_MARKET,
    krafterspace: process.env.REACT_APP_CONTRACT_KRAFTERSPACE,
    abcDao: process.env.REACT_APP_CONTRACT_ABCDAO,
    daoFactory: process.env.REACT_APP_CONTRACT_DAO_FACTORY,
  },
  novu: {
    novuAppIdentifier: process.env.NOVU_APPLICATION_IDENTIFIER_KEY,
    apiKey: process.env.NOVU_API_KEY,
    backendUrl: process.env.NOVU_BACKEND_URL,
    adminIdentifier: process.env.NOVU_ADMIN_IDENTIFIER,
    discordWebhookUrl: process.env.NOVU_DISCORD_WEBHOOK,
    slackWebHookUrl: process.env.NOVU_SLACK_WEBHOOK,
    authorization: { Authorization: process.env.NOVU_AUTH },
  },
  explorer: {
    cypressScope: process.env.REACT_APP_CYPRESS_SCOPE_URL,
    baobabscope: process.env.REACT_APP_BAOBAB_SCOPE_URL,
    cypressFinder: process.env.REACT_APP_CYPRESS_FINDER_URL,
    baobabFinder: process.env.REACT_APP_BAOBAB_FINDER_URL,
  },
};
export default config;
