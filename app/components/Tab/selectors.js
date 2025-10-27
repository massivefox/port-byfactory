import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the subMenu state domain
 */

const selectSubMenuDomain = state => state.subMenu || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SubMenu
 */

const makeSelectSubMenu = () =>
  createSelector(
    selectSubMenuDomain,
    substate => substate,
  );

export default makeSelectSubMenu;
export { selectSubMenuDomain };
