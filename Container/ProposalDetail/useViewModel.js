import { useEffect, useState, useMemo } from 'react';
import DefaultProfile from 'images/default_profile.png';
import { useRecoilValueLoadable } from 'recoil';
import ReactGA from 'react-ga';
import { useParams } from 'react-router-dom';
import { sleep } from 'utils/time';
import configurationProposalContract from 'services/contracts/proposals/configurationProposal';
import communityProposalContract from 'services/contracts/proposals/communityProposal';
import memberContract from 'services/contracts/member';
import profileContract from 'services/contracts/profile';
import { isCommentFormat, policiesTextInfo } from 'utils/textUtil';
import { PROPOSAL_STATUS } from 'utils/constants';
import { byToast } from 'components/Toast';
import { notificationTrigger } from 'components/Novu/NovuTrigger';
import { userState } from 'states';
import {
  useGetAccepters,
  useGetComments,
  useGetParticipants,
  useGetPolicy,
  useGetProposal,
  useGetRejecters,
  useGetVoterRmValue,
} from 'hooks/useGetProposals';
import { useModal } from 'hooks/Modal';
import {
  useGetIsEnabledComment,
  useGetIsEnabledPublicComment,
} from '../../hooks/proposals/useCommunityProposal';
import { useGetIsMember } from '../../hooks/useGetMembers';

const modalTypes = {
  yes: 'YES',
  no: 'NO',
};

