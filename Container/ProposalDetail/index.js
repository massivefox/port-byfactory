/**
 *
 * ProposalDetail
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import queryString from 'query-string';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import {
  Comment,
  Divider,
  Form,
  Header,
  Icon,
  Label,
  Placeholder,
  Progress,
} from 'semantic-ui-react';
import { format } from 'date-fns';
import DefaultProfile from 'images/default_profile.png';
import 'swiper/swiper.min.css';
import 'swiper/modules/pagination/pagination.min.css';

import './style.css';
import {
  BiyardButton,
  ByButton,
  ByInvertedButton,
} from 'components/Button/BiyardButton';
import wrap from 'components/BaseApp/wrap';
import { ByContainer } from 'components/Container';
import { ByForm } from 'components/Form';
import { convertTag, cropMiddleText } from 'utils/textUtil';
import { PageLoader } from 'components/Loader/PageLoader';
import { PassedLabel, StatusLabel, TypeLabel } from 'components/Label';
import { PROPOSAL_PASS, PROPOSAL_STATUS } from 'utils/constants';
import { accountFinderLink } from 'utils/externalLink';
import saga from './saga';
import reducer from './reducer';
import makeSelectProposalDetail from './selectors';
import { VoteConfirmModal } from './components/VoteModal';
import { VoterModal } from './components/VoterModal';
import { useViewModel } from './useViewModel';
import { ContainerHeader } from '../../components/Header';
const ProgressBar = styled(Progress)`
  margin-bottom: 0 !important;
  .bar {
    height: 10px !important;
  }
`;

const ByComments = styled(Comment)`
  background: none !important;

  .content {
    // padding: 10px 10px 1px !important;
    // background-color: rgb(8, 34, 53) !important;
  }

  .text {
    font-size: 14px !important;
  }
  .metadata {
    // color: rgba(255, 255, 255, 0.4) !important;
  }
`;

const CommentForm = styled(Form)`
  margin-top: 24px !important;
  .field {
    margin-bottom: 0.3em !important;
  }

  textarea {
    font-weight: 500;
    font-size: 16px !important;
    line-height: 19px;

    background: #f5f6f9 !important;
    border: 1px solid #ecedf4 !important;
    border-radius: 12px !important;
  }

  textarea::placeholder {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;

    color: #c5cdd2;
  }
`;

const CommentLengthInfo = styled.div`
  text-align: right;
  margin-bottom: 30px;
  color: rgb(154, 162, 170) !important;
`;

const HeaderMsg = styled.div`
  margin-top: 2px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;

  color: #ff0000;
`;

const ByPlaceHolder = styled(Placeholder)``;

const LabelWrapper = styled.div`
  display: flex;
  margin: 12px 0;
`;

const ContentDivider = styled(Divider)`
  margin: 20px 0 !important;
`;

const ContentBody = styled.div`
  margin: 24px 7px;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  align-items: center;

  > label {
    flex: 1;
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: var(--biyard-header2);
  }

  > .content {
    flex: 7;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;

    color: #7a7c85;

    .files {
      display: flex;
      gap: 20px;
    }
  }
`;

const DetailContent = styled.div`
  .title {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: var(--biyard-header2);
  }

  .sub-wrapper {
    margin: 14px 0px;

    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    align-items: center;

    > label {
      flex: 1;
      min-width: 80px;
      font-weight: 700;
      font-size: 15px;
      line-height: 18px;
      color: var(--biyard-header2);
    }

    > .content {
      flex: 7;
      font-size: 14px;
      line-height: 17px;
      color: #7a7c85;

      img {
        width: 24px;
        height: 24px;
        margin-right: 12px;
      }
    }
  }
`;

const VotingContent = styled.div`
  .result-wrapper {
    text-transform: uppercase;
    margin-bottom: 14px;

    .result-title {
      font-weight: 700;
      font-size: 18px;
      line-height: 22px;
      color: var(--biyard-header2);
    }

    .voters-link {
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      color: var(--biyard-primary);
      margin-left: 14px;
      cursor: pointer;
      &:hover {
        font-weight: 700;
      }
    }
  }

  .vote-wrapper {
    display: flex;
    // flex-wrap: wrap;
    align-items: baseline;
    justifiy-content: flex-start;
    gap: 14px;
    margin-bottom: 20px;

    label {
      width: 80px;
      font-weight: 700;
      font-size: 16px;
      line-height: 19px;
      letter-spacing: -0.03em;
      color: #7e8088;
    }

    .vote-status {
      width: 60%;
    }

    .vote-percent {
      display: flex;
      align-items: center;
      gap: 19px;

      .progress {
        width: 82%;
      }

      .value-text {
        text-align: center;
        width: 72px;

        font-size: 14px;
        line-height: 17px;
        background: #f6f6f9;
        border-radius: 8px;
        padding: 6px 8px;

        .range {
          font-weight: 700;
          font-size: 18px;
          color: var(--biyard-button);
        }
      }
    }

    .vote-vp {
      font-weight: 700;
      font-size: 18px;
      line-height: 22px;
      color: #999596;
    }

    button {
      min-width: 104px;
    }

    .vote-no {
      background: #696969 !important;
    }
  }
`;

const VPContent = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 15px;
  line-height: 18px;
  color: #00c564;
  span {
    margin-right: 12px;
  }
`;

const CommentContent = styled.div`
  .title {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: var(--biyard-header2);
    // margin-bottom: 18px;
  }
`;

export function ProposalDetail() {
  useInjectReducer({ key: 'proposalDetail', reducer });
  useInjectSaga({ key: 'proposalDetail', saga });
  const { id, daoname } = useParams();
  const navigate = useNavigate();

  const { search } = useLocation();

  const qs = queryString.parse(search);

  const {
    isVotingModalOpen,
    votingModalOpen,
    closeVotingModal,
    handleVotingComment,
    acceptPercent,
    rejectPercent,
    votingComment,
    participants,
    accepters,
    rejecters,
    finalVp,
    modalType,
    votingLoading,
    proposalInfo: proposal,
    commentList,
    handleVoting,
    proposalCreater,
    isVoterModalOpen,
    openVoterModal,
    closeVoterModal,
    mainComment,
    pageLoading,
    inputMainComment,
    applyMainComment,
    isVotable,
  } = useViewModel(id, qs.type);
  return (
    <>
      <PageLoader loading={pageLoading || !proposal} />

      <ByContainer>
        <LabelWrapper>
          {proposal && (
            <>
              <StatusLabel
                size="small"
                status={proposal.status}
                content={proposal.status}
              />

              {proposal.status === PROPOSAL_STATUS.FINISHED && (
                <PassedLabel passed={proposal.passed} size="small">
                  {proposal.passed === PROPOSAL_PASS.PASSED && (
                    <Icon name="check" color="green" />
                  )}
                  {proposal.passed}
                </PassedLabel>
              )}
              <TypeLabel
                size="small"
                content={proposal.category}
                type={proposal.category}
              />
            </>
          )}
        </LabelWrapper>
        <ContainerHeader>
          {proposal ? (
            <>
              <Header as="h2">
                [{proposal.category}] {proposal.title}
              </Header>
            </>
          ) : (
            <Placeholder fluid>
              <Placeholder.Header>
                <Placeholder.Line />
              </Placeholder.Header>
            </Placeholder>
          )}
        </ContainerHeader>

        <ContentDivider />
        <ContentBody style={{ alignItems: 'baseline' }}>
          <label>제안내용</label>
          <div className="content">
            {proposal ? (
              <>
                {convertTag(proposal.description)}
                {proposal.proposalType === '1' && (
                  <>
                    <Header
                      as="h3"
                      content="변경 제안된 정책 "
                      style={{ margin: '4rem 0 1.5rem 0' }}
                    />
                    <ByForm>
                      <Form.Group widths="equal">
                        <Form.Input
                          fluid
                          label={proposal.policyName}
                          value={proposal.policyValue}
                          readOnly
                        />
                      </Form.Group>
                    </ByForm>
                  </>
                )}
              </>
            ) : (
              <ByPlaceHolder fluid>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Paragraph>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Paragraph>
              </ByPlaceHolder>
            )}
          </div>
        </ContentBody>
        {proposal?.proposalType === 0 && proposal?.files.length > 0 && (
          <ContentBody>
            <>
              <label>참고자료</label>
              <div className="content">
                <div className="files">
                  {proposal.files.map(el => (
                    <a href={el.url} target="_blank" rel="noopener noreferrer">
                      {el.name}
                    </a>
                  ))}
                </div>
              </div>
            </>
          </ContentBody>
        )}

        <ContentDivider />
        <VotingContent>
          <div className="result-wrapper">
            <div className="result-title">
              Current result
              {participants.length > 0 && (
                <span className="voters-link" onClick={openVoterModal}>
                  see vote
                </span>
              )}
            </div>
          </div>
          <div className="vote-wrapper">
            <label>YES</label>
            <div className="vote-status">
              <div className="vote-percent">
                <ProgressBar percent={acceptPercent} success />
                <div className="value-text">
                  <span className="range">{acceptPercent} </span>%
                </div>
              </div>

              <span className="vote-vp">
                {proposal?.acceptedPowers || 0} VP ({accepters?.length} /{' '}
                {finalVp} votes)
              </span>
            </div>
            <ByButton
              value="YES"
              onClick={votingModalOpen}
              disabled={!isVotable.votable}
            >
              Vote YES
            </ByButton>
          </div>

          <div className="vote-wrapper">
            <label>NO</label>
            <div className="vote-status">
              <div className="vote-percent">
                <ProgressBar percent={rejectPercent} />
                <div className="value-text">
                  <span className="range">{rejectPercent} </span>%
                </div>
              </div>

              <span className="vote-vp">
                {proposal?.rejectedPowers || 0} VP ({rejecters.length} /{' '}
                {finalVp} votes)
              </span>
            </div>
            <ByButton
              value="NO"
              className="vote-no"
              onClick={votingModalOpen}
              disabled={!isVotable.votable}
            >
              Vote NO
            </ByButton>
          </div>
          <HeaderMsg>{isVotable.msg}</HeaderMsg>
        </VotingContent>
        <ContentDivider />
        <VPContent>
          <span> You need at least 1 VP to vote</span>
          <ByInvertedButton onClick={() => navigate(`/activity/${daoname}`)}>
            Get VP
          </ByInvertedButton>
        </VPContent>
        <ContentDivider />
        <DetailContent>
          <div className="title">DETAILS</div>
          <div className="sub-wrapper">
            <label className="sub">Created by</label>
            <div className="content">
              <img src={proposalCreater} alt="" />
              {proposal ? (
                <a
                  href={accountFinderLink(proposal?.proposer)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cropMiddleText(proposal?.proposer, 5)}
                </a>
              ) : (
                <ByPlaceHolder>
                  <Placeholder.Line />
                  <Placeholder.Line length="short" />
                </ByPlaceHolder>
              )}
            </div>
          </div>

          <div className="sub-wrapper">
            <label className="sub">Started</label>
            <div className="content">
              {format(
                new Date(proposal?.timestamp * 1000 || 0),
                'yyyy/MM/dd HH:mm',
              )}
            </div>
          </div>

          <div className="sub-wrapper">
            <label className="sub">Ends</label>
            <div className="content">
              {format(
                new Date(proposal?.finishedAt * 1000 || 0),
                'yyyy/MM/dd HH:mm',
              )}
            </div>
          </div>
        </DetailContent>
        <ContentDivider />
        <CommentContent>
          <div className="title">Comments</div>
          <ByComments.Group size="small" style={{ maxWidth: '100%' }}>
            {commentList.length > 0 &&
              commentList.map(c => {
                const cm = JSON.parse(c);

                return (
                  <ByComments key={cm.createdAt}>
                    <ByComments.Avatar src={cm.profile || DefaultProfile} />
                    <ByComments.Content>
                      <ByComments.Author as="a">
                        {cropMiddleText(cm.account)}
                      </ByComments.Author>
                      <ByComments.Metadata>
                        <div>
                          {format(
                            new Date(cm.createdAt * 1000),
                            'yy/MM/dd hh:mm',
                          )}
                        </div>
                        {cm?.voting && (
                          <Label
                            style={{ marginLeft: '5px' }}
                            as="a"
                            color={cm.voting === 'YES' ? 'blue' : 'orange'}
                            horizontal
                            size="tiny"
                            pointing="left"
                          >
                            {cm.voting}
                          </Label>
                        )}
                      </ByComments.Metadata>
                      <ByComments.Text>{cm.comment}</ByComments.Text>
                    </ByComments.Content>
                  </ByComments>
                );
              })}

            <CommentForm reply>
              <Form.Field>
                <textarea
                  value={mainComment}
                  placeholder="댓글을 작성해주세요."
                  onChange={inputMainComment}
                />
              </Form.Field>
              <CommentLengthInfo>{`(${mainComment.length.toLocaleString(
                'ko-KR',
              )} of 200 characters)`}</CommentLengthInfo>

              <BiyardButton
                disabled={mainComment === ''}
                content="comment"
                floated="right"
                onClick={() => applyMainComment(daoname)}
              />
            </CommentForm>
          </ByComments.Group>
        </CommentContent>
      </ByContainer>

      <VoteConfirmModal
        comment={votingComment}
        onComment={handleVotingComment}
        open={isVotingModalOpen}
        loading={votingLoading}
        data={{
          ...proposal,
          finalVp,
          acceptPercent,
          rejectPercent,
          accepters: accepters.length,
          rejecters: rejecters.length,
        }}
        type={modalType}
        onClose={closeVotingModal}
        onClick={() => handleVoting(daoname)}
      />

      <VoterModal
        open={isVoterModalOpen}
        // loading={loading}
        accepters={accepters}
        rejecters={rejecters}
        onClose={closeVoterModal}
      />
    </>
  );
}

ProposalDetail.propTypes = {
  dispatch: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  rootState: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  proposalDetail: makeSelectProposalDetail(),
  title: () => 'Proposal',
  description: () => 'Proposal detail information',
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default wrap(mapStateToProps, mapDispatchToProps, ProposalDetail);
