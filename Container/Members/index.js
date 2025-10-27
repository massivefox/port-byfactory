import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import _ from 'lodash';

import {
  Label,
  Transition,
  Table,
  Image,
  Header,
  Divider,
} from 'semantic-ui-react';

import wrap from 'components/BaseApp/wrap';

import { PageLoader } from 'components/Loader/PageLoader';
import { ByContainer } from 'components/Container';
import { useViewModel } from './useViewModel';

const MembersTable = styled(Table)`
  border: none !important;
  thead {
    background-color: #fafbff !important;
    * {
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;

      color: #7b7b7b !important;
    }
    th {
      padding: 20px 0.78571429em !important;
    }
  }
  tr.visible.transition {
    display: table-row !important;
  }

  tbody td {
    font-weight: 500;
    font-size: 12px;
    color: #8e929b !important;
    padding: 14px 0.78571429em !important;
  }
`;

const TabelCellWrapper = styled.div`
  display: flex;
  min-width: 24px;
  align-items: center;
`;

const OwnerLabel = styled(Label)`
  padding: 10px !important;
  margin-left: 8px !important;
  color: var(--biyard-button) !important;
  border: 1px solid var(--biyard-button) !important;
  border-radius: 60px !important;
  background: #ffffff !important;
`;

const ActivitiesLabel = styled(Label)`
  background: none !important;
  border: none !important;
  color: #8e929b !important;
  .i {
    margin-right: 5px;
  }
`;

const ProfileImage = styled.div`
  with: 24px;
  height: 24px;
`;

const TitleDivider = styled(Divider)`
  margin: 10px 0px 33px !important;
`;

function Members() {
  const { members, loading } = useViewModel();
  console.log(members);
  return (
    <>
      <ByContainer>
        <Header>Members</Header>
        <TitleDivider />
        <MembersTable basic>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Profile</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>Activities</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Transition.Group as={Table.Body} duration={{ hide: 0, show: 500 }}>
            {members.map((item, i) => (
              <Table.Row key={item.address}>
                <Table.Cell>
                  <TabelCellWrapper>
                    <ProfileImage>
                      <Image
                        circular
                        src={item.profile}
                        width="24"
                        height="24"
                      />
                    </ProfileImage>
                    {item.isOwner && <OwnerLabel>DAO Owner</OwnerLabel>}
                  </TabelCellWrapper>
                </Table.Cell>
                <Table.Cell>{item.address}</Table.Cell>
                <Table.Cell>
                  {item.activities?.length > 0 ? (
                    item.activities?.map(sbt => (
                      <ActivitiesLabel key={`${item.address}-${sbt.name}`}>
                        {sbt.name}
                        <Label.Detail>{sbt.value}</Label.Detail>
                      </ActivitiesLabel>
                    ))
                  ) : (
                    <>-</>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Transition.Group>
        </MembersTable>
      </ByContainer>
    </>
  );
}

Members.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  title: () => 'Members',
  description: () => 'DAO에 참여한 멤버를 확인할 수 있습니다.',
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default wrap(mapStateToProps, mapDispatchToProps, Members);
