/**
 *
 * Asynchronously loads the component for SubMenu
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
