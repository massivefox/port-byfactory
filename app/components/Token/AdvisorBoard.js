import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Dimmer, Divider, Header, Loader } from 'semantic-ui-react';
import MemberCard from '../MemberCard';
import { TpCard } from '../Card/TransparencyCard';

const MembersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 43.7px;
`;

export const CardDimmable = styled(Dimmer.Dimmable)`
  &:not(body) {
    overflow: inherit !important;
  }
`;
export default function AdvisorBoard({
  title = 'DAO members',
  MemberCardData,
  loading = false,
}) {
  return (
    <TpCard fluid>
      <TpCard.Content>
        <Header>{title}</Header>
        <Divider />
        <CardDimmable dimmed={loading} blurring>
          <Dimmer inverted active={loading}>
            <Loader />
          </Dimmer>
          <MembersContainer>
            {MemberCardData &&
              MemberCardData.map((data, index) => (
                <MemberCard
                  key={[data.name, index].join('::')}
                  name={data.account}
                  imageSrc={data.profile}
                />
              ))}
          </MembersContainer>
        </CardDimmable>
      </TpCard.Content>
    </TpCard>
  );
}

AdvisorBoard.propTypes = {
  MemberCardData: PropTypes.array.isRequired,
  title: PropTypes.string,
  loading: PropTypes.bool,
};
