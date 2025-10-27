import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dimmer,
  Divider,
  Form,
  Header,
  Icon,
  Loader,
  Modal,
} from 'semantic-ui-react';
import styled from 'styled-components';
import contract from 'services/contract';
import { ByOutlineButton, ByButton } from 'components/Button/BiyardButton';
import { ByModal } from 'components/Modal';
import InfoPopup from 'components/Helper/InfoPopup';
import proposalManagerContract from 'services/contracts/proposals/proposalManager';
import proposalContract from 'services/contracts/proposals/proposal';

const CommentLengthInfo = styled.div`
  text-align: right;
  color: rgb(154, 162, 170) !important;
`;

const VpInfo = styled.span`
  float: right;
  font-size: 13px;
  font-weight: 500;
  color: rgb(154, 162, 170);
`;

export const VoteConfirmModal = ({
  type,
  onClose,
  onOpen,
  onClick,
  comment,
  onComment,
  loading = false,
  open,
  data,
  headerMsg,
}) => {
  const [voteFee, setVoteFee] = useState(0);
  const [minVpPerOnce, setMinVpPerOnce] = useState(0);
  const [remainedVp, setRemainedVp] = useState(0);
  const { finalVp, uuid } = data;

  useEffect(() => {
    if (!uuid) return;

    (async () => {
      const fee = await proposalManagerContract.getPolicy('POLICY_VOTE_FEE');
      setVoteFee(window.caver.utils.convertFromPeb(fee.toString(), 'KLAY'));

      const minVp = await proposalManagerContract.getPolicy(
        'POLICY_MINIMUM_VOTE_POWER_PER_ONCE',
      );

      const maxVp = await proposalManagerContract.getPolicy(
        'POLICY_MAXIMUM_VOTE_POWER_PER_ADDRESS',
      );

      const used = await proposalManagerContract.getVoterRemainedValue(uuid);

      if (used === undefined) return;

      setRemainedVp(
        window.caver.utils.convertFromPeb((maxVp - used).toString(), 'KLAY'),
      );

      setMinVpPerOnce(
        window.caver.utils.convertFromPeb(minVp.toString(), 'KLAY'),
      );
    })();
  }, [uuid]);

  return (
    <VoteModal
      onClose={onClose}
      onOpen={onOpen}
      open={open}
      closeIcon
      size="small"
      closeOnDimmerClick={false}
    >
      <Modal.Header>
        {type === 'YES' && (
          <Icon name="check" color="green" style={{ marginRight: '10px' }} />
        )}
        {type === 'NO' && (
          <Icon name="check" color="red" style={{ marginRight: '10px' }} />
        )}
        Vote <span>{type}</span>
      </Modal.Header>

      <Modal.Content>
        <Dimmer active={loading}>
          <Loader />
        </Dimmer>
        <DataContentsWrapper>
          <Header
            as="h3"
            dividing
            style={{ borderBottom: '1px solid #ffffff' }}
          >
            Check voting information<VpInfo>* 1 VP = 10 Tokens</VpInfo>
          </Header>
          <Divider />
          <DataContents>
            <label>Final VP</label>
            <p>{finalVp} VP</p>
          </DataContents>
          <DataContents>
            <label>Required minimum VP</label>
            <p>{minVpPerOnce} VP</p>
          </DataContents>
          <DataContents>
            <label>Voteable VP</label>
            <p>
              {remainedVp} VP
              {remainedVp <= 0 && <CheckIcon name="check" color="red" />}
            </p>
          </DataContents>
          <Divider />
          <DataContents>
            <label>Voting fee</label>
            <p>{voteFee} Tokens</p>
          </DataContents>
        </DataContentsWrapper>

        <Form reply>
          <Form.Field style={{ marginBottom: '0.3em' }}>
            <label>Comment (optional)</label>
            <textarea
              value={comment}
              onChange={onComment}
              placeholder="댓글을 작성해주세요."
            />
          </Form.Field>
        </Form>
        <CommentLengthInfo>{`(${comment.length.toLocaleString(
          'ko-KR',
        )} of 200 characters)`}</CommentLengthInfo>
      </Modal.Content>
      <Modal.Actions>
        <ByOutlineButton content="cancel" onClick={onClose} />
        <ByButton content="vote" primary onClick={onClick} />
      </Modal.Actions>
    </VoteModal>
  );
};

VoteConfirmModal.propTypes = {
  onOpen: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onComment: PropTypes.func.isRequired,

  comment: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  type: PropTypes.string,
  loading: PropTypes.bool,
  headerMsg: PropTypes.string,
};

const VoteModal = styled(ByModal)`
  .ui.form .field > label {
    font-size: 16px !important;
  }
  textarea {
    margin-top: 10px !important;
    background: #f5f6f9 !important;
    border: 1px solid #ecedf4 !important;
    border-radius: 12px !important;
  }
  textarea:not([rows]) {
    height: 8em !important;
  }
`;

const DataContentsWrapper = styled.div`
  margin: 20px 0 40px;
`;

const DataContents = styled.div`
  margin: 15px 10px;
  display: flex;
  label {
    width: 35%;
    margin-right: 5%;
    font-weight: 700 !important;
    font-size: 16px;
    line-height: 24px;

    color: var(--biyard-header2);
  }
  p {
    width: 65%;
    font-size: 15px;
    color: #7a7c85 !important;
  }
`;

const CheckIcon = styled(Icon)`
  margin-left: 10px !important;
`;
