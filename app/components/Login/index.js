/**
 *
 * Login
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { FormattedMessage as M } from 'react-intl';
import { Link } from 'react-router-dom';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import makeSelectLogin from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import StyledTextField from '../StyledTextField';
import Button from '../Button';
import Row from '../Row';
import Column from '../Column';

export function Login() {
  useInjectReducer({ key: 'login', reducer });
  useInjectSaga({ key: 'login', saga });
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <Column>
      <StyledTextField
        style={{ margin: '10px' }}
        label={<M {...messages.email} />}
        value={email}
        onChange={evt => setEmail(evt.target.value)}
      />
      <StyledTextField
        style={{ margin: '10px' }}
        label={<M {...messages.password} />}
        type="password"
        value={password}
        onChange={evt => setPassword(evt.target.value)}
      />
      <Row>
        <Link to="/auth/signup">
          <M {...messages.signup} />
        </Link>
        <Link to="/auth/reset-password">
          <M {...messages.resetPassword} />
        </Link>
        <Button>
          <M {...messages.login} />
        </Button>
      </Row>
    </Column>
  );
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  login: makeSelectLogin(),
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

export default compose(withConnect)(Login);
