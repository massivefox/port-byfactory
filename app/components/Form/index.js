import { Form } from 'semantic-ui-react';
import styled from 'styled-components';

export const ByForm = styled(Form)`
  .field {
    margin: 0 0 35px !important;
  }

  input,
  textarea,
  .dropdown,
  .text,
  .menu {
    // color: rgb(50, 50, 50) !important;
    background-color: rgb(8, 34, 53) !important;
  }

  textarea:not([rows]) {
    max-height: 48em !important;
  }
`;

export const FormContent = styled.div`
  width: 100%;
  display: flex;
  color: black;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 23px;

  > label {
    // margin-top: 12px;
    font-size: 16px;
    font-weight: 500;
    color: #7e8088;

    flex: 1 0 140px;

    i.icon {
      color: #7e8088 !important;
    }
  }

  > label.disable {
    color: #c0c0c0 !important;
  }

  > label.range {
    flex: 1 0 200px;
  }

  > .content {
    flex: 4 0 50%;

    .toggle-desc {
      font-weight: 700;
      font-size: 1em;
      color: #b3b3b3;
    }
  }
`;
