/*
 * ResetPassword Messages
 *
 * This contains all the text for the ResetPassword container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ResetPassword';

export default defineMessages({
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email',
  },
  send: {
    id: `${scope}.send`,
    defaultMessage: 'Send',
  },
});
