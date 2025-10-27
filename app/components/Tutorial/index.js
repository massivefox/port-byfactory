/**
 *
 * Tutorial
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';

export function Tutorial({ steps, bodies }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const StepBody = bodies[activeStep];

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, i) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps} onClick={() => setActiveStep(i)}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {
        <React.Fragment>
          <StepBody />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              pt: 2,
              marginTop: 20,
            }}
          >
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      }
    </Box>
  );
}

Tutorial.propTypes = {
  steps: PropTypes.array,
  bodies: PropTypes.array,
};
