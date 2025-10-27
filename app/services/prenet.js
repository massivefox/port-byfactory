import config from '../config';

const axios = require('axios').default;

// Console Api

export async function signUpConsole(userData) {
  const baseUrl = userData.url;
  const email = userData.Email;
  const { password } = userData;
  const name = userData.userName;
  const res = await axios.post(
    `${baseUrl}/v1/auth/signup`,
    {
      email,
      password,
      name,
    },
    {
      'Content-Type': 'application/json',
    },
  );

  return res.data;
}
export async function signInConsole(userData) {
  const email = userData.Email;
  const hash = userData.password;
  const baseUrl = userData.url;
  const res = await axios.post(
    `${baseUrl}/v1/auth/signin`,
    {
      email,
      hash,
    },
    { 'Content-Type': 'application/json' },
  );

  return res.data;
}
export async function getCredentialList(headers) {
  const res = await axios.get(`${config.console.url}/v1/credential`, {
    headers,
    'Content-Type': 'application/json',
  });

  return res;
}
export async function createCredential(desc, headers) {
  const res = await axios.post(
    `${config.console.url}/v1/credential`,
    {
      description: desc,
    },
    {
      headers,
      'Content-Type': 'application/json',
    },
  );

  return res.data;
}

export async function getKip17ContractFromUser(key) {
  const res = await axios.get(
    `${config.console.kip17Url}/v2/contract`,

    {
      headers: {
        Authorization: key,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}

export async function getKip17ContractCreate(header, body) {
  const { alias, symbol, name } = body;

  const res = await axios.post(
    `${config.console.kip17Url}/v2/contract`,
    {
      alias,
      symbol,
      name,
    },
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}

export async function getKip37ContractFromUser(key) {
  const res = await axios.get(
    `${config.console.kip37Url}/v2/contract`,

    {
      headers: {
        Authorization: key,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}

export async function getKip37ContractCreate(header, body) {
  const { alias, uri } = body;

  const res = await axios.post(
    `${config.console.kip37Url}/v2/contract`,
    {
      alias,
      uri,
    },
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}

export async function getKip7ContractFromUser(key) {
  const res = await axios.get(
    `${config.console.kip7Url}/v1/contract`,

    {
      headers: {
        Authorization: key,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}

export async function postKip7ContractCreate(header, body) {
  const { alias, symbol, name, decimals, supply } = body;

  const res = await axios.post(
    `${config.console.kip7Url}/v1/contract`,
    {
      alias,
      symbol,
      name,
      initialSupply: supply,
      // eslint-disable-next-line radix
      decimals: parseInt(decimals),
    },
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}

export async function getThLabeled17(address, header) {
  const res = await axios.get(
    `${config.console.thUrl}/v2/contract/nft/${address}`,
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}
export async function getThLabeled7(address, header) {
  const res = await axios.get(
    `${config.console.thUrl}/v2/contract/ft/${address}`,
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}

export async function getKrnList(header) {
  const res = await axios.get(
    `${
      config.console.resourceUrl
    }/v1/resource?resource-type=account-pool&service-id=wallet`,
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}

export async function getKrn(header, krn) {
  const res = await axios.get(
    `${config.console.resourceUrl}/v1/resource/${krn}`,
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}

export async function postDefaultKrnSet(header, krn) {
  const res = await axios.post(
    `${config.console.resourceUrl}/v1/resource/default`,
    {
      krn,
    },
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}

export async function postCreateKrn(header, name) {
  const res = await axios.post(
    `${config.console.resourceUrl}/v1/resource`,
    {
      serviceId: 'wallet',
      resourceId: name,
      resourceType: 'account-pool',
    },
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}

export async function getUserAccountList(header, krn) {
  const res = await axios.get(`${config.console.walletUrl}/v2/account`, {
    headers: {
      Authorization: header,
      'x-chain-id': config.prenet.chainId,
      'Content-Type': 'application/json',
      'x-krn': krn,
    },
  });

  return res.data;
}
export async function getUserAccountDetail(header, address, krn) {
  const res = await axios.get(
    `${config.console.walletUrl}/v2/account/${address}`,
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
        'x-krn': krn,
      },
    },
  );

  return res.data;
}
export async function createAccount(header, krn) {
  const res = await axios.post(
    `${config.console.walletUrl}/v2/account`,
    {},
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
        'x-krn': krn,
      },
    },
  );

  return res.data;
}
export async function deleteAccount(header, account, krn) {
  const res = await axios.delete(
    `${config.console.walletUrl}/v2/account/${account}`,
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
        'x-krn': krn,
      },
    },
  );

  return res.data;
}

export async function getUserKip17ContractDetail(header, alias) {
  const res = await axios.get(
    `${config.console.kip17Url}/v2/contract/${alias}`,
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}
export async function getUserKIP17TokenList(header, alias) {
  const res = await axios.get(
    `${config.console.kip17Url}/v2/contract/${alias}/token`,
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}

export async function postKIP17TokenMint(header, body, alias) {
  const { id, to, uri } = body;
  const res = await axios.post(
    `${config.console.kip17Url}/v2/contract/${alias}/token`,
    {
      id,
      to,
      uri,
    },
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}

export async function getUserKip7ContractDetail(header, alias) {
  const res = await axios.get(
    `${config.console.kip7Url}/v1/contract/${alias}`,
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}

export async function getUserKip37ContractDetail(header, alias) {
  const res = await axios.get(
    `${config.console.kip37Url}/v2/contract/${alias}`,
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}
export async function getUserKIP37TokenList(header, alias) {
  const res = await axios.get(
    `${config.console.kip37Url}/v2/contract/${alias}/token`,
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}

export async function postKip37Mint(header, body) {
  const { tokenId, amount, uri, alias } = body;

  const res = await axios.post(
    `${config.console.kip37Url}/v2/contract/${alias}/token`,
    {
      id: tokenId,
      initialSupply: amount,
      uri,
    },
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}
export async function postKip37MoreMint(header, body) {
  const { ids, amounts, to, alias } = body;

  const res = await axios.post(
    `${config.console.kip37Url}/v2/contract/${alias}/token/mint`,
    {
      ids,
      amounts,
      to,
    },
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}
export async function burnKip37Token(header, body) {
  const { ids, amounts, from, alias } = body;

  const res = await axios.delete(
    `${config.console.kip37Url}/v2/contract/${alias}/token`,
    {
      data: {
        ids,
        amounts,
        from,
      },

      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}
export async function getMetaStorageList(header) {
  const res = await axios.get(
    `${
      config.console.resourceUrl
    }/v1/resource?resource-type=metadata-storage&service-id=metadata`,
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}
export async function postStorageCreate(header, name) {
  const res = await axios.post(
    `${config.console.resourceUrl}/v1/resource`,
    {
      serviceId: 'metadata',
      resourceId: name,
      resourceType: 'metadata-storage',
    },
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
      },
    },
  );

  return res.data;
}
export async function postMetaAsset(header, file, krn) {
  const res = await axios.post(
    `${config.console.metaUrl}/v1/metadata/asset`,
    {
      file,
    },
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'multipart/form-data',
        'x-krn': krn,
      },
    },
  );

  return res.data;
}
export async function postMetaData(header, fileName, metaData, krn) {
  const res = await axios.post(
    `${config.console.metaUrl}/v1/metadata`,
    {
      filename: fileName,
      metadata: metaData,
    },
    {
      headers: {
        Authorization: header,
        'x-chain-id': config.prenet.chainId,
        'Content-Type': 'application/json',
        'x-krn': krn,
      },
    },
  );

  return res.data;
}

// gallery Api

export async function getNftApi() {
  const res = await axios.get(`${config.prenet.nftUrl}/v1/assets`, {
    headers: {
      Authorization: config.prenet.auth,
      'x-chain-id': config.prenet.chainId,
      'Content-Type': 'application/json',
      'x-user': 'all',
    },
  });

  return res.data;
}

export async function getCollection() {
  const res = await axios.get(`${config.prenet.nftUrl}/v1/collections`, {
    headers: {
      Authorization: config.prenet.auth,
    },
  });

  return res.data;
}
