import React, { useState, useMemo } from 'react';
import { Form, Header, Icon, Menu } from 'semantic-ui-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { addMonths, set } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { ByButton, BiyardButton } from 'components/Button/BiyardButton';
import { v4 as c } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { ByContainer } from 'components/Container';
import { ByForm } from 'components/Form';

import { byToast } from 'components/Toast';
import { PageLoader } from 'components/Loader/PageLoader';
import configurationProposalContract from 'services/contracts/proposals/configurationProposal';
import 'react-datepicker/dist/react-datepicker.css';
import { proposalListState, useRecoilCacheRefresh } from 'states';
import { notificationTrigger } from 'components/Novu/NovuTrigger';
import { policiesTextInfo } from 'utils/textUtil';

export const ConfigProposal = ({ policies, members }) => {
  const { caver } = window;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { daoname } = useParams();
  const navigate = useNavigate();
  const policyType = 'legacy';
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState(
    set(new Date(), { hours: 23, minutes: 59 }),
  );
  const refetchProposals = useRecoilCacheRefresh(proposalListState(daoname));

  const onSubmit = async data => {
    setLoading(true);
    const uuid = c();
    const finishedUnix = Math.floor(endDate.getTime() / 1000);
    const policyName = policies[selectedIndex].key;

    try {
      // TODO: apply new policy proposal
      const proposal = {
        type: policyType === 'legacy' ? 1 : 2,
        title: data.title,
        description,
        category: `DAO policy 제안`,
        policyName: policyType === 'legacy' ? policyName : data.policyName,
        policyValue: policiesTextInfo[policyName].realNumber
          ? data.policyValue
          : caver.utils.convertToPeb(data.policyValue, 'KLAY'),
        finishedAt: finishedUnix,
      };

      await configurationProposalContract.submitConfigurationProposal(
        proposal,
        uuid,
      );
      refetchProposals();
      navigate(`/proposals/${daoname}`);
      byToast(`proposal has been submitted.`, 'success');
      // TODO: Apply after novu backend
      // await notificationTrigger('CreateProposal', members, {
      //   daoname,
      //   proposalid: uuid,
      // });
    } catch (e) {
      console.log(e);
      byToast(`Proposal submit failed ${e}`, 'error');
    }
    setLoading(false);
  };

  const byteSize = txt => new Blob([txt]).size;

  const handleDescription = e => {
    const desc = e.currentTarget.value;
    if (byteSize(desc) <= 10000) {
      setDescription(desc);
    }
  };

  const currentPolicyValue = useMemo(() => {
    if (!policiesTextInfo[policies[selectedIndex].key].realNumber) {
      return caver.utils.convertFromPeb(policies[selectedIndex].value, 'KLAY');
    }
    return policies[selectedIndex].value;
  }, [caver.utils, policies, selectedIndex]);

  const filterPassedTime = time => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  return (
    <ByContainer>
      <PageLoader loading={loading} />
      <ProposalHeader>Create a configuration proposal</ProposalHeader>

      <Description>
        DAO의 정책 프로포절을 생성합니다.
        <br />
        프로포절을 제출하기 위해서는 100개의 토큰이 필요합니다.
      </Description>

      <ProposalByForm
        id="config-proposal-form"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        {/* <Form.Group inline>
          <Form.Radio
            label="기존 policy 변경"
            value="legacy"
            checked={policyType === 'legacy'}
            onChange={() => setPolicyType('legacy')}
          />
          <Form.Radio
            label="새 policy 추가"
            value="new"
            checked={policyType === 'new'}
            onChange={() => setPolicyType('new')}
          />
        </Form.Group> */}

        <FormFieldWrapper>
          <FormAndLabel>
            <FormLabel>제목</FormLabel>
            <FormField error={errors.title}>
              <input
                label="제목"
                {...register('title', { required: '제목을 입력해주세요' })}
                placeholder="제목을 입력해주세요"
              />
              {errors.title && (
                <ErrorMessage>{errors.title.message}</ErrorMessage>
              )}
            </FormField>
          </FormAndLabel>
        </FormFieldWrapper>

        <FormFieldWrapper>
          <FormAndLabel>
            <FormLabel>설명</FormLabel>
            <FormField>
              <textarea
                placeholder="Proposal description"
                value={description}
                onChange={handleDescription}
                style={{ background: '#ecedf4 !important' }}
              />
              <InputChar>{`(${byteSize(description).toLocaleString(
                'ko-KR',
              )} of 10,000 bytes)`}</InputChar>
            </FormField>
          </FormAndLabel>
        </FormFieldWrapper>

        {policyType === 'legacy' && (
          <>
            <FormFieldWrapper>
              <FormAndLabel>
                <FormLabel style={{ paddingTop: '50px' }}>
                  프로포절 타입
                </FormLabel>
                <TypeDropDown
                  fluid
                  defaultValue={policies[selectedIndex].value}
                  key={policies[selectedIndex].value}
                  selection
                  options={policies}
                  onChange={(e, data) => {
                    const { index } = data.options.find(
                      o => o.value === data.value,
                    );
                    setSelectedIndex(index);
                  }}
                />
              </FormAndLabel>
            </FormFieldWrapper>

            <FormFieldWrapper
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginLeft: '5em',
              }}
            >
              <Form.Group widths="equal" style={{ width: '72%' }}>
                <ValueField>
                  <label>Current value</label>
                  <input value={currentPolicyValue} readOnly />
                </ValueField>
                <Icon
                  name="angle right"
                  style={{
                    lineHeight: '82px',
                    width: '60px',
                    marginTop: '30px',
                  }}
                />
                <ValueField error={errors.policyValue}>
                  <label>Proposal value</label>
                  <input
                    {...register('policyValue', {
                      required: '필수 값입니다.',
                      pattern: {
                        value: /^[0-9]+$/,
                        message: '정수만 입력 가능합니다',
                      },
                    })}
                  />
                  {errors.policyValue && (
                    <ErrorMessage>{errors.policyValue.message}</ErrorMessage>
                  )}
                </ValueField>
              </Form.Group>
            </FormFieldWrapper>

            <FormFieldWrapper>
              <FormAndLabel>
                <FormLabel>종료일자</FormLabel>
                <FormField>
                  {/* <input value={endDate} /> */}
                  <DatePicker
                    dateFormat="yyyy/MM/dd HH:mm"
                    locale={ko}
                    selected={endDate}
                    onChange={date => setEndDate(date)}
                    minDate={new Date()}
                    maxDate={addMonths(new Date(), 1)}
                    showTimeSelect
                    filterTime={filterPassedTime}
                    timeFormat="HH:mm"
                    timeIntervals={60}
                    timeCaption="time"
                    onKeyDown={e => {
                      e.preventDefault();
                    }}
                  />
                </FormField>
              </FormAndLabel>
            </FormFieldWrapper>
          </>
        )}

        {policyType === 'new' && (
          <>
            <FormFieldWrapper>
              <FormAndLabel>
                <FormLabel>Policy 명</FormLabel>
                <FormField error={errors.title}>
                  <input
                    placeholder="Policy 명을 입력하세요"
                    {...register('policyName', {
                      required: 'Policy 명을 입력하세요',
                    })}
                  />
                  {errors.policyName && (
                    <ErrorMessage>{errors.policyName.message}</ErrorMessage>
                  )}
                </FormField>
              </FormAndLabel>
            </FormFieldWrapper>

            <FormFieldWrapper>
              <FormAndLabel>
                <FormLabel>설정값</FormLabel>
                <FormField error={errors.policyValue}>
                  <input
                    placeholder="설정 값을 입력하세요"
                    {...register('policyValue', {
                      required: '설정 값을 입력하세요',
                    })}
                  />
                  {errors.policyValue && (
                    <ErrorMessage>{errors.policyValue.message}</ErrorMessage>
                  )}
                </FormField>
              </FormAndLabel>
            </FormFieldWrapper>
          </>
        )}
      </ProposalByForm>

      <SubmitDiv>
        <ByButton
          type="submit"
          form="config-proposal-form"
          style={{ marginTop: '50px' }}
        >
          Submit proposal
        </ByButton>
      </SubmitDiv>
    </ByContainer>
  );
};

