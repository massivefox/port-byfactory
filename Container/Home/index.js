/**
 *
 * Home
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import {
  Card,
  Container,
  Dimmer,
  Dropdown,
  Grid,
  Icon,
  Label,
} from 'semantic-ui-react';
import { ByButton } from 'components/Button/BiyardButton';
import { BySearch } from 'components/SearchBox';
import wrap from 'components/BaseApp/wrap';
import { PageLoader } from 'components/Loader/PageLoader';
import { useViewModel } from './useViewModel';
import { DaoCard } from '../../components/Card';

const ButtonWrapper = styled.div`
  display: flex;

  gap: 1em !important;
  align-items: center;
  margin-bottom: 40px;

  .ui.input {
    width: 140px;
  }
`;

const PDropdown = styled(Dropdown)`
  width: 100px;
  margin-right: 20px !important;
  margin-top: 0 !important;
  height: 36px;
  text-align: center !important;
  padding: 7px !important;
  border-radius: 8px !important;
  border: 1px solid #c7c7c7;

  color: var(--biyard-text) !important;

  .menu {
    left: -20px !important;
    min-width: 100px !important;
    margin-top: 8px !important;
    background: var(--biyard-bg-secondary) !important;
  }

  .item {
    color: var(--biyard-text) !important;
    text-align: center !important;
  }
`;

const TopTools = styled.div`
  display: flex;
  justify-content: space-between;
`;

export function Home() {
  const {
    sortType,
    handleDaoClick,
    daoList,
    daoState,
    searchResults,
    searchValue,
    handleSearchChange,
    resultRenderer,
    sortDropdownClick,
  } = useViewModel();

  return (
    <>
      <PageLoader loading={daoState !== 'hasValue'} />
      <Container>
        <TopTools>
          <PDropdown text={sortType} inline>
            <Dropdown.Menu>
              <Dropdown.Item text="LATEST" onClick={sortDropdownClick} />
              <Dropdown.Item text="OLDEST" onClick={sortDropdownClick} />
            </Dropdown.Menu>
          </PDropdown>
          <div />

          <ButtonWrapper>
            <BySearch
              onSearchChange={handleSearchChange}
              noResultsMessage="Not found."
              resultRenderer={resultRenderer}
              results={searchResults}
              value={searchValue}
            />
            <Link to="/create/dao">
              <ByButton content="Create a DAO" />
            </Link>
          </ButtonWrapper>
        </TopTools>
        <Dimmer.Dimmable blurring as="span" dimmed={daoState === 'loading'}>
          <Grid doubling columns={3} stackable>
            {daoState === 'hasValue' &&
              daoList.map((data, index) => (
                <Grid.Column style={{ marginBottom: '1em' }} key={data.name}>
                  <DaoCard
                    link
                    fluid
                    onClick={() => handleDaoClick(data.name, index)}
                  >
                    <Card.Content>
                      <Label>VC DAO</Label>
                      <Card.Header>{data.name} DAO</Card.Header>
                    </Card.Content>
                    <Card.Content>
                      {data.members > 0 && (
                        <div>
                          <Icon name="user" />
                          {data.members} members
                        </div>
                      )}
                      {data.proposals > 0 && (
                        <div>
                          <Icon name="file alternate outline" />
                          {data.proposals} proposals
                        </div>
                      )}
                    </Card.Content>
                  </DaoCard>
                </Grid.Column>
              ))}
          </Grid>
        </Dimmer.Dimmable>
      </Container>
    </>
  );
}

Home.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  title: () => 'Home',
  description: () => '생성된 DAO 목록을 확인할 수 있습니다.',
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default wrap(mapStateToProps, mapDispatchToProps, Home);
