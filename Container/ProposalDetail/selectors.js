import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the proposalDetail state domain
 */

const selectProposalDetailDomain = state =>
  state.proposalDetail || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ProposalDetail
 */

const makeSelectProposalDetail = () =>
  createSelector(
    selectProposalDetailDomain,
    substate => substate,
  );

export default makeSelectProposalDetail;
export { selectProposalDetailDomain };
