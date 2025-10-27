/**
 *
 * CourseGrid
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectCourseGrid from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export function CourseGrid({ courses }) {
  useInjectReducer({ key: 'courseGrid', reducer });
  useInjectSaga({ key: 'courseGrid', saga });

  const courseComp = courses.map((el, i) => (
    <li
      className="courses-list-course loading loaded"
      data-id={el.id}
      filter-type={el.type}
      filter-topic={el.title}
      filter-duration={el.duration}
      key={`course-item-${i}`}
    >
      {' '}
      <a className="courses-list-card" href={`/course/${el.id}`}>
        {/* <div className="courses-list-flag-wrap"> */}
        {/*   <div className="courses-list-campus"> */}
        {/*     <span>Online</span> */}
        {/*   </div>{' '} */}
        {/* </div> */}
        <div
          className="courses-list-image"
          style={{ backgroundImage: `url('${el.image}')` }}
        />
        <div className="courses-list-inner">
          <div className="courses-list-type">{el.type}</div>
          <div className="courses-list-title">{el.title}</div>{' '}
        </div>
        <div className="courses-list-footer-wrap">
          <div className="courses-list-duration">{el.duration}</div>
        </div>{' '}
      </a>
    </li>
  ));

  return (
    <section className="catalog-block courses">
      <div className="container">
        <strong>
          No courses match your selection. Try expanding your search.
        </strong>
        <ul className="courses-list">{courseComp}</ul>
      </div>
    </section>
  );
}

CourseGrid.propTypes = {
  dispatch: PropTypes.func.isRequired,
  courses: PropTypes.array.isRequired,
};

const mapStateToProps = createStructuredSelector({
  courseGrid: makeSelectCourseGrid(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(CourseGrid);