export function useViewModel(id, proposalType) {
  const { daoname } = useParams();
  const { caver } = window;
  const isConfigProposal = proposalType === 'config';
  const { contents: userInfo } = useRecoilValueLoadable(userState);
  const [modalType, setModalType] = useState();
  const [mainComment, setMainComment] = useState('');
  const [votingComment, setVotingComment] = useState('');
  const [pageLoading, setPageLoading] = useState(false);
  const [votingLoading, setVotingLoading] = useState(false);
  const [proposalCreater, setProposalCreater] = useState(DefaultProfile);
  const [minVp, setMinVp] = useState(caver.utils.convertToPeb('1', 'KLAY'));

  const [isVotingModalOpen, openVotingModal, closeVotingModal] = useModal();
  const [isVoterModalOpen, openVoterModal, closeVoterModal] = useModal();

  const { data: proposal, refetch: refetchProposal } = useGetProposal(id);
  const { data: part, refetch: refetchParticipants } = useGetParticipants(id);
  const { data: acc, refetch: refetchAccepters } = useGetAccepters(id);
  const { data: rej, refetch: refetchRejecters } = useGetRejecters(id);
  const { data: comments, refetch: refetchComments } = useGetComments(id);
  const { data: fvp } = useGetPolicy('POLICY_FINALIZE_VOTE_POWER');
  const { data: mvp } = useGetPolicy('POLICY_MINIMUM_VOTE_POWER_PER_ONCE');
  const { data: mvn } = useGetPolicy('POLICY_MINIMUM_VOTE_NUMBER');
  const { data: vpPerAddress } = useGetPolicy(
    'POLICY_MAXIMUM_VOTE_POWER_PER_ADDRESS',
  );
  const { data: isEnabledComment } = useGetIsEnabledComment(daoname);
  const { data: isMember, isLoading: isMemberLoading } = useGetIsMember(
    daoname,
  );
  const { data: isEnabledPublicComment } = useGetIsEnabledPublicComment(
    daoname,
  );
  const { data: voterRmValue, refetch: refetchRmValue } = useGetVoterRmValue(
    id,
  );

  useEffect(() => {
    (async () => {
      if (!proposal || mvp === undefined) return;
      const proposalImage = await profileContract.getProfile(
        proposal?.proposer,
      );
      setProposalCreater(proposalImage);
      setMinVp(mvp);
    })();
  }, [proposal, mvp]);

  const commentList = useMemo(() => {
    if (comments === undefined) return [];

    return comments;
  }, [comments]);

  const participants = useMemo(() => {
    if (part === undefined) return [];

    return part;
  }, [part]);

  const accepters = useMemo(() => {
    if (acc === undefined) return [];

    return acc;
  }, [acc]);

  const rejecters = useMemo(() => {
    if (rej === undefined) return [];

    return rej;
  }, [rej]);

  const votingModalOpen = e => {
    openVotingModal();
    setModalType(e.target.value);
    ReactGA.modalview('voting-modal');
  };

  const handleVotingComment = e => {
    const input = e.currentTarget.value;
    if (isCommentFormat(input)) {
      setVotingComment(input);
    }
  };

  const handleVoting = async dao => {
    setVotingLoading(true);

    try {
      let content = '';
      if (votingComment !== '') {
        content = {
          account: userInfo.address,
          profile: userInfo.profile,
          comment: votingComment,
          voting: modalType,
          createdAt: Math.floor(new Date().getTime() / 1000),
        };
      }

      if (modalType === modalTypes.yes) {
        if (isConfigProposal) {
          await configurationProposalContract.acceptConfigurationProposal(
            id,
            minVp,
            content,
          );
        } else {
          await communityProposalContract.acceptCommunityProposal(
            id,
            minVp,
            content,
          );
        }
      }

      if (modalType === modalTypes.no) {
        if (isConfigProposal) {
          await configurationProposalContract.rejectConfigurationProposal(
            id,
            minVp,
            content,
          );
        } else {
          await communityProposalContract.rejectCommunityProposal(
            id,
            minVp,
            content,
          );
        }
      }

      await sleep(1000);
      refetchProposal();
      refetchComments();
      refetchParticipants();
      refetchAccepters();
      refetchRejecters();
      refetchRmValue();
      setVotingComment('');
      closeVotingModal();
      byToast(`Voting success`, 'success');
      // TODO: Apply after novu backend
      // console.log('lowerParticipants', lowerParticipants);
      // notificationTrigger('Voting', lowerParticipants, {
      //   daoname,
      //   proposalid: id,
      // });
    } catch (e) {
      byToast(`Voting failed ${e}`, 'error');
    }
    setVotingLoading(false);
  };

  const proposalInfo = useMemo(() => {
    if (!proposal) return undefined;

    const type = parseInt(proposal.proposalType, 10);

    proposal.acceptedPowers = caver.utils.convertFromPeb(
      proposal.acceptedPowers.toString(),
      'KLAY',
    );
    proposal.rejectedPowers = caver.utils.convertFromPeb(
      proposal.rejectedPowers.toString(),
      'KLAY',
    );

    if (type === 1) {
      if (!policiesTextInfo[proposal.policyName].realNumber) {
        proposal.policyValue = caver.utils.convertFromPeb(
          proposal.policyValue.toString(),
          'KLAY',
        );
      }
    }

    return proposal;
  }, [caver.utils, proposal]);

  const finalVp = useMemo(() => {
    if (!fvp) return 0;
    return caver.utils.convertFromPeb(fvp.toString(), 'KLAY');
  }, [caver.utils, fvp]);

  const acceptPercent = useMemo(() => {
    if (
      participants === undefined ||
      finalVp === 0 ||
      !proposal?.acceptedPowers
    )
      return 0;

    const percent = (proposal.acceptedPowers / finalVp) * 100;
    const votePercent = (accepters.length / mvn) * 100;

    const finalPercent = percent > votePercent ? votePercent : percent;
    return Math.round(finalPercent * 100) / 100;
  }, [participants, finalVp, proposal, accepters.length, mvn]);

  const rejectPercent = useMemo(() => {
    if (
      participants === undefined ||
      finalVp === 0 ||
      !proposal?.rejectedPowers
    )
      return 0;

    const percent = (proposal.rejectedPowers / finalVp) * 100;
    const votePercent = (rejecters.length / mvn) * 100;

    const finalPercent = percent > votePercent ? votePercent : percent;
    return Math.round(finalPercent * 100) / 100;
  }, [participants, finalVp, proposal, rejecters.length, mvn]);

  const inputMainComment = e => {
    const input = e.currentTarget.value;
    if (isCommentFormat(input)) {
      setMainComment(input);
    }
  };

  const applyMainComment = async dao => {
    setPageLoading(true);
    const lowerParticipants = participants.toString().toLowerCase();
    try {
      const content = {
        account: userInfo.address,
        profile: userInfo.profile,
        comment: mainComment,
        createdAt: Math.floor(new Date().getTime() / 1000),
      };

      if (isConfigProposal) {
        await configurationProposalContract.setConfigurationComment(
          id,
          content,
        );
      } else {
        await communityProposalContract.setCommunityComment(id, content);
      }

      byToast(`Comment success`, 'success');
      setMainComment('');
      notificationTrigger('Comment', lowerParticipants, {
        dao,
        proposalid: id,
      });
      refetchComments();
    } catch (e) {
      byToast(`Comment failed ${e}`, 'error');
    }

    setPageLoading(false);
  };

  const userRemainedVP = useMemo(() => {
    if (!voterRmValue || !vpPerAddress || !isMember) return 0;

    const usedVp = caver.utils.convertFromPeb(voterRmValue.toString(), 'KLAY');
    const maxVpPerAddress = caver.utils.convertFromPeb(vpPerAddress, 'KLAY');

    return (Number(maxVpPerAddress) - Number(usedVp)).toLocaleString('ko-KR');
  }, [voterRmValue, vpPerAddress, isMember, caver.utils]);

  const isVotable = useMemo(() => {
    if (!proposal || isMemberLoading) return { votable: false, msg: '' };

    if (
      (parseInt(proposal.acceptedPowers, 10) >= parseInt(finalVp, 10) &&
        parseInt(mvn, 10) <= participants.length) ||
      proposal.status === PROPOSAL_STATUS.FINISHED
    )
      return { votable: false, msg: '종료된 Proposal 입니다.' };

    if (!isMember) return { votable: false, msg: 'DAO 회원이 아닙니다.' };

    const usedVp = caver.utils.convertFromPeb(voterRmValue.toString(), 'KLAY');
    const maxVpPerAddress = caver.utils.convertFromPeb(vpPerAddress, 'KLAY');
    const minVpPerOnce = caver.utils.convertFromPeb(minVp.toString(), 'KLAY');

    if (Number(maxVpPerAddress) - Number(usedVp) < Number(minVpPerOnce))
      return {
        votable: false,
        msg: '투표할 수 있는 VP를 모두 사용했습니다.',
      };

    if (Number(userInfo.balance) < Number(minVpPerOnce))
      return { votable: false, msg: 'DAO 토큰이 부족합니다.' };

    return { votable: true, msg: '' };
  }, [
    proposal,
    isMemberLoading,
    finalVp,
    mvn,
    participants.length,
    isMember,
    caver.utils,
    voterRmValue,
    vpPerAddress,
    minVp,
    userInfo.balance,
  ]);

  return {
    participants,
    accepters,
    rejecters,
    commentList,
    acceptPercent,
    rejectPercent,
    finalVp,

    isVotingModalOpen,
    votingModalOpen,
    closeVotingModal,
    votingComment,
    handleVotingComment,
    proposalInfo,
    modalType,
    votingLoading,
    handleVoting,
    proposalCreater,

    isVoterModalOpen,
    openVoterModal,
    closeVoterModal,

    pageLoading,
    applyMainComment,
    mainComment,
    inputMainComment,
    mvn,
    isVotable,
    userRemainedVP,
    isEnabledComment,
    isEnabledPublicComment,
  };
}
