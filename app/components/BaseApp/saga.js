import { call, put, select, takeEvery } from 'redux-saga/effects';

import * as constants from './constants';
import * as actions from './actions';
import contract from '../../services/contract';

const selectState = st => st.baseApp;

export default function* baseAppSaga() {
  yield takeEvery(constants.EMIT_LOGIN, handleLogin);
  yield takeEvery(constants.GET_TOKENS, getTokens);
  yield takeEvery(constants.KAIKAS_LOGIN, isKaikasConnected);
  yield takeEvery(constants.IS_DAO_MEMBER, isDaoMember);
}

function* handleLogin() {
  const accounts = yield call(window.klaytn.enable);
  console.log(accounts);
  // window.caver.setProvider(window.klaytn);
  yield put(actions.onLogin(accounts[0]));
}

function* getTokens() {
  try {
    const tokens = yield call(contract.getTokenBalance);

    yield put({
      type: constants.GET_TOKENS_SUCCESS,
      payload: tokens,
    });
  } catch (err) {
    console.log('sage error:', err);
    yield put({
      type: constants.GET_TOKENS_FAILED,
      error: true,
      payload: 0,
    });
  }
}

function* isKaikasConnected() {
  if (typeof window.klaytn !== 'undefined') {
    yield put({
      type: constants.KAIKAS_CONNECTED,
      isConnected: true,
      account: window.klaytn.selectedAddress,
    });
  } else {
    yield put({
      type: constants.KAIKAS_DICONNECTED,
      isConnected: false,
      account: '',
    });
  }
}

function* isDaoMember() {
  const isMember = yield call(contract.isMember);
  yield put({
    type: constants.IS_DAO_MEMBER,
    isMember,
  });
}
