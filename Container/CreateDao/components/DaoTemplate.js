import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icon, Label, Segment } from 'semantic-ui-react';
import styled from 'styled-components';

import ProposalImg1 from 'images/handshake.png';
import ProposalImg2 from 'images/policy.png';
import ProposalImg3 from 'images/sbt.png';
import BankImg from 'images/bank.png';
import ProfileImg from 'images/nft_profile.png';
import StatsImg from 'images/statistics.png';
import InfoPopup from 'components/Helper/InfoPopup';

const communityInfo = {
  name: 'Proposal for community',
  desc: '투자, 딜, 제인 등 자유로운 안건을 제안하고 투표 할수 있습니다',
  img: ProposalImg1,
};

const policyInfo = {
  name: 'Proposal for policy',
  desc:
    'Proposal fee, Voting fee 등 DAO내 configuration 변경을 제안할 수 있습니다.',
  img: ProposalImg2,
};

const sbtInfo = {
  name: 'Proposal for SBT',
  desc: 'SBT',
  img: ProposalImg3,
};

const templateConfigList = [
  {
    name: 'Bank',
    desc: '리딤코드 발급, KLAY를 통한 DAO 토큰 구매 등을 사용할 수 있습니다.',
    img: BankImg,
  },
  {
    name: 'Profile',
    desc:
      '사용자가 보유하고 있는 NFT를 사용하여 프로필 설정 기능을 제공합니다.',
    img: ProfileImg,
  },
  {
    name: 'Statistics',
    desc: 'DAO내에서 발생한 트랜잭션 정보를 취합하여 필요한 정보를 제공합니다.',
    img: StatsImg,
  },
];

export const BySegments = styled(Segment.Group)`
  .segment {
    padding: 0.5em 1em !important;

    .detail .icon {
      color: #21ba45 !important;
    }
    .label {
      background: var(--biyard-bg) !important;
      color: rgba(255, 255, 255, 0.8) !important;
      box-shadow: rgba(0, 0, 0, 0.6) 0px 1px 3px, rgba(0, 0, 0, 0.8) 0px 1px 2px;
    }

    .label:hover {
      color: rgba(255, 255, 255, 1) !important;
    }

    .label > img {
      width: 30px !important;
      object-fit: cover;
      margin-right: 10px;
      padding: 4px;
    }
  }
`;

const ExtensionsLabel = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  .label {
    border: 1px solid #c0c0c0;
    border-radius: 12px !important;
    background-color: #ffffff !important;
    box-shadow: rgba(0, 0, 0, 0.6) 0px 1px 3px, rgba(0, 0, 0, 0.8) 0px 1px 2px;
    padding: 16px 14px !important;

    > .detail {
      background-color: #ffffff !important;
      margin-left: 0 !important;

      padding: 0 5px 0 0 !important;
    }
  }

  // .label:hover {
  //   color: var(--biyard-primary) !important;
  // }
`;

const VCTemplateLabels = ({
  isEnabledCommProposal,
  isEnabledConfigProposal,
  isEnabledSBTProposal,
}) => {
  const ext = [
    isEnabledCommProposal && communityInfo,
    isEnabledConfigProposal && policyInfo,
    isEnabledSBTProposal && sbtInfo,
    ...templateConfigList,
  ].filter(item => !!item);

  return (
    <ExtensionsLabel>
      {ext.map(item => (
        <Label as="a" image size="medium">
          {item.name}
          <Label.Detail>
            <InfoPopup content={item.desc} />
          </Label.Detail>
        </Label>
      ))}
    </ExtensionsLabel>
  );
};

VCTemplateLabels.propTypes = {
  style: PropTypes.object,
  isEnabledCommProposal: PropTypes.bool,
  isEnabledConfigProposal: PropTypes.bool,
  isEnabledSBTProposal: PropTypes.bool,
};

const VCTemplateAccordion = ({
  isEnabledCommProposal,
  isEnabledConfigProposal,
  isEnabledSBTProposal,
}) => (
  <VCTemplateLabels
    isEnabledCommProposal={isEnabledCommProposal}
    isEnabledConfigProposal={isEnabledConfigProposal}
    isEnabledSBTProposal={isEnabledSBTProposal}
  />
);

VCTemplateAccordion.propTypes = {
  title: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  isEnabledCommProposal: PropTypes.bool,
  isEnabledConfigProposal: PropTypes.bool,
  isEnabledSBTProposal: PropTypes.bool,
};

export { VCTemplateLabels, VCTemplateAccordion };
