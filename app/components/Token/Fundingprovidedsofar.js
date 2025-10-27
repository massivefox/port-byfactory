import React from 'react';

import PropTypes from 'prop-types';

import { formatBalance } from 'utils/number';
// import { DetailItem } from '../Section/DetailItem';

import './FundingProgressSoFar.css';
import { Button, Card, Divider, Header } from 'semantic-ui-react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import DetailItem from '../Section/DetailItem';
import { TpCard } from '../Card';
import { ByOutlineButton2 } from '../Button/BiyardButton';

const Color = {
  RED: 'Number--Red',
};

const DetailsVisibility = {
  OVERVIEW: 'FundingProgressTotal--Overview',
  FULL: 'FundingProgressTotal--Full',
};

const MAX_TAGS = 5;

const SubHeader = styled(Header)`
  padding-bottom: 13px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
  margin: 0 0 20px !important;
  color: #000000 !important;
  span {
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;

    color: #00c564;
  }
`;

const ProposalCard = styled(TpCard)`
  .content {
    border-top: 0 !important;
  }
`;

const ProposalsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;

  > div {
    flex: 1;
  }
`;

export default function FundingSoFar({ title, proposalData }) {
  const { daoname } = useParams();
  const navigate = useNavigate();
  const { total, active, finished } = proposalData;
  const latestActive = active.length >= 5 ? active.slice(0, 5) : active;
  const latestFinshed = finished.length >= 5 ? finished.slice(0, 5) : finished;

  return (
    <div className={` ${DetailsVisibility.OVERVIEW}`}>
      <ProposalCard fluid>
        <Card.Content className="FundingHeaders">
          <Header>{title}</Header>
          <Divider />
          <SubHeader className="FundingProgressSoFar__Header">
            <span>{total}</span> Proposals
          </SubHeader>
        </Card.Content>
        <Card.Content className="GrantList__Content">
          <ProposalsWrapper>
            <div>
              <SubHeader> {active.length} ACTIVE PROPOSALS</SubHeader>
              <div className="ItemList">
                {latestActive.length > 0 &&
                  latestActive.map((p, index) => (
                    <DetailItem
                      key={[p.title, index].join('::')}
                      name={`[${p.category}] ${p.title}`}
                      value={p.votes > 0 && `${p.votes} votes`}
                    />
                  ))}
              </div>
            </div>
            <div>
              <SubHeader> {finished.length} FINSHED PROPOSALS</SubHeader>
              <div className="ItemList">
                {latestFinshed.length > 0 &&
                  latestFinshed.map((p, index) => (
                    <DetailItem
                      key={[p.title, index].join('::')}
                      name={`[${p.category}] ${p.title}`}
                      value={`${p.votes} votes`}
                      passed={p.passed}
                      description={p.description}
                    />
                  ))}
              </div>
            </div>
          </ProposalsWrapper>
          <Divider />
          <ByOutlineButton2
            fluid
            onClick={() => navigate(`/proposals/${daoname}`)}
          >
            View More
          </ByOutlineButton2>
        </Card.Content>
      </ProposalCard>
    </div>
  );
}

FundingSoFar.propTypes = {
  title: PropTypes.string.isRequired,
  proposalData: PropTypes.object,
};
