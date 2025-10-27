/*
 * SignUp Messages
 *
 * This contains all the text for the SignUp container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.SignUp';

export default defineMessages({
  signup: {
    id: `${scope}.signup`,
    defaultMessage: 'Sign up',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
});
