import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the textSection state domain
 */

const selectTextSectionDomain = state => state.textSection || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by TextSection
 */

const makeSelectTextSection = () =>
  createSelector(
    selectTextSectionDomain,
    substate => substate,
  );

export default makeSelectTextSection;
export { selectTextSectionDomain };
