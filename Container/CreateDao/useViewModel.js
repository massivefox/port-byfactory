import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useRecoilCacheRefresh } from 'states';
import { daoListState } from 'states/daoStates';
import { sendRedeemCode } from 'services/backend';

import { byToast } from 'components/Toast';
import daoFactoryContract from 'services/contracts/daoFactory';

import { useContractConfig } from './components/useContractConfig';
import { useSelectTemplate } from './components/useSelectTemplate';
import { useInviteMember } from './components/useInviteMember';
import { useDetailDaoConfig } from './components/DetailConfig/useDetailDaoConfig';

export function useViewModel() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    daoName,
    daoSymbol,
    contractConfgStep,
    resetContractConfig,
    validateContractConfig,
  } = useContractConfig();
  const {
    daoTemplate,
    proposalTypes,
    selectTemplateStep,
    isEnabledCommProposal,
    isEnabledConfigProposal,
    isEnabledSBTProposal,
    resetSelectTemplate,
    setTemplateError,
    clearTemplateError,
  } = useSelectTemplate();

  const {
    proposalFee,
    votingFee,
    acctVp,
    isPublicComment,
    isEnabledComment,
    isProposalSBTActive,
    isVoteSBTActive,
    isCommentSBTActive,
    daoConfigStep,
    resetDetalDaoConfig,
  } = useDetailDaoConfig();

  const { members, inviteMemberStep, resetInviteMembers } = useInviteMember();

  const refetchList = useRecoilCacheRefresh(daoListState);

  const handleNext = () => {
    if (activeStep === 0) {
      validateContractConfig();
      if (daoName !== '' && daoSymbol !== '') {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
      }
    }

    if (activeStep === 1) {
      if (daoTemplate !== 'VC') {
        setTemplateError();
      } else {
        clearTemplateError();
        setActiveStep(prevActiveStep => prevActiveStep + 1);
      }
    }

    if (activeStep === 2 || activeStep === 3) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    resetContractConfig();
    resetSelectTemplate();
    resetDetalDaoConfig();
    resetInviteMembers();
    setActiveStep(0);
  };

  const createDao = async () => {
    const dao = {
      name: daoName,
      symbol: daoSymbol,
      proposalFee,
      votingFee,
      acctVp,
      proposalTypes,
      allowResources: [
        isPublicComment,
        isEnabledComment,
        isProposalSBTActive,
        isVoteSBTActive,
        isCommentSBTActive,
        isEnabledCommProposal,
        isEnabledConfigProposal,
        isEnabledSBTProposal,
      ],
    };

    try {
      setLoading(true);
      const daoDep = await daoFactoryContract.deployDao(dao);

      if (members.length > 0) {
        for await (const email of members) {
          await sendRedeemCode(daoName, email);
        }
      }

      refetchList();
      // navigate('/');

      byToast(`Create DAO success`, 'success');
    } catch (e) {
      byToast(`Create DAO failed-${e}`, 'error');
      console.log('error', e);
    }

    setLoading(false);
  };

  const steps = [
    contractConfgStep,
    selectTemplateStep,
    daoConfigStep,
    inviteMemberStep,
  ];

  return {
    steps,
    activeStep,
    daoName,
    daoSymbol,
    proposalFee,
    votingFee,
    acctVp,
    loading,
    handleNext,
    handleBack,
    handleReset,
    createDao,
    members,
    isProposalSBTActive,
    isVoteSBTActive,
    isCommentSBTActive,
    isEnabledComment,
    isPublicComment,
    isEnabledCommProposal,
    isEnabledConfigProposal,
    isEnabledSBTProposal,
  };
}