ConfigProposal.propTypes = {
  policies: PropTypes.array.isRequired,
  members: PropTypes.array.isRequired,
};

export const Description = styled.div`
  margin: 10px auto 30px;
  color: #7a7c85;
`;

export const FormFieldWrapper = styled.div`
  margin-bottom: 40px;

  .react-datepicker__triangle::after,
  .react-datepicker__triangle::before {
    left: -30px !important;
  }
`;

export const ErrorMessage = styled.p`
  margin-top: 10px;
  color: rgb(224, 180, 180) !important;
`;

export const SelectFileWrapper = styled.div`
  margin-bottom: 50px;
`;

export const FileInput = styled.div`
  label {
    padding: 6px 25px;
    background-color: var(--biyard);
    border-radius: 4px;
    color: white;
    cursor: pointer;
  }

  input[type='file'] {
    display: none;
  }
`;

export const ByMenu = styled(Menu)`
  & * {
    color: #ffffff !important;
  }
`;
export const ProposalByForm = styled(ByForm)`
  border-top: 1px solid #ecedf4;
`;
export const SubmitDiv = styled.div`
  display: flex;
  justify-content: flex-end;
`;
export const TypeDropDown = styled(Form.Dropdown)`
  padding-top: 100px;
  width: 67%;

  .ui.fluid.dropdown {
    border: 1px solid #ecedf4;
    border-radius: 12px;
  }
  .dropdown {
    background: #ecedf4 !important;
    height: 51px;
    border: 1px solid #ecedf4;
    border-radius: 12px;
  }
  .text,
  .item {
    background: #ecedf4 !important;
  }
    .text {
      margin-top: 5px;
    }
  }
  .ui.active.selection.dropdown {
    background: #ecedf4 !important;
    border: 1px solid #ecedf4;
    border-radius: 12px;
    .menu {
      background: #ffffff !important;
      border: 1px solid #ecedf4;
      border-radius: 0 0 12px 12px;
    }
  }
  .ui.dropdown > .text  {
    margin-top: 5px;
  }
  .ui.selection.dropdown>.dropdown.icon {
    margin-top: -4px;
  }
`;

