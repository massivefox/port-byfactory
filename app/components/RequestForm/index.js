/**
 *
 * RequestForm
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
import makeSelectRequestForm from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export function RequestForm() {
  useInjectReducer({ key: 'requestForm', reducer });
  useInjectSaga({ key: 'requestForm', saga });
  const countries = ['Korea', 'USA'];
  const countryForm = countries.map(el => (
    <label htmlFor={el}>
      <input
        className="offscreen"
        id={el}
        name="country_of_residence"
        type="radio"
        value={el}
      />
      <span>{el}</span>
    </label>
  ));

  return (
    <div id="requestinfo">
      <section className="contact-block bg-grey-med">
        <div className="container">
          <div className="contact-block-col-left">
            <h2>Have a Question?</h2>
            <p>
              Provide your contact information and we’ll send you more
              information about our courses.
            </p>
          </div>
          <div className="contact-block-col-right">
            <form
              className="contact-form"
              action="https://www.sothebysinstitute.com/mailers/mailer.php"
              method="post"
              noValidate="novalidate"
            >
              <label
                className="form-field form-field-right-pad"
                htmlFor="first_name"
              >
                <span className="offscreen">First Name</span>
                <div className="input-wrap">
                  <input
                    name="first_name"
                    type="text"
                    placeholder="First Name *"
                  />
                </div>
              </label>
              <label
                className="form-field form-field-left-pad"
                htmlFor="last_name"
              >
                <span className="offscreen">Last Name</span>
                <div className="input-wrap">
                  <input
                    name="last_name"
                    type="text"
                    placeholder="Last Name *"
                  />
                </div>
              </label>
              <label
                className="form-field form-field-right-pad"
                htmlFor="email"
              >
                <span className="offscreen">Email</span>
                <div className="input-wrap">
                  <input name="email" type="email" placeholder="Email *" />
                </div>
              </label>
              <div className="form-field country-field form-field-left-pad valid">
                <div className="input-wrap styled-select single-select">
                  <button
                    className="styled-select-inner arrow"
                    type="button"
                    aria-invalid="false"
                  >
                    <span data-placeholder="Country of Residence *">
                      Country of Residence *
                    </span>
                  </button>
                  <div className="styled-select-dropdown">{countryForm}</div>{' '}
                </div>{' '}
              </div>
              <div className="form-field form-field-right-pad valid">
                <div className="input-wrap styled-select single-select">
                  <button
                    className="styled-select-inner arrow"
                    type="button"
                    aria-invalid="false"
                  >
                    <span data-placeholder="I am a... *">I am a... *</span>
                  </button>
                  <div className="styled-select-dropdown">
                    <label htmlFor="undergraduate_student">
                      <input
                        className="offscreen"
                        id="undergraduate_student"
                        name="user_type"
                        type="radio"
                        value="Undergraduate Student"
                      />
                      <span>Undergraduate Student</span>
                    </label>
                    <label htmlFor="graduate_student">
                      <input
                        className="offscreen"
                        id="graduate_student"
                        name="user_type"
                        type="radio"
                        value="Graduate Student"
                      />
                      <span>Graduate Student</span>
                    </label>
                    <label htmlFor="high_school_student">
                      <input
                        className="offscreen"
                        id="high_school_student"
                        name="user_type"
                        type="radio"
                        value="High School Student"
                      />
                      <span>High School Student</span>
                    </label>
                    <label htmlFor="professional">
                      <input
                        className="offscreen"
                        id="professional"
                        name="user_type"
                        type="radio"
                        value="Professional"
                      />
                      <span>Professional</span>
                    </label>
                    <label htmlFor="parent">
                      <input
                        className="offscreen"
                        id="parent"
                        name="user_type"
                        type="radio"
                        value="Parent"
                      />
                      <span>Parent</span>
                    </label>
                    <label htmlFor="educator">
                      <input
                        className="offscreen"
                        id="educator"
                        name="user_type"
                        type="radio"
                        value="Educator"
                      />
                      <span>Educator</span>
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

RequestForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  requestForm: makeSelectRequestForm(),
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

export default compose(withConnect)(RequestForm);
