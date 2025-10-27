import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the transparency state domain
 */

const selectTransparencyDomain = state => state.transparency || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Transparency
 */

const makeSelectTransparency = () =>
  createSelector(
    selectTransparencyDomain,
    substate => substate,
  );

export default makeSelectTransparency;
export { selectTransparencyDomain };
