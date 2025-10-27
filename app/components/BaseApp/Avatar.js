import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { useImage } from 'react-image';

const Logo = styled.img`
  align-self: center;
  margin-top: 30px;
  margin-bottom: 30px;
  text-align: center;
  width: 200px;
`;
const NftImagePlaceholder = styled(Logo)`
  margin: auto;
`;

function NftImage() {
  const { src } = useImage({
    srcList:
      'https://metadata-store.klaytnapi.com/e4232b30-80b5-052b-4c6a-f9726b4a02d5/955a8a17-f900-d0ae-5741-da6340ebc1fb.jpeg',
  });

  return <NftImagePlaceholder src={src} />;
}
