/**
 *
 * CourseDetailContent
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
import makeSelectCourseDetailContent from './selectors';
import reducer from './reducer';
import saga from './saga';
import config from '../../config';
import messages from './messages';

export function CourseDetailContent({ course }) {
  useInjectReducer({ key: 'courseDetailContent', reducer });
  useInjectSaga({ key: 'courseDetailContent', saga });
  const { description, details, duration, type } = course;
  const detailComp = [
    { title: 'Duration', value: duration },
    {
      title: 'Type',
      value: type
        .replace(', ', ',')
        .replace('course', '')
        .split(','),
    },
  ]
    .concat(details)
    .map(el => (
      <li key={el.title}>
        <div className="detail-title">{el.title}</div>
        {Array.isArray(el.value) ? (
          el.value.map(vl => (
            <ul
              key={`${el.title}-${vl}`}
              className="detail-copy unstyled-list inline-list"
            >
              <li className="detail-copy unstyled-list inline-list">{vl}</li>
            </ul>
          ))
        ) : (
          <div className="detail-copy">{el.value}</div>
        )}
      </li>
    ));

  return (
    <section className="course-block content-block" id="description">
      <div className="row">
        <div className="course-block-description medium-fr medium-8 large-9 columns">
          <p
            dangerouslySetInnerHTML={{
              __html: description.replace(/\n/g, '<br />'),
            }}
          />
        </div>
        <div className="course-block-sidebar medium-fl medium-4 large-3 columns">
          <ul className="meta-detail unstyled-list">
            <li>
              <a
                className="button meta-detail-button"
                href={`mailto:${config.contactEmail}}`}
              >
                문의하기
              </a>
            </li>
            {detailComp}
            <li className="meta-detail-contact">
              <div className="detail-title">Contact Admissions</div>
              <a href={`mailto:${config.contactEmail}}`}>
                {config.contactEmail}
              </a>
            </li>
          </ul>{' '}
        </div>
      </div>
    </section>
  );
}

CourseDetailContent.propTypes = {
  course: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  courseDetailContent: makeSelectCourseDetailContent(),
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

export default compose(withConnect)(CourseDetailContent);
