/**
 *
 * Button.js
 *
 * A common button, if you pass it a prop "route" it'll render a link to a react-router route
 * otherwise it'll render a link with an onclick
 */

import React, { Children } from 'react';
import PropTypes from 'prop-types';

import A from './A';
import StyledButton from './StyledButton';
import Wrapper from './Wrapper';

function Button(props) {
  return props.handleRoute ? (
    <StyledButton onClick={props.handleRoute}>
      {Children.toArray(props.children)}
    </StyledButton>
  ) : (
    <A href={props.href} onClick={props.onClick}>
      {Children.toArray(props.children)}
    </A>
  );
}

Button.propTypes = {
  handleRoute: PropTypes.func,
  href: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default Button;
