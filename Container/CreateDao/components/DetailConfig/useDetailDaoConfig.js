/* eslint-disable indent */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Header,
  Icon,
  Image,
  Input,
  Table,
} from 'semantic-ui-react';
import _ from 'lodash';
import { BySearch } from 'components/SearchBox';
import InfoPopup from 'components/Helper/InfoPopup';
import { FormContent } from 'components/Form';
import { validateOnlyNumber } from 'utils/textUtil';

import {
  Description,
  TransitionTable,
  SbtContentWrapper,
  EmptyRewardMessage,
  StepContentsWrapper,
  StepRangeContent,
  StepContentSearchTitle,
  StepContentTitle,
  RewardCount,
} from '../style';
import {
  activitiesData,
  permissionData,
  rewardOptionTypes,
  rewardsData,
} from './configData';

export const useDetailDaoConfig = () => {
  const [proposalFee, setProposalFee] = useState(100);
  const [votingFee, setVotingFee] = useState(10);
  const [acctVp, setAcctVp] = useState(1);
  const [activities, setActivities] = useState(activitiesData);
  const [rewards, setRewards] = useState([rewardsData]);
  const [permissions, setPermissions] = useState(permissionData);

  // Activity에 대한 SBT 발급 여부 state
  const [isProposalSBTActive, setIsProposalSBTActive] = useState(true);
  const [isVoteSBTActive, setIsVoteSBTActive] = useState(true);
  const [isCommentSBTActive, setIsCommentSBTActive] = useState(true);

  const [isPublicComment, setIsPublicComment] = useState(true);
  const [isEnabledComment, setIsEnabledComment] = useState(true);

  useEffect(() => {
    const initRewards = [];
    for (let i = 0; i < activitiesData.length; i++) {
      if (rewardsData[activitiesData[i].name])
        initRewards.push({
          ...rewardsData[activitiesData[i].name],
          selected: true,
        });
    }
    setRewards(initRewards);
  }, []);

  const handleProposalFee = (e, { value }) => setProposalFee(value);
  const handleVotingFee = (e, { value }) => setVotingFee(value);
  const handleAcctVp = (e, { value }) => setAcctVp(value);

  const resetDetalDaoConfig = () => {
    setProposalFee(100);
    setVotingFee(10);
    setAcctVp(1);

    setIsProposalSBTActive(true);
    setIsVoteSBTActive(true);
    setIsCommentSBTActive(true);

    setIsPublicComment(true);
    setIsEnabledComment(true);
  };

  const setActivation = useCallback(
    index => {
      const newAct = [...activities];

      newAct[index].isActive = !activities[index].isActive;
      setActivities(newAct);

      const result = rewards.map(r => {
        const reward = r;
        if (reward.name === newAct[index].name)
          reward.selected = newAct[index].isActive;
        return reward;
      });
      setRewards(result);
    },
    [activities, rewards],
  );

  const setRewardActivation = useCallback(
    index => {
      const newRewards = [...rewards];
      newRewards[index].isActive = !rewards[index].isActive;
      setRewards(newRewards);
    },
    [rewards],
  );

  const setRevertActivation = useCallback(
    index => {
      const newRewards = [...rewards];
      newRewards[index].isRevertActive = !rewards[index].isRevertActive;
      setRewards(newRewards);
    },
    [rewards],
  );

  const isEmptyRewards = useMemo(() => {
    const res = rewards.find(reward => reward.selected === true);
    return res === undefined;
  }, [rewards]);

  const handleRewardCount = useCallback(
    (e, index, conIndex) => {
      const { value, name } = e.target;
      if (!validateOnlyNumber(value)) {
        return;
      }
      const newRewards = [...rewards];
      if (name === 'act') {
        newRewards[index].activateCondition[
          conIndex
        ].activityCountForReward = value;
      } else if (name === 'reward') {
        newRewards[index].activateCondition[conIndex].rewardCount = value;
      }

      setRewards(newRewards);
    },
    [rewards],
  );

  const handlePermission = useCallback(
    (e, data) => {
      const { name } = data;

      const splitData = name.split('-');
      const index = splitData[0];
      const permissionName = splitData[1];
      const accessType = splitData[2];

      const newPermission = [...permissions];

      newPermission[index][permissionName][accessType] = !permissions[index][
        permissionName
      ][accessType];

      setPermissions(newPermission);
    },
    [permissions],
  );

  const handleActivitySearch = useCallback(
    e => {
      const txt = e.target.value;
      const re = new RegExp(_.escapeRegExp(txt), 'i');
      const isMatch = result => re.test(result.label);
      const result = _.filter(activities, isMatch);
      if (result.length !== 0 && txt.length !== 0) {
        setActivities(result);
      } else {
        setActivities(activitiesData);
      }
    },
    [activities],
  );

  const daoConfigStep = useMemo(
    () => ({
      label: 'Set detail DAO configuration',
      content: (
        <>
          <Description>
            <p>
              DAO policies, activities, permission에 대한 상세설정을 할 수
              있습니다.
            </p>
          </Description>
          <Divider />
          <StepContentsWrapper>
            <Header>Detail Policies</Header>

            <FormContent style={{ alignItems: 'center' }}>
              <label className="range">
                Proposal submit fee
                <InfoPopup
                  content={<div>프로포절 제출시 사용되는 수수료 입니다.</div>}
                />
              </label>
              <div className="content">
                <StepRangeContent>
                  <Form.Field className="range">
                    <Form.Input
                      min={0}
                      max={1000}
                      name="duration"
                      value={proposalFee}
                      step={10}
                      onChange={handleProposalFee}
                      type="range"
                    />
                  </Form.Field>
                  <div className="value-wrapper">
                    <div className="value-text">
                      <span className="range">{proposalFee}</span> tokens
                    </div>
                  </div>
                </StepRangeContent>
              </div>
            </FormContent>

            <FormContent style={{ alignItems: 'center' }}>
              <label className="range">
                Voting fee
                <InfoPopup content={<div>투표 수수료 입니다.</div>} />
              </label>
              <div className="content">
                <StepRangeContent>
                  <Form.Field className="range">
                    <Form.Input
                      min={0}
                      max={100}
                      name="duration"
                      value={votingFee}
                      step={1}
                      onChange={handleVotingFee}
                      type="range"
                    />
                  </Form.Field>
                  <div className="value-wrapper">
                    <div className="value-text">
                      <span className="range">{votingFee}</span> tokens
                    </div>
                  </div>
                </StepRangeContent>
              </div>
            </FormContent>

            <FormContent style={{ alignItems: 'center' }}>
              <label className="range">
                VP per account at proposal
                <InfoPopup
                  content={
                    <div>
                      하나의 프로포절에 계정이 사용할 수 있는 VP 값입니다.
                      <br />- 1VP = 10 tokens
                    </div>
                  }
                />
              </label>
              <div className="content">
                <StepRangeContent>
                  <Form.Field className="range">
                    <Form.Input
                      min={0}
                      max={10}
                      name="duration"
                      value={acctVp}
                      onChange={handleAcctVp}
                      step={1}
                      type="range"
                    />
                  </Form.Field>
                  <div className="value-wrapper">
                    <div className="value-text">
                      <span className="range">{acctVp}</span> VP
                    </div>
                  </div>
                </StepRangeContent>
              </div>
            </FormContent>
          </StepContentsWrapper>
          <Divider />

          <StepContentsWrapper>
            <FormContent>
              <StepContentSearchTitle>
                <Header>Reward 설정</Header>
                <BySearch onSearchChange={handleActivitySearch} />
              </StepContentSearchTitle>
            </FormContent>
            {activities.map(({ name, label, isActive, enable }, index) => (
              <FormContent>
                <label>{label}</label>
                <div className="content">
                  <Checkbox
                    style={{ float: 'right' }}
                    checked={isActive}
                    toggle
                    disabled={!enable}
                    onClick={() => {
                      if (enable) setActivation(index);
                    }}
                  />
                </div>
              </FormContent>
            ))}
          </StepContentsWrapper>

          <Divider />

          {rewards.map(
            (
              {
                name,
                selected,
                label,
                description,
                defaultSbt,
                isActive,
                activateCondition,
                isRevertActive,
              },
              i,
            ) => {
              if (selected) {
                return (
                  <>
                    <StepContentsWrapper>
                      <StepContentTitle>
                        <Header> {label}</Header>
                        <div className="description">{description}</div>
                        <div className="close-icon">
                          <Icon size="small" name="close" />
                        </div>
                      </StepContentTitle>
                      <FormContent style={{ alignItems: 'center' }}>
                        <label>Reward 활성화</label>
                        <div className="content">
                          <Checkbox
                            style={{ float: 'right' }}
                            checked={isActive}
                            toggle
                            onClick={() => setRewardActivation(i)}
                          />
                        </div>
                      </FormContent>

                      {isActive && (
                        <>
                          <FormContent style={{ alignItems: 'center' }}>
                            <label> Reward 조건 설정</label>
                            <div className="content" />
                          </FormContent>
                          {activateCondition.map((con, conIndex) => {
                            if (con.type === rewardOptionTypes.ACTIVATION) {
                              return (
                                <FormContent
                                  key={`${i}-${con.type}-con`}
                                  style={{ alignItems: 'center' }}
                                >
                                  <label>{con.label}</label>
                                  <div className="content">
                                    <Checkbox
                                      checked={con.isActive}
                                      style={{ float: 'right' }}
                                      toggle
                                    />
                                  </div>
                                </FormContent>
                              );
                            }

                            if (con.type === rewardOptionTypes.COUNT) {
                              return (
                                <FormContent
                                  key={`${i}-${con.type}-con`}
                                  style={{ alignItems: 'center' }}
                                >
                                  <label>Reward 발급 갯수 설정</label>
                                  <div className="content">
                                    <RewardCount>
                                      <Input
                                        name="act"
                                        value={con.activityCountForReward}
                                        onChange={e =>
                                          handleRewardCount(e, i, conIndex)
                                        }
                                      />
                                      {`${label} 당`}
                                      <Input
                                        name="reward"
                                        value={con.rewardCount}
                                        onChange={e =>
                                          handleRewardCount(e, i, conIndex)
                                        }
                                      />
                                      개 발급
                                    </RewardCount>
                                  </div>
                                </FormContent>
                              );
                            }
                            return null;
                          })}
                        </>
                      )}

                      <FormContent>
                        <label as="h4">SBT 이미지</label>
                        <div className="content">
                          <SbtContentWrapper>
                            <Image src={defaultSbt} />
                            <Button className="sbt-button">
                              SBT 이미지 변경
                            </Button>
                          </SbtContentWrapper>
                        </div>
                      </FormContent>

                      <FormContent>
                        <label>Reward 회수 활성화</label>
                        <div className="content">
                          <Checkbox
                            style={{ float: 'right' }}
                            checked={isRevertActive}
                            toggle
                            onClick={() => setRevertActivation(i)}
                          />
                        </div>
                      </FormContent>
                    </StepContentsWrapper>
                    <Divider />
                  </>
                );
              }
              return <></>;
            },
          )}
          {isEmptyRewards && (
            <>
              <EmptyRewardMessage>
                설정할 수 있는 Reward가 없습니다.
                <br />
                Activity를 먼저 선택해주세요.
              </EmptyRewardMessage>
              <Divider />
            </>
          )}

          <StepContentsWrapper>
            <Header>Permission</Header>
            <TransitionTable striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={4} rowSpan="2">
                    Name
                  </Table.HeaderCell>
                  <Table.HeaderCell width={6} colSpan="2">
                    Member
                  </Table.HeaderCell>
                  <Table.HeaderCell width={6} colSpan="2">
                    Public
                  </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                  <Table.HeaderCell width={3}>Read / Write </Table.HeaderCell>
                  <Table.HeaderCell width={3}>Read</Table.HeaderCell>
                  <Table.HeaderCell width={3}>Read / Write</Table.HeaderCell>
                  <Table.HeaderCell width={3}>Read</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {permissions.map(({ name, member, publicUser }, i) => (
                  <Table.Row key={`${name}-permission`}>
                    <Table.Cell>
                      <b>{name}</b>
                    </Table.Cell>
                    <Table.Cell>
                      <Checkbox
                        checked={member.write}
                        name={`${i}-member-write`}
                        onClick={handlePermission}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Checkbox
                        checked={member.read}
                        name={`${i}-member-read`}
                        onClick={handlePermission}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Checkbox
                        checked={publicUser.write}
                        name={`${i}-publicUser-write`}
                        onClick={handlePermission}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Checkbox
                        checked={publicUser.read}
                        name={`${i}-publicUser-read`}
                        onClick={handlePermission}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </TransitionTable>
          </StepContentsWrapper>
        </>
      ),
    }),
    [
      acctVp,
      activities,
      handleActivitySearch,
      handlePermission,
      handleRewardCount,
      isEmptyRewards,
      permissions,
      proposalFee,
      rewards,
      setActivation,
      setRevertActivation,
      setRewardActivation,
      votingFee,
    ],
  );

  return {
    proposalFee,
    votingFee,
    acctVp,
    isPublicComment,
    isEnabledComment,
    isProposalSBTActive,
    isVoteSBTActive,
    isCommentSBTActive,
    daoConfigStep,
    resetDetalDaoConfig,
  };
};
