import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as b from 'services/backend';
import * as c from './constants';
import * as a from './actions';

export default function* proposalSubmitSaga() {
  yield takeEvery(c.EMIT_LOAD_ABI, handleLoadContractData);
}

function* handleLoadContractData(action) {
  const { contractName } = action;
  try {
    const contractData = yield call(b.findContractData, contractName);

    yield put(a.handleLoadContractData(contractData));
  } catch (e) {
    console.log(e);
  }
}
