/*
 *
 * ProposalSubmit actions
 *
 */

import * as c from './constants';

export function emitLoadContractData(contractName) {
  return {
    type: c.EMIT_LOAD_ABI,
    contractName,
  };
}

export function handleLoadContractData(contractData) {
  return {
    type: c.HANDLE_LOAD_ABI,
    contractData,
  };
}
