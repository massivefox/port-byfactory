/*
 *
 * BaseApp reducer
 *
 */
import produce from 'immer';
import * as constants from './constants';

export const initialState = {
  account: '',
  balance: 0,
  isConnected: false,
  isMember: false,
  content: {
    title: '',
    description: '',
  },
  expanded: false,
  atomicExpanded: {},
};

/* eslint-disable default-case, no-param-reassign */
const baseAppReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.ON_LOGIN:
        draft = {
          ...draft,
          account: action.account,
        };
        break;

      case constants.GET_TOKENS_SUCCESS:
        draft.balance = action.payload;
        break;

      case constants.GET_TOKENS_FAILED:
        draft.balance = action.payload;
        break;

      case constants.KAIKAS_CONNECTED:
        draft.isConnected = action.isConnected;
        draft.account = action.account;
        break;

      case constants.KAIKAS_DICONNECTED:
        draft.isConnected = action.isConnected;
        draft.account = '';
        break;

      case constants.EMIT_CONTENT:
        draft.content.title = action.title;
        draft.content.description = action.description;
        break;
      case constants.IS_DAO_MEMBER:
        draft = {
          ...draft,
          isMember: action.isMember,
        };
        break;

      case constants.EMIT_EXPAND_ACTION:
        draft.expanded = action.expand;
        break;

      case constants.EMIT_EXPAND_ACTION_FOR_ONE:
        draft.atomicExpanded[action.name] = action.expand;
        break;

      default:
        break;
    }

    return draft;
  });

export default baseAppReducer;
