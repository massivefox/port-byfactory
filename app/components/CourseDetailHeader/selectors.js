import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the courseDetail state domain
 */

const selectCourseDetailDomain = state => state.courseDetail || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CourseDetail
 */

const makeSelectCourseDetail = () =>
  createSelector(
    selectCourseDetailDomain,
    substate => substate,
  );

export default makeSelectCourseDetail;
export { selectCourseDetailDomain };
