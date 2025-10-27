import { v4 as uuidv4 } from 'uuid';
import QS from 'query-string';
import config from '../config';

const axios = require('axios').default;
const { url } = config;

export async function getABI(contractName) {
  const contName = contractName.toLowerCase();
  const AbiValue = localStorage.getItem(`${contName}.abi`);

  if (AbiValue) {
    return JSON.parse(AbiValue);
  }

  const registryData = await getContractData(contractName);

  if (!localStorage.getItem(`${contName}.abi`)) {
    localStorage.setItem(`${contName}.abi`, JSON.stringify(registryData.abi));
  }

  return registryData.abi;
}

// TODO: permission check
export async function sendRedeemCode(daoName, email) {
  const res = await axios.post(`${url}/m1/resource/redeem`, {
    email,
    daoName,
  });

  return res.data;
}

export async function sendTransaction(rawTransaction) {
  const res = await axios.post(`${url}/v1/tx/send`, {
    rawTransaction,
  });

  return res.data;
}

export async function deployContract(rawTransaction, symbol, name, deployer) {
  const res = await axios.post(`${url}/v1/tx/deploy/token`, {
    rawTransaction,
    symbol,
    name,
    deployer,
  });

  return res.data;
}

export async function sendToken(rawTransaction, contractAddress) {
  const res = await axios.post(`${url}/v1/tx/send/token`, {
    rawTransaction,
    contractAddress,
  });

  return res.data;
}

export async function swapToken(rawTransaction, contractAddress, address) {
  const res = await axios.post(`${url}/v1/tx/swap/token`, {
    rawTransaction,
    contractAddress,
    address,
  });

  return res.data;
}

export async function listNft(rawTransaction, tokenId, price) {
  const res = await axios.post(`${url}/v1/tx/list/nft`, {
    rawTransaction,
    tokenId,
    price,
  });

  return res.data;
}

export async function buyNft(rawTransaction, tokenId) {
  const res = await axios.post(`${url}/v1/tx/buy/nft`, {
    rawTransaction,
    tokenId,
  });

  return res.data;
}

export async function getTokens() {
  const res = await axios.get(`${url}/v1/tx/token`);

  return res.data;
}

export async function getAccounts() {
  const res = await axios.get(`${url}/v1/tx/accounts`);

  return res.data;
}

export async function getNfts() {
  const res = await axios.get(`${url}/v1/tx/nft`);

  return res.data;
}

export async function getTokensFromAddress(address, qs) {
  const query = `?${QS.stringify({ kind: 'nft', size: 8, ...qs })}`;
  const res = await axios.get(`${url}/v1/tx/tokens/${address}${query}`);

  return res.data.result || res.data;
}

export async function getStudentInformationByRedeemCode(redeemCode) {
  const res = await axios.get(`${url}/v1/assist/redeem/${redeemCode}`);

  return res;
}

export async function claimAssistNft(account, redeem, attrs) {
  const res = await axios.post(`${url}/v1/assist/claim`, {
    account,
    redeem,
    attrs,
  });

  return res.data;
}

export async function getFilters() {
  const res = await axios.get(`${url}/v1/resource/all?type=filter`);

  return res.data;
}

export async function getCourses() {
  const res = await axios.get(`${url}/v1/resource/all?type=course`);

  return res.data;
}

export async function getCourseById(id) {
  const res = await axios.get(`${url}/v1/resource/course/${id}`);

  return res.data;
}

export async function getFacultyById(id) {
  const res = await axios.get(`${url}/v1/resource/faculty/${id}`);

  return res.data;
}

export async function getDaoContract(id) {
  const res = await axios.get(`${url}/v1/contract/dao/${id}`);

  return res.data;
}

export async function getContractData(name) {
  const res = await axios.get(`${url}/v1/contract/data/${name.toLowerCase()}`);

  return res.data;
}

// export async function postProposal(contractAddress, proposal) {
//   const contract = new window.caver.klay.Contract(contracts.dao);
//   console.log(contract);
//   const uuid = uuidv4();
//   const d = contract.methods.submitProposal(
//     uuid,
//     JSON.stringify({
//       uuid,
//       title: proposal.title,
//       category: proposal.category,
//     }),
//     JSON.stringify({
//       uuid,
//       ...proposal,
//     }),
//   );
//   const data = d.encodeABI();
//   const signedTransaction = await window.caver.klay.signTransaction({
//     type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
//     to: contractAddress,
//     from: window.klaytn.selectedAddress,
//     value: 0,
//     gas: '3000000',
//     data,
//   });

//   const senderRawTransaction = signedTransaction.rawTransaction;
//   const res = await sendTransaction(senderRawTransaction);
//   console.log(res);

