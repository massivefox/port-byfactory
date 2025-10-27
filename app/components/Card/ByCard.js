/**
 *
 * Card
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Container, Header, Card, Icon, Image } from 'semantic-ui-react';
import qs from 'query-string';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { PROPOSAL_STATUS, PROPOSAL_PASS } from '../../utils/constants';
import { PassedLabel, StatusLabel, TypeLabel } from '../Label';
import voterIcon from '../../images/icons/voter.svg';
const ByCard = styled(Card)`
  background-color: #ffffff !important;
  box-shadow: none !important;
  border: 1px solid #e7e8e8 !important;
  border-radius: 16px !important;
  height: 163px;

  > :first-child {
    padding-bottom: 5px !important;
  }

  .header {
    color: #000000;
    font-size: 24px !important;
    font-weight: 500 !important;
    padding-left: 21px;
  }

  .meta {
    color: ##8e929b !important;
    margin-top: 5px;
  }

  &:hover {
    background-color: #d9ffef !important;
  }
  .content p {
    color: #000000;
  }

  .mini.image {
    width: 30px !important;
    height: 30px;
    object-fit: cover;
    border-radius: 15px !important;
  }

  .reply {
    color: white;
    font-weight: 500;
  }
  .reply i {
    margin-left: 8px;
  }
  .voters {
    font-weight: 700;
    margin-left: 1em !important;
    font-size: 25px;
    color: #999596 !important;
    margin-bottom: 0px !important;
  }
  .voters span {
    font-weight: 400;
    font-size: 14px;
    margin-left: 0px;
    color: #999596;
  }

  .activity-info {
    display: flex;
    right: 1em;
    align-items: center;
  }

  .event > .content .date {
    color: rgba(255, 255, 255, 0.7) !important;
  }
  .event > .content .summary {
    color: #ffffff !important;
  }
`;

const CardStatus = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0px 0px 8px 20px;
`;
const VoteCount = styled(CardStatus)`
  margin-left: 0px !important;
  width: 45%;
`;
export function CardList({ items, fluid, dao, loading }) {
  if (!loading && items.length === 0) {
    return (
      <Container textAlign="center">
        <Header as="h2" color="grey" content="Proposal not exist" />
      </Container>
    );
  }

  return (
    <Card.Group style={{ width: '100%' }}>
      {items.map(
        ({
          id,
          uuid,
          category,
          title,
          status,
          votes,
          passed,
          type,
          comments,
          proposer,

          proposerImg,
          timestamp,
        }) => {
          let query = '';
          if (type > 0) {
            query = qs.stringify({ type: 'config' });
          }
          const created = format(
            new Date(timestamp * 1000),
            'yyyy/MM/dd HH:mm',
          );

          return (
            <ByCard link fluid={fluid} key={`proposal-${uuid}`}>
              <Card.Content
                as={Link}
                to={`/proposal/${dao}/${id || uuid}?${query}`}
              >
                <CardStatus>
                  <div>
                    <StatusLabel status={status}>{status}</StatusLabel>
                    {status === PROPOSAL_STATUS.FINISHED && (
                      <PassedLabel passed={passed}>
                        {passed === PROPOSAL_PASS.PASSED && (
                          <Icon name="check" color="green" />
                        )}
                        {passed}
                      </PassedLabel>
                    )}
                    <TypeLabel content={category} type={category} />
                  </div>
                  <Card.Meta>{created}</Card.Meta>
                </CardStatus>
                <Card.Header
                  style={{ paddingTop: '10px' }}
                >{`[${category}] ${title}`}</Card.Header>
              </Card.Content>
              <Card.Content
                as={Link}
                to={`/proposal/${dao}/${id || uuid}?${query}`}
                style={{
                  borderTop: '0px #ffffff ',
                  paddingBottom: '7px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <VoteCount>
                  <div className="activity-info">
                    {votes > 0 && (
                      <p className="voters">
                        <img
                          src={voterIcon}
                          alt="voter"
                          style={{ marginRight: '5px' }}
                        />
                        {votes} <span>VOTES </span>
                      </p>
                    )}
                  </div>
                </VoteCount>
                <VoteCount style={{ justifyContent: 'end' }}>
                  <div className="activity-info">
                    {comments > 0 && (
                      <p className="reply">
                        {comments}
                        <Icon name={comments === 1 ? 'comments' : 'comments'} />
                      </p>
                    )}
                  </div>
                </VoteCount>
              </Card.Content>
            </ByCard>
          );
        },
      )}
    </Card.Group>
  );
}

CardList.propTypes = {
  items: PropTypes.array.isRequired,
  dao: PropTypes.string.isRequired,
  fluid: PropTypes.bool,
  loading: PropTypes.bool,
};
