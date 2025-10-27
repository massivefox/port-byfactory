/**
 *
 * FacultySection
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
import makeSelectFacultySection from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export function FacultySection({ faculties }) {
  useInjectReducer({ key: 'facultySection', reducer });
  useInjectSaga({ key: 'facultySection', saga });

  const rows = faculties.map(el => {
    const { image, name, description, position } = el;
    const pf = image ? (
      <div
        className="img-block"
        style={{ backgroundImage: `url('${image}')` }}
      />
    ) : (
      <video className="img-block" width="100%" height="100%" autoPlay loop>
        <source src={el.video} type="video/mp4" />
        강사 프로필
      </video>
    );

    const buatify = desc => {
      const descs = desc.split('\n');
      let ret = '';
      descs.forEach(el => {
        ret = `${ret}<ul style='list-style-type: circle'><li>${el}</li></ul>`;
      });
      return ret;
    };

    return (
      <div className="faculty-member row">
        <div className="faculty-member-image columns large-5">
          <div className="fill">{pf}</div>
        </div>
        <div className="faculty-member-text columns large-7">
          <h3>{name}</h3>
          <p className="faculty-member-position">
            <strong>{position}</strong>
          </p>
          <p
            className="faculty-member-description"
            dangerouslySetInnerHTML={{
              __html: buatify(description),
            }}
          />
          {/* <a */}
          {/*   className="button outline-button" */}
          {/*   href="https://www.sothebysinstitute.com/why-sothebys/our-faculty-and-guest-speakers/georgia-krantz" */}
          {/* > */}
          {/*   Read More */}
          {/* </a> */}
        </div>
      </div>
    );
  });

  return (
    <section className="faculty-members content-block">
      <div className="row">
        <div className="columns">
          <h2 className="no-top-bar" style={{ marginBottom: '0.7em' }}>
            강사 소개
          </h2>
        </div>
      </div>
      {rows}
    </section>
  );
}

FacultySection.propTypes = {
  faculties: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  facultySection: makeSelectFacultySection(),
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

export default compose(withConnect)(FacultySection);
