import styled from 'styled-components';
import { Card } from 'semantic-ui-react';

export const TpCard = styled(Card)`
  background: #ffffff;
  box-shadow: 8px 10px 25px rgba(0, 0, 0, 0.05) !important;
  border-radius: 16px !important;
  padding: 26px 21px !important;

  margin-bottom: 40px !important;

  .content > .header {
    font-weight: 700 !important;
    font-size: 20px !important;
    line-height: 24px !important;

    color: var(--biyard-header2) !important;
  }

  .divider {
    margin: 24px 0 !important;
  }
`;
