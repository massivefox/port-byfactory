export const isIpfsUrl = url => url.startsWith('ipfs://');

export const changeIpfsToHttps = url => {
  const mainUrl = url.split('ipfs://')[1];
  return `https://ipfs.io/ipfs/${mainUrl}`;
};
