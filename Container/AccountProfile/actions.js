/*
 *
 * AccountProfile actions
 *
 */

import {
  BUY_TOKENS,
  CLAIM_TOKENS,
  DEFAULT_ACTION,
  GET_NFTS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function claimTokens(redeemCode) {
  return {
    type: CLAIM_TOKENS,
    redeemCode,
  };
}

export function buyTokens(quantity) {
  return {
    type: BUY_TOKENS,
    quantity,
  };
}

export function getMyNfts(address) {
  return {
    type: GET_NFTS,
    address,
  };
}
