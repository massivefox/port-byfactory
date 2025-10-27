import { take, call, put, select, takeEvery } from 'redux-saga/effects';
import c from 'services/contract';
import * as backendApi from 'services/backend';
import {
  BUY_TOKENS,
  CLAIM_TOKENS,
  CLAIM_TOKENS_SUCCESS,
  CLAIM_TOKENS_FAILED,
  BUY_TOKENS_SUCCESS,
  BUY_TOKENS_FAILED,
  GET_NFTS_SUCCESS,
  GET_NFTS_FAILED,
  GET_NFTS,
} from './constants';

// Individual exports for testing
export default function* accountProfileSaga() {
  yield takeEvery(CLAIM_TOKENS, claimTokens);
  yield takeEvery(BUY_TOKENS, buyTokens);
  yield takeEvery(GET_NFTS, getMyNfts);
}

export function* claimTokens(action) {
  try {
    c.loadContracts();
    yield call(c.claimTokens, action.redeemCode);
    alert('claim success');
    yield put({ type: CLAIM_TOKENS_SUCCESS });
  } catch (e) {
    yield put({ type: CLAIM_TOKENS_FAILED });
  }
}

export function* buyTokens(action) {
  try {
    const res = yield call(c.buyTokens, action.quantity);
    yield put({ type: BUY_TOKENS_SUCCESS, result: res.transactionHash });
    alert('buy success');
  } catch (e) {
    yield put({ type: BUY_TOKENS_FAILED });
    console.log(e);
  }
}

export function* getMyNfts(action) {
  try {
    const res = yield call(backendApi.getTokensFromAddress, action.address);
    yield put({ type: GET_NFTS_SUCCESS, result: res });
  } catch (e) {
    console.log(e);
    yield put({ type: GET_NFTS_FAILED });
  }
}
