import { Placeholder } from 'semantic-ui-react';
import styled from 'styled-components';

export const ByPlaceHolder = styled(Placeholder)`
  background-color: var(--biyard-bg) !important;

  .image.header:after,
  .line,
  .line:after,
  > :before {
    background: var(--biyard-dark) !important;
  }

  background-image: linear-gradient(
    to right,
    rgba(0, 20, 40, 0.08) 0,
    rgba(0, 20, 40, 0.15) 15%,
    rgba(0, 20, 40, 0.08) 30%
  ) !important;
`;
