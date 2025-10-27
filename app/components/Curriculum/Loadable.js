/**
 *
 * Asynchronously loads the component for Curriculum
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
