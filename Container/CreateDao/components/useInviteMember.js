import React, { useCallback, useMemo, useState } from 'react';
import {
  Divider,
  Form,
  Header,
  Icon,
  Table,
  Transition,
} from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { validateEmailFormat } from 'utils/textUtil';
import { BiyardButton } from 'components/Button/BiyardButton';
import { FormContent } from 'components/Form';
import {
  AddButton,
  Description,
  ErrorMessage,
  FormFieldWrapper,
  FormInput,
  StepContentsWrapper,
  TransitionTable,
} from './style';

export const useInviteMember = () => {
  const [members, setMembers] = useState([]);
  const [memberAddress, setMemberAddress] = useState('');

  const {
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const handleAddMember = useCallback(() => {
    if (!validateEmailFormat(memberAddress)) {
      setError('email', {
        message: '올바른 이메일 형식이 아닙니다.',
      });
      return;
    }

    const sameAddr = members.find(
      el => el.toLowerCase() === memberAddress.toLowerCase(),
    );

    if (sameAddr) {
      setError('email', {
        message: '이미 추가된 이메일 입니다.',
      });
      return;
    }

    clearErrors('email');
    setMembers(members.concat(memberAddress));
    setMemberAddress('');
  }, [clearErrors, memberAddress, members, setError]);

  const handleRemoveMember = useCallback(
    index => {
      const removed = members.filter((member, i) => i !== index);
      setMembers(removed);
    },
    [members],
  );

  const resetInviteMembers = () => {
    setMembers([]);
    setMemberAddress('');
  };

  const inviteMemberStep = useMemo(
    () => ({
      label: 'Invite DAO members (optional)',
      content: (
        <>
          <Description>
            <p>
              이메일로 리딤코드를 전송하여 DAO의 member를 초대 할 수 있습니다.
            </p>
            <p>
              입력한 이메일로 리딤코드가 발송되며 사용자는 리딤코드를 통해 DAO에
              가입할 수 있습니다.
            </p>
          </Description>
          <Divider />
          <StepContentsWrapper>
            <FormContent style={{ alignItems: 'baseline' }}>
              <label>Email</label>
              <div className="content">
                <FormInput>
                  <Form.Input
                    placeholder="Input email address"
                    fluid
                    error={errors.email && true}
                  >
                    <input
                      value={memberAddress}
                      onChange={e => {
                        setMemberAddress(e.target.value);
                      }}
                    />
                  </Form.Input>

                  <AddButton onClick={handleAddMember} icon="plus">
                    추가
                  </AddButton>
                </FormInput>
                {errors.email && (
                  <ErrorMessage>{errors.email.message}</ErrorMessage>
                )}
                {members.length > 0 && (
                  <TransitionTable basic>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell width={7}>Address</Table.HeaderCell>
                        <Table.HeaderCell width={7}>
                          DAO Tokens
                        </Table.HeaderCell>
                        <Table.HeaderCell />
                      </Table.Row>
                    </Table.Header>

                    <Transition.Group
                      as={Table.Body}
                      duration={{ hide: 0, show: 500 }}
                    >
                      {members.map((item, i) => (
                        <Table.Row key={item}>
                          <Table.Cell>{item}</Table.Cell>
                          <Table.Cell>1000</Table.Cell>
                          <Table.Cell>
                            <Icon
                              name="cancel"
                              link
                              inverted
                              onClick={() => handleRemoveMember(i)}
                            />
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Transition.Group>
                  </TransitionTable>
                )}
              </div>
            </FormContent>
          </StepContentsWrapper>

          <FormFieldWrapper />
        </>
      ),
    }),
    [errors.email, handleAddMember, handleRemoveMember, memberAddress, members],
  );

  return {
    members,
    inviteMemberStep,
    resetInviteMembers,
  };
};
