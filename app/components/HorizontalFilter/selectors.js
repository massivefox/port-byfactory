import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the horizontalFilter state domain
 */

const selectHorizontalFilterDomain = state =>
  state.horizontalFilter || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by HorizontalFilter
 */

const makeSelectHorizontalFilter = () =>
  createSelector(
    selectHorizontalFilterDomain,
    substate => substate,
  );

export default makeSelectHorizontalFilter;
export { selectHorizontalFilterDomain };
