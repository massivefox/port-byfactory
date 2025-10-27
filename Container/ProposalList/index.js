/**
 *
 * Home
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Link, useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';
import { Container, Dropdown, Grid } from 'semantic-ui-react';
import Filter from 'components/Filter';
import { ByButton } from 'components/Button/BiyardButton';

import wrap from 'components/BaseApp/wrap';
import { CardList } from 'components/Card';
import { PageLoader } from 'components/Loader/PageLoader';

import saga from './saga';
import reducer from './reducer';

import { useViewModel } from './useViewModel';

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 109px;
`;

const ContentWrapper = styled.div`
  display: flex !important;
`;
const SubmitButton = styled(ByButton)``;

const PDropdown = styled(Dropdown)`
  width: 100px;
  margin-right: 10px !important;
  margin-top: 0 !important;
  height: 36px;
  text-align: center !important;
  padding: 7px !important;
  border-radius: 8px !important;
  border: 1px solid #c7c7c7;
  background: var(--biyard-bg-secondary) !important;
  color: #c7c7c7 !important;

  .menu {
    left: -20px !important;
    min-width: 100px !important;
    margin-top: 8px !important;
    margin-left: 20px !important;
  }

  .item {
    color: var(--biyard-text) !important;
    text-align: center !important;
  }
`;
const FilterOutcome = styled(Link)`
  padding: 0px 8px 0px 8px;
  border-right: #000000 solid 1px;
  color: #c7c7c7;
`;
const FilterSelect = styled(FilterOutcome)`
  color: #00c564;
`;
function ProposalList() {
  useInjectReducer({ key: 'home', reducer });
  useInjectSaga({ key: 'home', saga });
  const { search } = useLocation();
  const { daoname } = useParams();
  const qs = queryString.parse(search);
  const statusFilter = [
    ['All outcomes', `/proposals/${daoname}?status=ALL`, 'ALL'],
    ['Active outcomes', `/proposals/${daoname}?status=ACTIVE`, 'ACTIVE'],
    ['Finished outcomes', `/proposals/${daoname}?status=FINISHED`, 'FINISHED'],
  ];

  const {
    sortType,
    userInfo,
    isLoading,
    filtedProposals,
    sortDropdownClick,
  } = useViewModel(daoname, qs);

  return (
    <>
      <PageLoader loading={isLoading} />
      <Container style={{ width: '80%' }}>
        <ButtonWrapper>
          <div
            style={{
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
            }}
          >
            <PDropdown text={sortType} inline>
              <Dropdown.Menu>
                <Dropdown.Item text="LATEST" onClick={sortDropdownClick} />
                <Dropdown.Item text="OLDEST" onClick={sortDropdownClick} />
              </Dropdown.Menu>
            </PDropdown>
            <Grid.Row tablet={3}>
              {statusFilter.map(i =>
                i[2] === qs.status ? (
                  <FilterSelect to={i[1]}>{i[0]}</FilterSelect>
                ) : (
                  <FilterOutcome to={i[1]}>{i[0]}</FilterOutcome>
                ),
              )}
            </Grid.Row>
          </div>
          <div>
            {userInfo.isMember && (
              <Link to={`/proposal/${daoname}`}>
                <SubmitButton>Submit Proposal</SubmitButton>
              </Link>
            )}
          </div>
        </ButtonWrapper>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column>
              {!isLoading ? (
                <ContentWrapper>
                  <CardList
                    items={filtedProposals}
                    fluid
                    dao={daoname}
                    loading={isLoading}
                  />
                </ContentWrapper>
              ) : (
                <></>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </>
  );
}

ProposalList.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // home: makeSelectHome(),
  title: () => 'Proposals',
  description: () => '현재 제출된 제안들을 확인할 수 있습니다.',
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default wrap(mapStateToProps, mapDispatchToProps, ProposalList);
