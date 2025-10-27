import { Search } from 'semantic-ui-react';
import styled from 'styled-components';

export const BySearch = styled(Search)`
  padding: 0px !important;
  margin: 0px !important;

  input {
    background-color: var(--biyard-secondary) !important;
    color: var(--biyard-text) !important;
    border: none;
  }

  i {
    color: var(--biyard-primary) !important;
  }

  .prompt {
    border-radius: 8px !important;
  }
  .results {
    .result {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    }

    .header {
      color: var(--biyard-text) !important;
    }

    .label:hover {
      color: var(--biyard-primary) !important;
    }

    .result:hover {
      background: none !important;
    }
  }

  .visible {
    padding: none !important;
  }
`;
