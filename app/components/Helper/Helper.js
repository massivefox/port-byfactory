import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Popup } from 'semantic-ui-react';

export const HelperPopup = styled(Popup)`
  box-sizing: content-box;
  color: white !important;
  background-color: var(--biyard-dark-light) !important;
  box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
  padding: 7px 12px !important;

  &:before {
    background: var(--biyard-dark-light) !important;
  }
`;

function Helper({ position, text, size, containerClassName, iconClassName }) {
  return (
    <HelperPopup
      content={<span>{text}</span>}
      position={position}
      trigger={
        <div className={containerClassName || 'Helper__Container'}>
          <svg
            className={iconClassName || 'Helper__Icon'}
            width={size}
            height={size}
            viewBox="0 2 24 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
            />
          </svg>
        </div>
      }
      on="hover"
      hoverable
      className={
        (containerClassName && `${containerClassName}--Popup`) ||
        'Helper__Container--Popup'
      }
    />
  );
}

Helper.propTypes = {
  position: PropTypes.string,
  text: PropTypes.string,
  size: PropTypes.string,
  containerClassName: PropTypes.string,
  iconClassName: PropTypes.string,
};

export default Helper;
