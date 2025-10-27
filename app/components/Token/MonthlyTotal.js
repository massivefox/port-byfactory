import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { formatBalance } from 'utils/number';
import { Button, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import DetailItem from '../Section/DetailItem';

import './MonthlyTotal.css';
import { TpCard } from 'components/Card';

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
  border-left: 1px solid white !important;
  border-right: 1px solid white !important;
  background-color: var(--biyard-dark) !important;
  ${props => props.less && `margin-bottom: 10px !important;`}
`;

export default function MonthlyTotal({
  title,
  monthlyTotal,
  invertDiffColors = false,
}) {
  const [belowZeroColor, zeroOrOverColor] = invertDiffColors
    ? [Color.GREEN, Color.RED]
    : [Color.RED, Color.GREEN];
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
      <TpCard style={{ border: '1px solid white' }}>
        <TpCard.Content className="MonthlyTotal_Headers">
          <div>
            <div className="ui header MonthlyTotal__Header">{title}</div>
            <div className="ui huge header MonthlyTotal__Header">
              ${formatBalance(monthlyTotal.total)}
              <div size="ui header small">USD</div>
            </div>
            <div className="ui sub header MonthlyTotal__Sub">
              <strong
                className={`Number ${
                  monthlyTotal.previous < 0 ? belowZeroColor : zeroOrOverColor
                }`}
              >
                {`${formatBalance(monthlyTotal.previous)}% `}
              </strong>
              vs previous 30 days
            </div>
          </div>
        </TpCard.Content>
        <div className={`content ${detailsVisibility}`}>
          <div className="ItemsList">
            {monthlyTotal.detail &&
              monthlyTotal.detail.map((detail, index) => (
                <DetailItem
                  key={[detail.name, index].join('::')}
                  name={detail.name}
                  value={`$${formatBalance(detail.value)}`}
                  description={detail.description}
                />
              ))}
          </div>
        </div>
        {monthlyTotal.detail.length > MAX_TAGS && (
          <MoreButton
            onClick={handleButtonClick}
            less={detailsVisibility === DetailsVisibility.OVERVIEW && 'true'}
          >
            {detailsVisibility === DetailsVisibility.OVERVIEW ? 'more' : 'less'}
          </MoreButton>
        )}
      </TpCard>
    </div>
  );
}

MonthlyTotal.propTypes = {
  title: PropTypes.string.isRequired,
  monthlyTotal: PropTypes.object,
  invertDiffColors: PropTypes.bool,
};
