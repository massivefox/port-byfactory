/*
 *
 * ProposalSubmit reducer
 *
 */
import produce from 'immer';
import * as c from './constants';

export const initialState = {
  contractData: undefined,
};

/* eslint-disable default-case, no-param-reassign */
const proposalSubmitReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case c.HANDLE_LOAD_ABI:
        draft.contractData = action.contractData;
        break;
    }
  });

export default proposalSubmitReducer;
