/*
 * Login Messages
 *
 * This contains all the text for the Login container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Login';

export default defineMessages({
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email',
  },
  password: {
    id: `${scope}.password`,
    defaultMessage: 'Password',
  },
  login: {
    id: `${scope}.login`,
    defaultMessage: 'Login',
  },
  resetPassword: {
    id: `${scope}.resetPassword`,
    defaultMessage: 'Reset password',
  },
  signup: {
    id: `${scope}.signup`,
    defaultMessage: 'Sign up',
  },
});
