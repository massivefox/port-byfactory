import styled from 'styled-components';
import { Button } from 'semantic-ui-react';

/**
 * @deprecated
 */
export const BiyardButton = styled(Button)`
  outline: 1px solid var(--biyard) !important;
  background: none !important;
  color: var(--biyard) !important;

  &:hover {
    color: white !important;
    background: var(--biyard) !important;
  }
`;

export const ByButton = styled(Button)`
  background: var(--biyard-button) !important;
  border-radius: 8px !important;
  color: #ffffff !important;

  &:hover {
    color: var(--biyard-primary) !important;
    background: var(--biyard-secondary) !important;
    outline: 1px solid var(--biyard-primary) !important;
  }
`;

export const ByInvertedButton = styled(Button)`
  outline: 1px solid var(--biyard-button) !important;
  background: #ffffff !important;
  border-radius: 8px !important;
  color: var(--biyard-button) !important;

  // &:hover {
  //   color: var(--biyard-primary) !important;
  //   background: var(--biyard-secondary) !important;
  //   outline: 1px solid var(--biyard-primary) !important;
  // }
`;

export const ByOutlineButton = styled(Button)`
  background: #ffffff !important;
  outline: 1px solid #d9d9d9 !important;
  border-radius: 8px !important;
  color: #000000 !important;

  &:hover {
    background: #f5f6f9 !important;
  }
`;

export const ByOutlineButton2 = styled(Button)`
  background: #ffffff !important;
  border: 1px solid #b3b3b3 !important;

  border-radius: 8px !important;
`;