//   // const res = await axios.post(`${url}/v1/resource/proposal`, proposal);

//   return res.data;
// }

export async function getProposals() {
  const res = await axios.get(`${url}/v1/resource/all?type=proposal`);

  return res.data;
}

export async function getProposalById(id) {
  const res = await axios.get(`${url}/v1/resource/proposal/${id}`);

  return res.data;
}

export async function uploadFiles(files) {
  const res = await axios.post(`${url}/v1/resource/files`, files, {
    headers: {
      'Content-Type': 'multipart/form-data; charset=utf-8;',
    },
  });

  return res.data;
}

export async function findContractData(contractName) {
  const res = await axios.get(
    `${url}/v1/contract/data/${contractName.toLowerCase()}`,
  );

  return res.data;
}

export async function getBlueChipHolder(chainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${chainId}/tag/bluechipholder`,
  );
  return res.data;
}

export async function getNftChildContract(contractAddress, apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/contract/${contractAddress}?tag=nftChild`,
  );
  return res.data;
}
export async function getNftChildFirstMint(apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/nftchild/?type=mint`,
  );
  return res.data;
}
export async function getNftChildFirstPurchase(apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/nftchild/?type=purchase`,
  );
  return res.data;
}
export async function getNftChildFirstOwn(apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/nftchild/?type=own`,
  );
  return res.data;
}
export async function getMillionaireKlayValue(apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/millionaire?type=klay`,
  );
  return res.data;
}
export async function getMillionaireNftValue(apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/millionaire?type=nft`,
  );
  return res.data;
}
export async function getMillionaire(apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/millionaire`,
  );
  return res.data;
}
export async function getSmartNftInvestor(apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/smartnft?type=wallet`,
  );
  return res.data;
}
export async function getSmartNftInvestorBestNft(apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/smartnft?type=nft`,
  );
  return res.data;
}
export async function getSmartNftInvestorBestProject(apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/smartnft?type=proj`,
  );
  return res.data;
}
export async function getInfluencerTopProject(apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/influencer?type=proj`,
  );
  return res.data;
}
export async function getInfluencerSearchedContract(
  contractaddress,
  apiChainId,
) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/influencer/${contractaddress}`,
  );
  return res.data;
}
export async function getKingOfInformationWalletReceived(apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/king-of-information?type=freedrop`,
  );
  return res.data;
}
export async function getKingOfInformationMostAirdropProject(apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/king-of-information?type=proj`,
  );
  return res.data;
}
export async function getKingOfInformationMostDrop(apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/king-of-information?type=mostdrop`,
  );
  return res.data;
}
export async function getTopBigHands(apiChainId) {
  const res = await axios.get(`${url}/v1/analytics/${apiChainId}/tag/bighands`);
  return res.data;
}
export async function getRecentlyTradeBigHands(contractaddress, apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/bighands/${contractaddress}?type=recent`,
  );
  return res.data;
}
export async function getTopWalletBigHands(contractaddress, apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/bighands/${contractaddress}?type=top`,
  );
  return res.data;
}
export async function getTopShareBigHands(contractaddress, apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/bighands/${contractaddress}?type=share`,
  );
  return res.data;
}
export async function getChangeShareBigHands(contractaddress, apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/bighands/${contractaddress}?type=change`,
  );
  return res.data;
}
export async function getTopDiamondHands(contractAddress, apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/diamonds/${contractAddress}?type=top`,
  );
  return res.data;
}
export async function getRecentDiamondHands(contractAddress, apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/diamonds/${contractAddress}?type=recent`,
  );
  return res.data;
}
export async function getTopPotential(contractAddress, apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/potential/${contractAddress}?type=top`,
  );
  return res.data;
}
export async function getRecentPotential(contractAddress, apiChainId) {
  const res = await axios.get(
    `${url}/v1/analytics/${apiChainId}/tag/potential/${contractAddress}?type=recent`,
  );
  return res.data;
}

export async function getUnSeenNotification(address) {
  const res = await axios.get(
    `${config.novu.backendUrl}/v1/subscribers/${address}/notifications/unseen`,
    {
      headers: config.novu.authorization,
    },
  );

  return res.data;
}

export async function deleteNotification(messageId) {
  const res = await axios.delete(
    `${config.novu.backendUrl}/v1/messages/${messageId}`,
    {
      headers: config.novu.authorization,
    },
  );

  return res.data;
}
export async function markSeenNotification(address, messageId) {
  const res = await axios.post(
    `${
      config.novu.backendUrl
    }/v1/subscribers/${address}/messages/${messageId}/seen`,
    {},
    {
      headers: config.novu.authorization,
    },
  );

  return res.data;
}
