import React, { useEffect, useState, useRef } from 'react';
import { Button, Form, Header, Icon, Label, Menu } from 'semantic-ui-react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { addMonths, set } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { v4 as c } from 'uuid';
import { ByContainer } from 'components/Container';
import { ByButton } from 'components/Button/BiyardButton';
import { ByForm } from 'components/Form';
import * as backend from 'services/backend';
import { PageLoader } from 'components/Loader/PageLoader';
import { byToast } from 'components/Toast';
import communityProposalContract from 'services/contracts/proposals/communityProposal';
import { MAX_FILE_SIZE } from 'utils/constants';
import 'react-datepicker/dist/react-datepicker.css';
import { notificationTrigger } from 'components/Novu/NovuTrigger';
import { proposalListState, useRecoilCacheRefresh } from 'states';
import { useGetCommunityProposalTypes } from 'hooks/proposals/useCommunityProposal';
import { ErrorMessage, FormFieldWrapper, InputChar } from './ConfigProposal';

export const CommunityProposal = members => {
  const navigate = useNavigate();
  const { daoname } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [category, setCategory] = useState('새로운 펀드 제안');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFileUploading, setisFileUploading] = useState(false);
  const [description, setDescription] = useState('');
  const uploadRef = useRef(null);
  const [endDate, setEndDate] = useState(
    set(new Date(), { hours: 23, minutes: 59 }),
  );
  const [propOptions, setPropOptions] = useState([]);
  const { data: proposalTypes, isLoading } = useGetCommunityProposalTypes();

  const refetchProposals = useRecoilCacheRefresh(proposalListState(daoname));

  useEffect(() => {
    (async () => {
      if (isLoading) return;

      const opt = proposalTypes.map(data => ({
        key: data,
        text: data,
        value: data,
      }));

      setPropOptions(opt);
    })();
  }, [isLoading, proposalTypes]);

  const onSubmit = async data => {
    setLoading(true);
    const uuid = c();
    const memberList = members.members;
    const finishedUnix = Math.floor(endDate.getTime() / 1000);
    try {
      const proposal = {
        title: data.title,
        description,
        category,
        files,
        finishedAt: finishedUnix,
      };

      await communityProposalContract.submitCommunityProposal(proposal, uuid);
      refetchProposals();
      navigate(`/proposals/${daoname}`);
      byToast(`Proposal 제출이 완료되었습니다.`, 'success');
      // TODO: Apply after novu backend
      // notificationTrigger('CreateProposal', memberList, {
      //   daoname,
      //   proposalid: uuid,
      // });
    } catch (e) {
      byToast(`Proposal 제출을 실패했습니다. -${e}`, 'error');
    }
    setLoading(false);
  };

  const handleUploadFiles = () => {
    uploadRef.current.click();
  };

  const byteSize = txt => new Blob([txt]).size;

  const handleDescription = e => {
    const desc = e.currentTarget.value;
    if (byteSize(desc) <= 10000) {
      setDescription(desc);
    }
  };

  const filterPassedTime = time => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  // NOTE: Submit 할때 파일 업로드도 같이 하는 방법으로 변경 고민
  const handleUploadChange = async e => {
    setisFileUploading(true);
    const f = e.target.files;
    const formData = new FormData();

    try {
      if (files.length + f.length >= 10) {
        throw new Error('최대 10개의 파일까지 업로드 가능합니다.');
      }

      for (let i = 0; i < f.length; i++) {
        if (f[i].size > MAX_FILE_SIZE) {
          throw new Error('하나의 파일당 50MB까지 업로드 가능합니다.');
        }

        formData.append(
          'files',
          f[i],
          Buffer.from(f[i].name, 'utf-8').toString('base64'),
        );
      }

      const res = await backend.uploadFiles(formData);

      setFiles(files.concat(res));
    } catch (err) {
      // FIXME: 전체적인 에러 핸들링 처리 필요
      if (err?.response?.status === 500) {
        byToast(err.response.data, 'error');
      } else {
        byToast(err.message, 'error');
      }
    } finally {
      setisFileUploading(false);
    }
  };

  const handleDeleteFile = e => {
    const f = files.filter(({ url }) => url !== e.target.id);
    setFiles(f);
  };

  return (
    <ByContainer>
      <PageLoader loading={loading} />
      <ProposalHeader>Create a community proposal </ProposalHeader>

      <Description>
        프로포절을 제출하기 위해서는 100개의 토큰이 필요합니다.
      </Description>

      <ProposalByForm
        id="comm-proposal-form"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <FormAndLabel>
          <FormLabel>프로포절 타입</FormLabel>
          <TypeDropDown
            fluid
            selection
            placeholder="프로포절 타입을 선택해주세요"
            options={propOptions}
            onChange={(e, data) => setCategory(data.value)}
          />
        </FormAndLabel>
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
        <FormFieldWrapper style={{ paddingTop: '90px' }}>
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
      </ProposalByForm>

      <div className="ContentLayout__Section" style={{ marginLeft: '210px' }}>
        <div className="dcl field MarkdownTextarea">
          <Button
            style={{ backgroundColor: '#535455', color: '#ffffff' }}
            onClick={handleUploadFiles}
            loading={isFileUploading}
          >
            파일 업로드
          </Button>
          <input
            style={{ display: 'none' }}
            ref={uploadRef}
            onChange={handleUploadChange}
            type="file"
            multiple
          />

          {files.map(el => (
            <Label
              as="a"
              key={el.url}
              style={{ marginLeft: '10px', background: 'none' }}
            >
              <a href={el.url}>{el.name}</a>
              <Icon name="delete" id={el.url} onClick={handleDeleteFile} />
            </Label>
          ))}
        </div>
      </div>
      <SubmitDiv>
        <ByButton
          type="submit"
          form="comm-proposal-form"
          style={{ marginTop: '50px' }}
        >
          Submit proposal
        </ByButton>
      </SubmitDiv>
    </ByContainer>
  );
};

export const SubmitDiv = styled.div`
  display: flex;
  justify-content: flex-end;
`;
export const Description = styled.div`
  margin: 10px auto 30px;
  color: #7a7c85;
`;
export const ProposalHeader = styled.div`
  font-weight: 700;
  font-size: 23px;
  line-height: 28px;
  letter-spacing: -0.005em;
  color: #202123;
  margin-bottom: 14px;
`;
export const SelectFileWrapper = styled.div`
  margin-bottom: 50px;
`;
export const ProposalByForm = styled(ByForm)`
  border-top: 1px solid #ecedf4;
`;
export const TypeDropDown = styled(Form.Dropdown)`
  padding-top: 40px;
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
export const FileInput = styled.div`
  width: 115px;
  height: 33px;
  padding: 6px 25px;
  background-color: var(--biyard);
  border-radius: 4px;
  color: white;
  cursor: ${props => !props.loading && 'pointer;'}
  display: flex;
  justify-content: center;
  align-items: center;

  label {
    cursor: pointer;
  }

  input[type='file'] {
    display: none;
  }
`;
