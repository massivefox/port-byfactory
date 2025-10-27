/**
 *
 * ProposalSubmit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import {
  Form,
  Menu,
  Container,
  Header,
  Divider,
  Label,
} from 'semantic-ui-react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import wrap from 'components/BaseApp/wrap';
import { ByButton, ByOutlineButton } from 'components/Button/BiyardButton';
import { ByContainer } from 'components/Container';
import { PageLoader } from 'components/Loader/PageLoader';
import { DaoStepConnector, StepIcon } from './components/stepper';
import { useViewModel } from './useViewModel';
import { PageHaeder } from '../../components/Header';
import { VCTemplateLabels } from './components/DaoTemplate';

const Wrapper = styled.div`
  flex-direction: column;
`;

const ByForm = styled(Form)`
  .fields {
    margin: 0 0 35px !important;
  }

  .inline.fields.toggle {
    padding: 0 20px !important;
    margin: 0 0 20px !important;
    align-items: unset !important;
    width: 100% !important;
    display: flex !important;
    justify-content: space-between;
  }

  .toggle.checkbox label:before {
    background: rgba(255, 255, 255, 0.25) !important;
  }

  .fields > .field.range {
    margin: 0px 20px !important;
  }
  .field > label {
    font-size: 1em !important;
  }
  .field .ui.input {
    display: flex;
    align-items: center;
  }

  input,
  .dropdown {
    border-radius: 12px !important;
  }

  .dropdown .menu {
    border-bottom-left-radius: 12px !important;
    border-bottom-right-radius: 12px !important;
  }

  input,
  textarea,
  .dropdown,
  .text,
  .menu {
    // color: rgb(50, 50, 50) !important;
    background-color: #f5f6f9 !important;
  }

  .ui.checkbox label,
  .ui.checkbox + label,
  .ui.styled.accordion .title {
    color: white !important;
  }
`;

export function CreateDao() {
  const {
    steps,
    activeStep,
    daoName,
    daoSymbol,
    proposalFee,
    votingFee,
    acctVp,
    loading,
    members,
    handleNext,
    handleBack,
    handleReset,
    createDao,
    isProposalSBTActive,
    isVoteSBTActive,
    isCommentSBTActive,
    isEnabledComment,
    isPublicComment,
    isEnabledCommProposal,
    isEnabledConfigProposal,
    isEnabledSBTProposal,
  } = useViewModel();

  // TODO: shows charge page if it is not enough.
  return (
    <Wrapper>
      <Container style={{ padding: '40px' }}>
        <PageHaeder>Creat A DAO</PageHaeder>
        <Description>
          <p>아래 항목에 맞게 작성하고 DAO를 생성 합니다.</p>
          <p>비즈니스 템플릿을 선택하고 내용을 확인해주세요.</p>
        </Description>
      </Container>
      {/* <Background /> */}

      <ByContainer style={{ display: 'inline-block', zIndex: '2' }}>
        <PageLoader loading={loading} />
        <ByForm id="comm-proposal-form" autoComplete="off">
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            connector={<DaoStepConnector />}
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <ByStepLabel StepIconComponent={StepIcon}>
                  {step.label}
                </ByStepLabel>
                <StepContent>
                  {step.content}
                  <Box sx={{ mb: 2 }}>
                    <ButtonsWrapper>
                      <ByOutlineButton
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </ByOutlineButton>
                      <ByButton
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </ByButton>
                    </ButtonsWrapper>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </ByForm>
        {activeStep === steps.length && (
          <AbstractWrapper>
            <Header>아래 정보로 DAO를 생성하시겠습니까?</Header>
            <AbstractDivider />

            <DaoInfo>
              <div className="label">DAO Name</div>
              <div className="content">{daoName}</div>
            </DaoInfo>
            <DaoInfo>
              <div className="label">DAO Symbol</div>
              <div className="content">{daoSymbol}</div>
            </DaoInfo>
            <AbstractDivider />
            <DaoInfo>
              <div className="label">Template name</div>
              <div className="content">Venture Capital(VC)</div>
            </DaoInfo>
            <DaoInfo>
              <div className="label">Extensions</div>
              <div className="content">
                <VCTemplateLabels
                  style={{ marginLeft: '-14px' }}
                  isEnabledCommProposal={isEnabledCommProposal}
                  isEnabledConfigProposal={isEnabledConfigProposal}
                  isEnabledSBTProposal={isEnabledSBTProposal}
                />
              </div>
            </DaoInfo>
            {members.length > 0 && (
              <>
                <AbstractDivider />
                <DaoInfo>
                  <div className="label">Member to invite</div>
                  <div className="content">
                    <MemberWrapper>
                      {members.map(m => (
                        <Label size="large" key={m}>
                          {m}
                        </Label>
                      ))}
                    </MemberWrapper>
                  </div>
                </DaoInfo>
              </>
            )}
            <LastButtonsWrapper>
              <ByOutlineButton onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Reset
              </ByOutlineButton>
              <ByOutlineButton onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                back
              </ByOutlineButton>
              <ByButton onClick={createDao} sx={{ mt: 1, mr: 1 }}>
                Create
              </ByButton>
            </LastButtonsWrapper>
          </AbstractWrapper>
        )}
      </ByContainer>
    </Wrapper>
  );
}

CreateDao.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  rootState: PropTypes.object,
  loadContractData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  title: () => 'Create a DAO',
  description: () => 'DAO를 만들수 있습니다.',
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default wrap(mapStateToProps, mapDispatchToProps, CreateDao);

export const Description = styled.div`
  margin: 10px auto 30px;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.03em;

  color: #7a7c85;
`;

export const SelectFileWrapper = styled.div`
  margin-bottom: 50px;
`;

export const FileInput = styled.div`
  label {
    padding: 6px 25px;
    background-color: var(--biyard);
    border-radius: 4px;
    color: white;
    cursor: pointer;
  }

  input[type='file'] {
    display: none;
  }
`;

export const ByMenu = styled(Menu)`
  & * {
    color: #ffffff !important;
  }
`;

export const ByStepLabel = styled(StepLabel)`
  .MuiStepLabel-label {
    color: #c0c0c0 !important;
    font-weight: 700 !important;
    font-size: 23px !important;
    line-height: 28px !important;
  }

  .MuiStepLabel-label.Mui-active {
    color: var(--biyard-header2) !important;
  }

  .MuiStepLabel-label.Mui-completed {
    color: var(--biyard-button) !important;
  }
`;
const DaoInfo = styled.div`
  margin: 20px;
  font-size: 15px;
  display: flex;
  flex-wrap: wrap;
  > .label {
    flex: 1;
    min-width: 150px;
    font-weight: 700;
  }

  .content {
    flex: 2;
    margin-left: 10px;
    min-width: 150px;
  }
`;

const MemberWrapper = styled.div`
  .label {
    margin-bottom: 12px;
  }
`;

const LastButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 14px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 100px;
  gap: 20px;
`;

const AbstractWrapper = styled.div`
  margin: 40px 24px;
`;

const AbstractDivider = styled(Divider)`
  margin: 24px 0 !important;
`;
