import * as constants from './constants';

export function handleLogin() {
  return {
    type: constants.EMIT_LOGIN,
  };
}

export function onLogin(account) {
  return {
    type: constants.ON_LOGIN,
    account,
  };
}

export function getTokens() {
  return {
    type: constants.GET_TOKENS,
  };
}

export function handleTokens(tokens) {
  return {
    type: constants.GET_TOKENS_SUCCESS,
    payload: tokens,
  };
}

export function isKaikasConnected() {
  return {
    type: constants.KAIKAS_LOGIN,
  };
}

export function isDaoMember() {
  return {
    type: constants.IS_DAO_MEMBER,
  };
}

export function setContentHeader(title, description) {
  return {
    type: constants.EMIT_CONTENT,
    title,
    description,
  };
}

export function expandedForAll(expand) {
  return {
    type: constants.EMIT_EXPAND_ACTION,
    expand,
  };
}

export function expandedForOne(name, expand) {
  return {
    type: constants.EMIT_EXPAND_ACTION_FOR_ONE,
    name,
    expand,
  };
}
