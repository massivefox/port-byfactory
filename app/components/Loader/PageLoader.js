import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';
import { useMediaQuery } from 'react-responsive';

export const PageLoader = ({ loading, contents = '' }) => {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  return (
    <Dimmer active={loading} page className={isDesktop && 'desktop'} inverted>
      <Loader contents={contents} />
    </Dimmer>
  );
};

PageLoader.propTypes = {
  loading: PropTypes.bool,
  contents: PropTypes.string,
};
