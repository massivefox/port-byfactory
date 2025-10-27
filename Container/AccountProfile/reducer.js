/*
 *
 * AccountProfile reducer
 *
 */
import produce from 'immer';
import {
  BUY_TOKENS_SUCCESS,
  BUY_TOKENS_FAILED,
  CLAIM_TOKENS_SUCCESS,
  DEFAULT_ACTION,
  GET_NFTS_SUCCESS,
  GET_NFTS_FAILED,
} from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const accountProfileReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case CLAIM_TOKENS_SUCCESS:
        draft.type = action.type;
        break;
      case BUY_TOKENS_SUCCESS:
        draft.type = action.type;
        draft.result = action.result;
        break;
      case BUY_TOKENS_FAILED:
        draft.type = action.type;
        break;
      case GET_NFTS_SUCCESS:
        draft.type = action.type;
        draft.result = action.result;
        break;
      case GET_NFTS_FAILED:
        draft.type = action.type;
        break;
    }
  });

export default accountProfileReducer;
