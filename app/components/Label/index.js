import styled from 'styled-components';
import { Label } from 'semantic-ui-react';
import {
  PROPOSAL_PASS,
  PROPOSAL_STATUS,
  PROPOSAL_TYPE,
} from '../../utils/constants';

const proposalTypeLabelColor = {
  [PROPOSAL_TYPE.NEW_FUND]: { bg: '#ffe9df', color: '#ff7439' },
  [PROPOSAL_TYPE.NEW_DEAL]: { bg: '#e0dcf3', color: '#3c24b3' },
  [PROPOSAL_TYPE.VC]: { bg: '#e1f3d6', color: '#44b600' },
  [PROPOSAL_TYPE.ETC]: { bg: '#fef7d2', color: '#ffb03f' },
  [PROPOSAL_TYPE.LEGACY_POLICY]: { bg: 'var(--biyard)', color: '#ffffff' },
  [PROPOSAL_TYPE.NEW_POLICY]: { bg: '#ffe9df', color: '#ff7439' },
};

const proposalStatusLabelColor = {
  [PROPOSAL_STATUS.ACTIVE]: { bg: 'transparent', color: '#059d52' },
  [PROPOSAL_STATUS.FINISHED]: { bg: '#e0dcf3', color: '#3c24b3' },
};

const proposalPassLabelColor = {
  [PROPOSAL_PASS.PASSED]: { bg: 'transparent', color: '#44b600' },
  [PROPOSAL_PASS.REJECTED]: { bg: 'transparent', color: '#d80027' },
};

export const StatusLabel = styled(Label)`
  border-radius: 14px !important;
  margin-right: 8px !important;
  ${props =>
    props.status &&
    `background-color: ${proposalStatusLabelColor[props.status].bg} !important;
color: ${proposalStatusLabelColor[props.status].color} !important;
border: 1px solid ${proposalStatusLabelColor[props.status].color} !important;
    `}
`;

export const PassedLabel = styled(Label)`
  border-radius: 14px !important;
  margin-right: 8px !important;
  ${props =>
    props.passed &&
    `background-color: ${proposalPassLabelColor[props.passed].bg} !important;
color: ${proposalPassLabelColor[props.passed].color} !important;
border: 1px solid ${proposalPassLabelColor[props.passed].color} !important;
    `}
`;

export const TypeLabel = styled(Label)`
  border-radius: 14px !important;
  margin-right: 8px !important;
  ${props =>
    props.type &&
    `background-color: ${proposalTypeLabelColor[props.type]?.bg ||
      proposalTypeLabelColor[PROPOSAL_TYPE.ETC].bg} !important;
color: ${proposalTypeLabelColor[props.type]?.color ||
      proposalTypeLabelColor[PROPOSAL_TYPE.ETC].color} !important;
border: 1px solid ${proposalTypeLabelColor[props.type]?.bg ||
      proposalTypeLabelColor[PROPOSAL_TYPE.ETC].bg} !important;
    `}
`;
