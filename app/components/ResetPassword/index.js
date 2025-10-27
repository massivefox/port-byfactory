/**
 *
 * ResetPassword
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
import makeSelectResetPassword from './selectors';
import reducer from './reducer';
import saga from './saga';
import m from './messages';

import T from '../StyledTextField';
import B from '../Button';

export function ResetPassword() {
  useInjectReducer({ key: 'resetPassword', reducer });
  useInjectSaga({ key: 'resetPassword', saga });

  return (
    <div>
      <T label={<M {...m.email} />} />
      <B> {<M {...m.send} />}</B>
    </div>
  );
}

ResetPassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  resetPassword: makeSelectResetPassword(),
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

export default compose(withConnect)(ResetPassword);
