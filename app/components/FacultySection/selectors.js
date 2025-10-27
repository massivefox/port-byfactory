import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the facultySection state domain
 */

const selectFacultySectionDomain = state =>
  state.facultySection || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by FacultySection
 */

const makeSelectFacultySection = () =>
  createSelector(
    selectFacultySectionDomain,
    substate => substate,
  );

export default makeSelectFacultySection;
export { selectFacultySectionDomain };
