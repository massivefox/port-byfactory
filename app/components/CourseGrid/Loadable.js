/**
 *
 * Asynchronously loads the component for CourseGrid
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
