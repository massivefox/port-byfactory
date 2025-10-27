import React from 'react';
import PropTypes from 'prop-types';
import './DetailsSection.css';
import './LinkWithIcon.css';
import './SectionButton.css';
import { Link } from 'react-router-dom';
import openIcon from '../../images/icons/open.svg';

export default function ExternalLinkWithIcon({ href, text, imageSrc }) {
  return (
    <Link to={href} className="DetailsSection SectionButton LinkWithIcon">
      <img src={imageSrc} width="20" height="20" alt="" />
      <span>{text}</span>
      <img src={openIcon} width="12" height="12" alt="" />
    </Link>
  );
}

ExternalLinkWithIcon.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string,
  imageSrc: PropTypes.string,
};
