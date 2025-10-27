import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, Popup } from 'semantic-ui-react';

const HelperPopup = styled(Popup)`
  box-sizing: content-box;
  color: white !important;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.25));
  padding: 16px !important;
  max-width: 304px !important;

  background: #2e2e2e !important;
  border-radius: 16px !important;
  text-align: center;

  &:before {
    background: #2e2e2e !important;
  }
`;

// TODO: semantic-ui-react 자체 버그로 인해서 hover로 변경. popup 스크롤시 position 변경되도록 수정되어야함
function InfoPopup({ content, position = 'top center' }) {
  return (
    <HelperPopup
      position={position}
      content={content}
      // on="click"
      trigger={
        <Icon
          name="info circle"
          color="grey"
          link
          style={{ marginLeft: '5px' }}
        />
      }
    />
  );
}

InfoPopup.propTypes = {
  content: PropTypes.any,
  position: PropTypes.string,
};

export default InfoPopup;
