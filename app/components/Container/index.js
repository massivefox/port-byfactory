import styled from 'styled-components';
import { Container } from 'semantic-ui-react';

export const ByContainer = styled(Container)`
  background: #ffffff;
  box-shadow: 8px 10px 25px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 40px;

  .field > label,
  .dropdown *,
  .ui.form input,
  .ui.header,
  .ui.label > a,
  i.icon,
  textarea,
  .ui.divider {
    color: #000000 !important;
  }
`;
