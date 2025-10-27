/*
 * Tutorial Messages
 *
 * This contains all the text for the Tutorial component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.Tutorial';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the Tutorial component!',
  },
});
