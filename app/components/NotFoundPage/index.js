/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import H1 from 'components/H1';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import messages from './messages';
import { BiyardButton } from '../Button/BiyardButton';

const HomeButton = styled.div`
  display: flex;
  margin: 1.5em;
  justify-content: center;
`;

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <article>
      <H1>
        <FormattedMessage {...messages.header} />
      </H1>
      <HomeButton>
        <BiyardButton size="large" onClick={() => navigate('/')}>
          Go home
        </BiyardButton>
      </HomeButton>
    </article>
  );
}
