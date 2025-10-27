import React from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  width: 100%;
  margin-top: 10px;
`;

function StyledTextField(props) {
  return (
    <Wrapper>
      <TextField style={{ width: '100%' }} {...props} />
    </Wrapper>
  );
}

export default StyledTextField;
