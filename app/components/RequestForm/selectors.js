import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the requestForm state domain
 */

const selectRequestFormDomain = state => state.requestForm || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RequestForm
 */

const makeSelectRequestForm = () =>
  createSelector(
    selectRequestFormDomain,
    substate => substate,
  );

export default makeSelectRequestForm;
export { selectRequestFormDomain };
