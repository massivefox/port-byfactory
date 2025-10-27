import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import './DetailItem.css';
import Helper from '../Helper/Helper';
import { proposalPassLabelColor } from '../../utils/color';
import InfoPopup from '../Helper/InfoPopup';

const PassedLabel = styled.span`
  font-size: 10px;
  margin-right: 10px;
  ${props =>
    props.passed &&
    `color: ${proposalPassLabelColor[props.passed].color} !important;`}
`;

const ValueSpan = styled.span`
  font-weight: 500;
  color: #6d7275;
`;

export default function DetailItem({ name, value, desc, passed }) {
  return (
    <div className="DetailItem">
      <div className="dg Paragraph Paragraph--secondary Paragraph--small DetailItem__Name">
        <span>{name}</span>
      </div>
      <div className="dg Paragraph Paragraph--secondary Paragraph--small DetailItem__Value">
        {passed && <PassedLabel passed={passed}>{passed} </PassedLabel>}
        <ValueSpan>{value} </ValueSpan>
        {desc && <InfoPopup position="left center" content={desc} />}
      </div>
    </div>
  );
}

DetailItem.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  passed: PropTypes.string,
  desc: PropTypes.string,
};
