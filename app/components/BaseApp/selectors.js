import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the assistNftClaim state domain
 */

export const selectBaseAppDomain = state => state.baseApp || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by BaseApp
 */

export const makeSelectBaseApp = () =>
  createSelector(
    selectBaseAppDomain,
    substate => substate,
  );

export const makeSelectKaiKas = () =>
  createSelector(
    selectBaseAppDomain,
    st => st.account,
  );
