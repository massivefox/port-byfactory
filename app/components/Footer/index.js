import React from 'react';
import { FormattedMessage } from 'react-intl';

import styled from 'styled-components';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

import messages from './messages';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

function Footer() {
  const backgroundColor = '#21212c';
  const textColor = 'white';

  return (
    <section
      style={{
        padding: '50px',
        textAlign: 'center',
        backgroundColor,
        color: textColor,
      }}
    >
      <Row>
        <FormattedMessage {...messages.licenseMessage} />
        <a href="mailto://summer@biyard.co" style={{ paddingLeft: '1em' }}>
          <MailOutlineIcon
            fontSize="small"
            sx={{ color: 'white', fontSize: 20 }}
          />
        </a>
      </Row>
    </section>
  );
}

export default Footer;
