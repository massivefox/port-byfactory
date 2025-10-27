import React from 'react';
export function cropMiddleText(text, cropLength = 6) {
  return `${text.substr(0, cropLength)}...${text.substr(-cropLength)}`;
}

export function isCommentFormat(value) {
  return value.match(/^.{0,200}$/);
}

export function isDescriptionForamt(value) {
  return value.match(/^(.|\n){0,15000}$/);
}

export function convertTag(txt) {
  let p;
  if (txt) {
    p = txt.split('\n').map((item, i) => <p key={`${i}`}>{item}</p>);
  }
  return p;
}

export function validateDaoName(value) {
  return value.match(/^[-A-Za-z0-9 ]{0,20}$/);
}

export function validateDaoSymbol(value) {
  return value.match(/^[A-Za-z0-9]{0,10}$/);
}

export function validateEmailFormat(value) {
  return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
}

export function validateOnlyNumber(value) {
  return value.match(/^[0-9]+$/);
}

export const policiesTextInfo = {
  POLICY_PROPOSAL_FEE: {
    name: 'Proposal fee',
    desc: 'Proposal 제출시 사용되는 수수료 입니다.',
    realNumber: false,
  },
  POLICY_VOTE_FEE: {
    name: 'Voting fee',
    desc: 'Proposal 투표시 사용되는 수수료 입니다.',
    realNumber: false,
  },
  POLICY_MAXIMUM_VOTE_POWER_PER_ADDRESS: {
    name: 'VP per account',
    desc: '한 계정당 최대 투표할 수 있는 최대 voting power 입니다.',
    realNumber: false,
  },
  POLICY_MINIMUM_VOTE_POWER_PER_ONCE: {
    name: 'VP per once',
    desc: '한 투표에 소모되는 최소 voting power 입니다.',
    realNumber: false,
  },
  POLICY_FINALIZE_VOTE_POWER: {
    name: 'Finalize VP',
    desc: 'Proposal이 종료되는 최종 voting power 입니다.',
    realNumber: false,
  },
  POLICY_MINIMUM_VOTE_NUMBER: {
    name: 'Minimum Voting number',
    desc: 'Proposal에서 요구되는 최소 voting 인원 수 입니다.',
    realNumber: true,
  },
};
