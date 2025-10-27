import ProposalSBTImg from 'images/proposal_sbt_img.png';
import VotingSBTImg from 'images/voting_sbt_img.png';
import DiscussionSBTImg from 'images/discussion_sbt_img.png';

export const activitiesData = [
  { name: 'proposal', label: '프로포절 제출', isActive: true, enable: true },
  { name: 'voting', label: '투표', isActive: true, enable: true },
  { name: 'discussion', label: '댓글 작성', isActive: true, enable: true },
  { name: 'buyToken', label: 'DAO 토큰 구매', isActive: true, enable: true },
  { name: 'invite', label: '멤버 초대', isActive: true, enable: true },
];

export const rewardOptionTypes = { ACTIVATION: 'activaction', COUNT: 'count' };

export const rewardsData = {
  proposal: {
    name: 'proposal',
    label: '프로포절',
    description: '프로포절 제출시 reward 조건을 설정합니다.',
    defaultSbt: ProposalSBTImg,
    isActive: true,
    activateCondition: [
      {
        type: rewardOptionTypes.ACTIVATION,
        isActive: true,
        label: '프로조절 승인시 reward 발급',
      },
      {
        type: rewardOptionTypes.COUNT,
        activityCountForReward: 1,
        rewardCount: 1,
      },
    ],
    isRevertActive: false,
  },
  voting: {
    name: 'voting',
    label: '투표',
    description: '투표 reward 조건을 설정합니다.',
    defaultSbt: VotingSBTImg,
    isActive: true,
    activateCondition: [
      {
        type: rewardOptionTypes.ACTIVATION,
        isActive: true,
        label: '프로조절 승인시 reward 발급',
      },
      {
        type: rewardOptionTypes.COUNT,
        activityCountForReward: 1,
        rewardCount: 1,
      },
    ],
    isRevertActive: false,
  },
  discussion: {
    name: 'discussion',
    label: '댓글',
    description: '댓글의 reward 조건을 설정합니다.',
    defaultSbt: DiscussionSBTImg,
    isActive: true,
    activateCondition: [
      {
        type: rewardOptionTypes.ACTIVATION,
        isActive: true,
        label: '프로조절 승인시 reward 발급',
      },
      {
        type: rewardOptionTypes.COUNT,
        activityCountForReward: 1,
        rewardCount: 1,
      },
    ],
    isRevertActive: false,
  },
};

export const permissionData = [
  {
    name: 'proposal',
    member: {
      write: true,
      read: true,
    },
    publicUser: {
      write: false,
      read: true,
    },
  },
  {
    name: 'voting',
    member: {
      write: true,
      read: true,
    },
    publicUser: {
      write: false,
      read: true,
    },
  },
  {
    name: 'discussion',
    member: {
      write: true,
      read: true,
    },
    publicUser: {
      write: true,
      read: true,
    },
  },
];
