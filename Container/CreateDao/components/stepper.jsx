import React from 'react';
import { styled as muStyled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const DaoStepConnector = muStyled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.lineVertical}`]: {
      borderColor: 'var(--biyard-button)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.lineVertical}`]: {
      borderColor: 'var(--biyard-button)',
    },
  },
}));

const StepIconRoot = muStyled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 24,
  alignItems: 'center',
  ...(ownerState.active && {
    color: 'var(--biyard-button)',
  }),
  '& .completedIcon': {
    color: 'var(--biyard-button)',
  },
}));

export function StepIcon(props) {
  const { active, completed, className } = props;

  return (
    <StepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <CheckIcon className="completedIcon" />
      ) : (
        <CheckCircleOutlineIcon />
      )}
    </StepIconRoot>
  );
}

StepIcon.propTypes = {
  active: PropTypes.any,
  completed: PropTypes.bool,
  className: PropTypes.bool,
};
