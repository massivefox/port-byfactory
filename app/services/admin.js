import config from '../config';

const axios = require('axios').default;
const { url } = config;

export async function sendRedeemCodes(data) {
  const res = await axios.post(`${url}/m1/assist/redeem`, {
    data,
  });

  return res.data;
}
