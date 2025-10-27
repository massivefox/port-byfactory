/**
 *
 * CourseDetail
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectCourseDetail from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

const Header = styled.div`
  padding-top: 10em;
  min-height: 10rem;
`;

const Subtitle = styled.div`
  font-size: 1.7em;
  font-weight: bold;
`;

export function CourseDetailHeader({ course }) {
  useInjectReducer({ key: 'courseDetail', reducer });
  useInjectSaga({ key: 'courseDetail', saga });
  const { title, subtitle } = course;

  return (
    <Header className="row">
      {/* <div className="courses-list-flag-wrap hey"> */}
      {/* <div className="courses-list-campus"> */}
      {/*   <span>Online</span> */}
      {/* </div>{' '} */}
      {/* </div>{' '} */}
      <h1>{title}</h1>
      <Subtitle>{subtitle} </Subtitle>
    </Header>
  );
}

CourseDetailHeader.propTypes = {
  course: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  courseDetail: makeSelectCourseDetail(),
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

export default compose(withConnect)(CourseDetailHeader);
