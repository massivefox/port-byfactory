import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the accountProfile state domain
 */

const selectAccountProfileDomain = state =>
  state.accountProfile || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AccountProfile
 */

const makeSelectAccountProfile = () =>
  createSelector(
    selectAccountProfileDomain,
    substate => substate,
  );

export default makeSelectAccountProfile;
export { selectAccountProfileDomain };
