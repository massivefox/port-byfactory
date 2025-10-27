import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the courseGrid state domain
 */

const selectCourseGridDomain = state => state.courseGrid || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CourseGrid
 */

const makeSelectCourseGrid = () =>
  createSelector(
    selectCourseGridDomain,
    substate => substate,
  );

export default makeSelectCourseGrid;
export { selectCourseGridDomain };
