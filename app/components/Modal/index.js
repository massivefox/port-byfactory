import styled from 'styled-components';
import { Modal } from 'semantic-ui-react';

export const ByModal = styled(Modal)`
  max-width: 703px;
  background-color: #ffffff !important;
  padding: 14px !important;
  border-radius: 12px !important;

  > .close {
    top: 0.5rem !important;
    right: 0.5rem !important;
    background: #ecedf4 !important;
    border-radius: 5px !important;
    color: #8e929b !important;
  }

  > .content > .description {
    color: #7a7c85 !important;
    p {
      margin-bottom: 0.5em !important;
    }
  }

  .content,
  .actions,
  .segment {
    background-color: #ffffff !important;
  }

  > .header {
    font-weight: 500;
    font-size: 18px !important;
    line-height: 22px;
    color: #8e929b !important;
    text-align: center;
    background-color: #ffffff !important;
    border-bottom: none !important;
  }
`;