export const FormField = styled(Form.Field)`
  width: 67%;
  height: 51px;
  background-color: #ffffff;
  border: 0;
  border-radius: 12px !important;
  padding-top: 16px !important;
  input {
    background: #ecedf4 !important;
    border: 0 !important;
    border-radius: 12px !important;
    margin-top: 5px !important;
    height: 51px;
  }
  textarea {
    background: #ecedf4 !important;
  }
`;
export const ValueField = styled(Form.Field)`
  width: 20% !important;
  height: 51px;
  background-color: #ffffff;
  border: 0;
  border-radius: 12px !important;
  padding-top: 16px !important;
  input {
    background: #ecedf4 !important;
    border: 0 !important;
    border-radius: 12px !important;
    margin-top: 5px !important;
    height: 51px;
  }
  textarea {
    background: #ecedf4 !important;
  }
`;
export const FormAndLabel = styled.div`
  display: flex;
  align-items: center;
  color: #000000;
`;
export const FormLabel = styled.div`
  width: 20%;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.03em;
  color: #7e8088;
`;
export const InputChar = styled.div`
  float: right;
  margin-top: 10px;
  color: rgb(154, 162, 170) !important;
`;
export const ProposalHeader = styled.div`
  font-weight: 700;
  font-size: 23px;
  line-height: 28px;
  letter-spacing: -0.005em;
  color: #202123;
  margin-bottom: 14px;
`;
