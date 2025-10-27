import styled from 'styled-components';
import { Card } from 'semantic-ui-react';

export const DaoCard = styled(Card)`
  background-color: #ffffff !important;
  //   box-shadow: none !important;
  border: 1px solid #e7e8e8;
  border-radius: 16px !important;
  padding: 20px 40px 30px !important;

  .header {
    color: #000000 !important;
    padding: 4px 5px 5px 0px;
  }

  .meta {
    color: var(--secondary) !important;
  }

  .content .label {
    padding: 10px;
    background: #d9ffef;
    border-radius: 60px;
    color: #059d52;
    font-weight: 700;
    font-size: 12px;

    margin-bottom: 0.5em;
  }

  > :last-child {
    display: flex;

    padding: 0 1em !important;
    justify-content: flex-start;
    gap: 1em;
    border-top: none !important;
    color: #999596 !important;
    font-weight: 700;
    font-size: 1em;

    div {
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
      word-break: break-all !important;
    }
  }

  //   &:hover {
  //     background-color: var(--biyard-bg) !important;
  //   }
`;
