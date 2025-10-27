import React, { useCallback, useMemo, useState } from 'react';
import {
  Checkbox,
  Divider,
  Dropdown,
  Form,
  Header,
  Icon,
  Label,
  Transition,
} from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { BiyardButton } from 'components/Button/BiyardButton';
import { FormContent } from 'components/Form';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { VCTemplateAccordion } from './DaoTemplate';

import {
  StepContentsWrapper,
  Description,
  ErrorMessage,
  DaoDescWrapper,
  TodoContent,
  ProposalTypeLabel,
  ToggleOptions,
  InputButton,
} from './style';

const daoTemplateOptions = [
  { key: 'vc', value: 'VC', text: 'Venture Captical' },
  { key: 'cm', value: 'CM', text: 'Custom DAO(준비중)' },
];

export const useSelectTemplate = () => {
  const [daoTemplate, setDaoTemplate] = useState('VC');
  const [openTemplateConfig, setOpenTemplateConfig] = useState(true);

  const [proposalType, setProposalType] = useState('');
  const [proposalTypes, setProposalTypes] = useState([
    '새로운 펀드 제안',
    '새로운 딜 제안',
    '투자 심사 제안',
    '기타',
  ]);

  const [isEnabledCommProposal, setIsEnabledCommProposal] = useState(true);
  const [isEnabledConfigProposal, setIsEnabledConfigProposal] = useState(true);
  const [isEnabledSBTProposal, setIsEnabledSBTProposal] = useState(true);

  const {
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const handleAddProposalType = useCallback(() => {
    const sameTyp = proposalTypes.find(
      el => el.toLowerCase() === proposalType.toLowerCase(),
    );

    if (sameTyp) {
      setError('propposalType', {
        message: '이미 추가된 카테고리 입니다.',
      });
      return;
    }

    if (!proposalType) {
      setError('propposalType', {
        message: '카테고리를 입력 해주세요',
      });
      return;
    }

    clearErrors('propposalType');
    setProposalTypes(proposalTypes.concat(proposalType));
    setProposalType('');
  }, [clearErrors, proposalType, proposalTypes, setError]);

  const handleRemoveProposalType = useCallback(
    index => {
      const removed = proposalTypes.filter((_, i) => i !== index);
      setProposalTypes(removed);
    },
    [proposalTypes],
  );

  const resetSelectTemplate = () => {
    setDaoTemplate('VC');
    setOpenTemplateConfig(true);

    setProposalType('');
    setProposalTypes([
      '새로운 펀드 제안',
      '새로운 딜 제안',
      '투자 심사 제안',
      '기타',
    ]);

    setIsEnabledCommProposal(true);
    setIsEnabledConfigProposal(true);
    setIsEnabledSBTProposal(true);
  };

  const validateTemplate = () => {
    setError('daoTemplate', {
      message: '준비중인 템플릿입니다. 다른 템플릿을 선택해주세요.',
    });
  };

  const clearTemplateError = () => {
    clearErrors('daoTemplate');
  };

  const selectTemplateStep = useMemo(
    () => ({
      label: 'Select DAO template',
      content: (
        <>
          <Description>
            <p>비즈니스 템플릿을 선택하고 진행해 주세요.</p>
            <p>
              {`Detail policies에서 설정된 값들은 `}
              <a
                href="https://docs.biyard.co/docs/getting-started/create_proposal/#configuration-proposal-%EC%A0%9C%EC%95%88%ED%95%98%EA%B8%B0"
                target="_blank"
              >
                configuration proposal
              </a>
              을 통해 변경 가능합니다.
            </p>
          </Description>
          <Divider />
          <StepContentsWrapper>
            <FormContent>
              <label>Templates</label>
              <div className="content">
                <Form.Field>
                  <Dropdown
                    placeholder="Select template"
                    fluid
                    search
                    defaultValue="VC"
                    onChange={(e, { value }) => setDaoTemplate(value)}
                    selection
                    options={daoTemplateOptions}
                  />
                </Form.Field>

                <Transition.Group
                  animation="fade"
                  duration={{ hide: 0, show: 200 }}
                >
                  {daoTemplate === 'VC' && (
                    <DaoDescWrapper>
                      <div className="ui small header">
                        Venture Capital(VC) DAO
                      </div>

                      <p> 벤쳐 캐피탈을 위한 조직을 생성할 수 있습니다.</p>
                      <p>
                        제안당 회원은 한 번의 투표가 가능하며 제안 및 투표
                        내용은 즉시 Klaytn에 기록됩니다.
                      </p>
                    </DaoDescWrapper>
                  )}
                  {daoTemplate === 'CM' && (
                    <DaoDescWrapper>
                      <Header as="h4" content="Custom DAO (준비중입니다)" />
                      <TodoContent />
                    </DaoDescWrapper>
                  )}
                </Transition.Group>
                {errors.daoTemplate && (
                  <ErrorMessage>{errors.daoTemplate.message}</ErrorMessage>
                )}
              </div>
            </FormContent>
          </StepContentsWrapper>
          <Divider />
          <StepContentsWrapper>
            <FormContent>
              <label>Template Configuration</label>
              <div className="content">
                <VCTemplateAccordion
                  active={openTemplateConfig}
                  isEnabledCommProposal={isEnabledCommProposal}
                  isEnabledConfigProposal={isEnabledConfigProposal}
                  isEnabledSBTProposal={isEnabledSBTProposal}
                  onClick={() => setOpenTemplateConfig(!openTemplateConfig)}
                />
              </div>
            </FormContent>
          </StepContentsWrapper>

          <Divider />
          <StepContentsWrapper>
            <Header>Proposal types</Header>

            <FormContent>
              <label className={`${!isEnabledCommProposal ? 'disable' : ''}`}>
                Community proposal
              </label>
              <div className="content">
                <ToggleOptions>
                  <div className="toggle-desc">
                    Community proposal 카테고리를 수정할 수 있습니다
                  </div>
                  <Checkbox
                    checked={isEnabledCommProposal}
                    toggle
                    onClick={() =>
                      setIsEnabledCommProposal(!isEnabledCommProposal)
                    }
                  />
                </ToggleOptions>
              </div>
            </FormContent>
            {isEnabledCommProposal && (
              <FormContent>
                <label>Proposal categories</label>
                <div className="content">
                  <Form.Input
                    placeholder="추가할 프로포절 타입을 입력하세요."
                    fluid
                    error={errors.propposalType && true}
                  >
                    <input
                      value={proposalType}
                      onChange={e => {
                        setProposalType(e.target.value);
                      }}
                    />

                    <InputButton onClick={handleAddProposalType} icon="plus" />
                  </Form.Input>
                  {errors.propposalType && (
                    <ErrorMessage>{errors.propposalType.message}</ErrorMessage>
                  )}

                  <ProposalTypeLabel>
                    {proposalTypes.map((item, i) => (
                      <Label as="a" image size="medium">
                        {item}

                        <Icon
                          name="delete"
                          onClick={() => handleRemoveProposalType(i)}
                        />
                      </Label>
                    ))}
                  </ProposalTypeLabel>
                </div>
              </FormContent>
            )}

            <FormContent>
              <label className={`${!isEnabledConfigProposal ? 'disable' : ''}`}>
                Configuration proposal
              </label>
              <div className="content">
                <Checkbox
                  style={{ float: 'right' }}
                  checked={isEnabledConfigProposal}
                  toggle
                  onClick={() =>
                    setIsEnabledConfigProposal(!isEnabledConfigProposal)
                  }
                />
              </div>
            </FormContent>

            <FormContent>
              <label className={`${!isEnabledSBTProposal ? 'disable' : ''}`}>
                SBT proposal
              </label>
              <div className="content">
                <Checkbox
                  style={{ float: 'right' }}
                  checked={isEnabledSBTProposal}
                  toggle
                  onClick={() => setIsEnabledSBTProposal(!isEnabledSBTProposal)}
                />
              </div>
            </FormContent>
          </StepContentsWrapper>
        </>
      ),
    }),
    [
      daoTemplate,
      errors.daoTemplate,
      errors.propposalType,
      handleAddProposalType,
      handleRemoveProposalType,
      isEnabledCommProposal,
      isEnabledConfigProposal,
      isEnabledSBTProposal,
      openTemplateConfig,
      proposalType,
      proposalTypes,
    ],
  );

  return {
    daoTemplate,
    proposalTypes,
    isEnabledCommProposal,
    isEnabledConfigProposal,
    isEnabledSBTProposal,
    selectTemplateStep,
    resetSelectTemplate,
    validateTemplate,
    clearTemplateError,
  };
};
