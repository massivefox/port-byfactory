import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader, Modal, Table } from 'semantic-ui-react';
import DefaultProfile from 'images/default_profile.png';
import styled from 'styled-components';
import { cropMiddleText } from 'utils/textUtil';
import profileContract from 'services/contracts/profile';

export const VoterModal = ({
  onClose,
  onOpen,
  loading = false,
  open,
  accepters,
  rejecters,
}) => {
  const [voters, setVoters] = useState([]);

  useEffect(() => {
    (async () => {
      if (!accepters || !rejecters) return;

      const a = accepters.map(v => ({ account: v, vote: 'yes' }));
      const r = rejecters.map(v => ({ account: v, vote: 'no' }));

      const voterInfo = [];
      for await (const { account, vote } of [...a, ...r]) {
        try {
          const profile = await profileContract.getProfile(account);
          voterInfo.push({ account, profile, vote });
        } catch (e) {
          // NOTE: 프로필 설정이 되어있지 않은 계정은 에러를 반환해서 continue로 처리하고 default image로 설정
          voterInfo.push({ account, profile: DefaultProfile, vote });
          // eslint-disable-next-line no-continue
          continue;
        }
      }
      setVoters(voterInfo);
    })();
  }, [accepters, rejecters]);

  return (
    <VoteModal
      onClose={onClose}
      onOpen={onOpen}
      open={open}
      size="small"
      closeIcon
    >
      <Modal.Header>{voters.length} Votes</Modal.Header>
      <Modal.Content scrolling>
        <Dimmer active={loading} inverted>
          <Loader />
        </Dimmer>
        <DataContentsWrapper>
          <Table basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Voters</Table.HeaderCell>
                <Table.HeaderCell>Voted</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {voters.map(v => (
                <Table.Row key={v.account}>
                  <Table.Cell>
                    <img
                      alt=""
                      loading="lazy"
                      src={v.profile}
                      className="voter-image"
                    />
                    {cropMiddleText(v.account, 5)}
                  </Table.Cell>
                  <Table.Cell>{v.vote.toUpperCase()}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </DataContentsWrapper>
      </Modal.Content>
    </VoteModal>
  );
};

VoterModal.propTypes = {
  onOpen: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  accepters: PropTypes.array,
  rejecters: PropTypes.array,
  loading: PropTypes.bool,
};

const VoteModal = styled(Modal)`
  * {
    color: #ffffff !important;
  }
  background-color: rgb(8, 34, 53) !important;
  .header,
  .content,
  .actions {
    background-color: rgb(8, 34, 53) !important;
  }
`;

const DataContentsWrapper = styled.div`
  text-align: center;
  margin: 20px 0 40px;
`;
