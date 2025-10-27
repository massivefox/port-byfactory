import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the courseDetailContent state domain
 */

const selectCourseDetailContentDomain = state =>
  state.courseDetailContent || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CourseDetailContent
 */

const makeSelectCourseDetailContent = () =>
  createSelector(
    selectCourseDetailContentDomain,
    substate => substate,
  );

export default makeSelectCourseDetailContent;
export { selectCourseDetailContentDomain };
