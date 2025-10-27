import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';

export const ContentLoader = ({ loading, contents = '' }) => (
  <Dimmer active={loading}>
    <Loader contents={contents} />
  </Dimmer>
);

ContentLoader.propTypes = {
  loading: PropTypes.bool,
  contents: PropTypes.string,
};
