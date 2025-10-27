/**
 *
 * Transparency
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { createStructuredSelector } from 'reselect';

import TokenBalanceCard from 'components/Token/TokenBalanceCard';
// import MonthlyTotal from 'components/Token/MonthlyTotal';
import FundingSoFar from 'components/Token/Fundingprovidedsofar';
import AdvisorBoard from 'components/Token/AdvisorBoard';
import { Card, Container, Dimmer, Divider, Loader } from 'semantic-ui-react';
import KlayIcon from 'images/icons/klaytn-klay-logo.svg';
import './transparency.css';
import wrap from 'components/BaseApp/wrap';
import PoliciesCard from 'components/Token/PoliciesCard';
import Statistics from 'components/Token/Statistics';
import { TpCard } from 'components/Card';
import styled from 'styled-components';
import { useViewModel } from './useViewModel';
import makeSelectTransparency from './selectors';
import { PageHaeder } from '../../components/Header';

const tokenIcon =
  'https://cdn.decentraland.org/@dcl/account-site/3.0.2/static/media/mana-red-logo.9a5f9e65.svg';

const Wrapper = styled.div`
  flex-direction: column;
`;

export const Description = styled.div`
  margin: 10px auto 30px;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.03em;

  color: #7a7c85;
`;

export const TpDimmable = styled(Dimmer.Dimmable)`
  &:not(body) {
    overflow: inherit !important;
  }
`;

function TransparencyPage() {
  const {
    klayBalance,
    daoMembers,
    balanceData,
    policies,
    proposedPolicies,
    statisticsData,
    detailProposals,
    balanceLoading,
    memberLoading,
    policiesLoading,
  } = useViewModel();

  return (
    <Wrapper>
      <Container style={{ padding: '40px' }}>
        <PageHaeder>Transparency</PageHaeder>
      </Container>
      <Container>
        <div className="TransparencySection">
          <TpCard fluid>
            <Card.Content>
              <Card.Header>Balance</Card.Header>
              <Divider />
              <TpDimmable dimmed={balanceLoading} blurring>
                <Dimmer inverted active={balanceLoading}>
                  <Loader />
                </Dimmer>
                <div className="TokenContainer">
                  {balanceData.totalSupply && (
                    <TokenBalanceCard
                      tokenBalance={balanceData.totalSupply}
                      imageSrc={tokenIcon}
                    />
                  )}
                  {balanceData.balance && (
                    <TokenBalanceCard
                      tokenBalance={balanceData.balance}
                      imageSrc={tokenIcon}
                    />
                  )}
                  <TokenBalanceCard
                    tokenBalance={klayBalance}
                    imageSrc={KlayIcon}
                  />
                </div>
              </TpDimmable>
            </Card.Content>
          </TpCard>
        </div>

        <AdvisorBoard MemberCardData={daoMembers} loading={memberLoading} />

        {/* FundingProgress */}
        <div className="FundingProgress">
          <FundingSoFar
            title="Funding provided"
            proposalData={detailProposals}
          />
        </div>
        <div className="FundingProgress">
          <Statistics title="Statistics" statisticsData={statisticsData} />
        </div>

        <PoliciesCard
          title="DAO policies"
          policies={policies.data}
          loading={policiesLoading}
        />

        <PoliciesCard
          title="Proposed policies"
          policies={proposedPolicies.data}
          loading={policiesLoading}
        />
      </Container>
    </Wrapper>
  );
}

TransparencyPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  transparency: makeSelectTransparency(),
  title: () => 'Transparency',
  description: () =>
    '투명성(Transparency)은 DAO의 모든 트랜잭션 정보나 속성값들을 투명하게 공개합니다.',
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default wrap(mapStateToProps, mapDispatchToProps, TransparencyPage);
