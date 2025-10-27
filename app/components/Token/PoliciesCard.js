import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { Button, Dimmer, Divider, Header, Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import DetailItem from '../Section/DetailItem';

import './MonthlyTotal.css';
import { TpCard } from '../Card';
import { policiesTextInfo } from '../../utils/textUtil';

const Color = {
  RED: 'Number--Red',
  GREEN: 'Number--Green',
};

const DetailsVisibility = {
  OVERVIEW: 'MonthlyTotal--Overview',
  FULL: 'MonthlyTotal--Full',
};

const MAX_TAGS = 5;

const MoreButton = styled(Button)`
  background: #ffffff !important;
  border: 1px solid #b3b3b3 !important;
  ${props => props.less && `margin-bottom: 10px !important;`}
  border-radius: 8px !important;
`;

const EmptyData = styled.div`
  text-align: center;
  height: 100px;
  display: flex;
  align-items: center !important;
  justify-content: center;
  font-weight: 700;
  font-size: 17px;
  line-height: 20px;

  color: #b3b3b3;
`;

const PolicyCard = styled(TpCard)`
  button {
    border-radius: 8px !important;
    width: 100% !important;
  }
  .list {
    border-top: none !important;
    padding-top: 0 !important;
  }
`;

export const CardDimmable = styled(Dimmer.Dimmable)`
  &:not(body) {
    overflow: inherit !important;
  }
`;

export default function PoliciesCard({ title, policies, loading = false }) {
  const [detailsVisibility, setDetailsVisibility] = useState(
    DetailsVisibility.OVERVIEW,
  );

  const handleButtonClick = () => {
    if (detailsVisibility === DetailsVisibility.OVERVIEW) {
      setDetailsVisibility(DetailsVisibility.FULL);
    } else {
      setDetailsVisibility(DetailsVisibility.OVERVIEW);
    }
  };

  return (
    <div className={`MonthlyTotal ${detailsVisibility}`}>
      <PolicyCard fluid>
        <TpCard.Content>
          <Header>{title}</Header>
          <Divider />
        </TpCard.Content>
        <TpCard.Content className={`${detailsVisibility} list`}>
          <CardDimmable dimmed={loading} blurring>
            <Dimmer inverted active={loading}>
              <Loader />
            </Dimmer>
            <div>
              {policies.length === 0 && <EmptyData>Not exist</EmptyData>}
              {policies.map(policy => {
                if (policy) {
                  return (
                    <DetailItem
                      key={`${policy[0]}`}
                      name={policiesTextInfo[policy[0]].name}
                      desc={policiesTextInfo[policy[0]].desc}
                      value={
                        policiesTextInfo[policy[0]].realNumber
                          ? policy[1]
                          : window.caver.utils.convertFromPeb(policy[1], 'KLAY')
                      }
                    />
                  );
                }
                return <></>;
              })}
            </div>
          </CardDimmable>
        </TpCard.Content>
        <div>
          {policies.length > MAX_TAGS && (
            <MoreButton
              fluid
              onClick={handleButtonClick}
              less={detailsVisibility === DetailsVisibility.OVERVIEW && 'true'}
            >
              {detailsVisibility === DetailsVisibility.OVERVIEW
                ? 'more'
                : 'less'}
            </MoreButton>
          )}
        </div>
      </PolicyCard>
    </div>
  );
}

PoliciesCard.propTypes = {
  title: PropTypes.string.isRequired,
  policies: PropTypes.array,
  loading: PropTypes.bool,
};
