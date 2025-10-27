import { PROPOSAL_TYPE, PROPOSAL_STATUS, PROPOSAL_PASS } from './constants';

export const proposalTypeLabelColor = {
  [PROPOSAL_TYPE.NEW_FUND]: { bg: '#ffe9df', color: '#ff7439' },
  [PROPOSAL_TYPE.NEW_DEAL]: { bg: '#e0dcf3', color: '#3c24b3' },
  [PROPOSAL_TYPE.VC]: { bg: '#e1f3d6', color: '#44b600' },
  [PROPOSAL_TYPE.ETC]: { bg: '#fef7d2', color: '#ffb03f' },
  [PROPOSAL_TYPE.LEGACY_POLICY]: { bg: 'var(--biyard)', color: '#ffffff' },
  [PROPOSAL_TYPE.NEW_POLICY]: { bg: '#ffe9df', color: '#ff7439' },
};

export const proposalStatusLabelColor = {
  [PROPOSAL_STATUS.ACTIVE]: { bg: 'transparent', color: 'var(--light)' },
  [PROPOSAL_STATUS.FINISHED]: { bg: '#e0dcf3', color: '#3c24b3' },
};

export const proposalPassLabelColor = {
  [PROPOSAL_PASS.PASSED]: { bg: 'transparent', color: '#44b600' },
  [PROPOSAL_PASS.REJECTED]: { bg: 'transparent', color: 'var(--summer-red)' },
};
