import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the listTable state domain
 */

const selectListTableDomain = state => state.listTable || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ListTable
 */

const makeSelectListTable = () =>
  createSelector(
    selectListTableDomain,
    substate => substate,
  );

export default makeSelectListTable;
export { selectListTableDomain };
