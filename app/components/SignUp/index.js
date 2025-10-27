/**
 *
 * SignUp
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage as M } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectSignUp from './selectors';
import reducer from './reducer';
import saga from './saga';
import m from './messages';
import Column from '../Column';
import T from '../StyledTextField';
import B from '../Button';
import R from '../Row';

export function SignUp() {
  useInjectReducer({ key: 'signUp', reducer });
  useInjectSaga({ key: 'signUp', saga });

  return (
    <Column>
      <T label="Email" />
      <T label="Passowrd" type="password" />
      <T label="Password Confirmation" type="password" />
      <R>
        <B>
          {' '}
          <M {...m.cancel} />
        </B>
        <B>
          {' '}
          <M {...m.signup} />
        </B>
      </R>
    </Column>
  );
}

SignUp.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  signUp: makeSelectSignUp(),
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

export default compose(withConnect)(SignUp);
