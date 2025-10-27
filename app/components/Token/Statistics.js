import React, { useState } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

import './FundingProgressSoFar.css';
import { Card, Divider, Grid, Header, Statistic } from 'semantic-ui-react';
import { TpCard } from '../Card/TransparencyCard';

export const StatisticsCard = styled(TpCard)``;

export const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px !important;

  background: #ffffff !important;
  border: 1px solid #ecedf4 !important;
  border-radius: 12px;

  label {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: -0.03em;
    color: #8E929B;

  }

  .stat-wrapper {
    margin-top: 7px;
    display: flex;
    gap: 7px;
    align-items: center;

    color: var(--biyard-header2);
    font-weight: 700;
  }

  .stat-value {
    font-size: 27px;
    line-height: 32px;

  }

  .stat-label {
    font-size: 21px;
    line-height: 25px;
  }
}
`;

const Color = {
  RED: 'Number--Red',
};

const DetailsVisibility = {
  OVERVIEW: 'FundingProgressTotal--Overview',
  FULL: 'FundingProgressTotal--Full',
};

const MAX_TAGS = 5;

const StatDataCard = ({ title, data, label }) => (
  <StatCard>
    <label>{title}</label>
    <div className="stat-wrapper">
      <div className="stat-value">{data}</div>
      <div className="stat-label">{label}</div>
    </div>
  </StatCard>
);

export default function Statistics({ title, statisticsData }) {
  const {
    transactions,
    proposals,
    proposers,
    votes,
    sbts,
    sbtAccounts,
  } = statisticsData;
  return (
    <div className={`FundingProvidedsoFar ${DetailsVisibility.OVERVIEW}`}>
      <StatisticsCard fluid>
        <Card.Content className="FundingHeaders">
          <Header>{title}</Header>
          <Divider />
          <Grid doubling columns={4} stackable>
            <Grid.Column>
              <StatDataCard
                title="Transactions"
                data={transactions}
                label="txs"
              />
            </Grid.Column>
            <Grid.Column>
              <StatDataCard
                title="Proposals"
                data={proposals}
                label="proposals"
              />
            </Grid.Column>
            <Grid.Column>
              <StatDataCard
                title="Proposers"
                data={proposers}
                label="members"
              />
            </Grid.Column>
            <Grid.Column>
              <StatDataCard title="Participation" data={votes} label="votes" />
            </Grid.Column>
            <Grid.Column>
              <StatDataCard title="SBTs" data={3} label="Tokens" />
            </Grid.Column>
            <Grid.Column>
              <StatDataCard
                title="SBT Total supply"
                data={sbts}
                label="items"
              />
            </Grid.Column>
            <Grid.Column>
              <StatDataCard
                title="SBT Holders"
                data={sbtAccounts}
                label="members"
              />
            </Grid.Column>
          </Grid>
        </Card.Content>
      </StatisticsCard>
    </div>
  );
}

Statistics.propTypes = {
  title: PropTypes.string.isRequired,
  statisticsData: PropTypes.object,
};
