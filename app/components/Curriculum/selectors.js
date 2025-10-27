import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the curriculum state domain
 */

const selectCurriculumDomain = state => state.curriculum || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Curriculum
 */

const makeSelectCurriculum = () =>
  createSelector(
    selectCurriculumDomain,
    substate => substate,
  );

export default makeSelectCurriculum;
export { selectCurriculumDomain };
