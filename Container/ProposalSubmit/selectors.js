import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the proposalSubmit state domain
 */

const selectProposalSubmitDomain = state =>
  state.proposalSubmit || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ProposalSubmit
 */

const makeSelectProposalSubmit = () =>
  createSelector(
    selectProposalSubmitDomain,
    substate => substate,
  );

export default makeSelectProposalSubmit;
export { selectProposalSubmitDomain };
