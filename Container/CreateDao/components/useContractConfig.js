import React, { useCallback, useMemo, useState } from 'react';
import { Divider, Form } from 'semantic-ui-react';
import InfoPopup from 'components/Helper/InfoPopup';
import { useForm } from 'react-hook-form';
import { validateDaoName, validateDaoSymbol } from 'utils/textUtil';
import { FormContent } from 'components/Form';
import { Description, ErrorMessage, StepContentsWrapper } from './style';

export const useContractConfig = () => {
  const [daoName, setDaoName] = useState('');
  const [daoSymbol, setDaoSymbol] = useState('');

  const {
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const handleDaoName = useCallback(
    e => {
      const input = e.currentTarget.value;
      if (validateDaoName(input)) {
        setDaoName(input);
        clearErrors('daoName');
      } else {
        setError('daoName', {
          message: '영어, 숫자, 특수문자(-)만 사용 가능합니다.(20자 이하)',
        });
      }
    },
    [clearErrors, setError],
  );

  const handleDaoSymbol = useCallback(
    e => {
      const input = e.currentTarget.value;
      if (validateDaoSymbol(input)) {
        setDaoSymbol(input);
        clearErrors('daoSymbol');
      } else {
        setError('daoSymbol', {
          message: '공백없이 영어, 숫자만 사용 가능합니다.(10자 이하)',
        });
      }
    },
    [clearErrors, setError],
  );

  const validateContractConfig = () => {
    if (daoName === '') {
      setError('daoName', { message: 'DAO명을 입력해주세요.' });
    }

    if (daoSymbol === '') {
      setError('daoSymbol', { message: '심볼을 입력해주세요.' });
    }
  };

  const resetContractConfig = () => {
    setDaoName('');
    setDaoSymbol('');
  };

  const contractConfgStep = useMemo(
    () => ({
      label: 'Contract config',
      content: (
        <>
          <Description>
            <p>DAO명과 심볼을 입력해주세요.</p>
            <p>
              <strong>* 컨트랙트가 배포된 이후 변경할 수 없습니다.</strong>
            </p>
          </Description>
          <Divider />
          <StepContentsWrapper>
            <FormContent>
              <label>
                DAO name
                <InfoPopup
                  content={
                    <div>
                      DAO명을 입력하세요.
                      <br /> ※ 영어, 숫자, 특수문자(-)만 사용 가능(20자 이하)
                    </div>
                  }
                />
              </label>
              <div className="content">
                <Form.Field required error={errors.daoName} fluid>
                  <input
                    placeholder="DAO 명을 입력해주세요."
                    value={daoName}
                    onChange={handleDaoName}
                  />
                  {errors.daoName && (
                    <ErrorMessage>{errors.daoName.message}</ErrorMessage>
                  )}
                </Form.Field>
              </div>
            </FormContent>

            <FormContent>
              <label>
                Symbol
                <InfoPopup
                  content={
                    <div>
                      심볼을 입력하세요.
                      <br /> ※ 공백없이 영어, 숫자만 사용 가능(10자 이하)
                    </div>
                  }
                />
              </label>
              <div className="content">
                <Form.Field required error={errors.daoSymbol}>
                  <input
                    placeholder="심볼을 입력해주세요."
                    value={daoSymbol}
                    onChange={handleDaoSymbol}
                  />
                  {errors.daoSymbol && (
                    <ErrorMessage>{errors.daoSymbol.message}</ErrorMessage>
                  )}
                </Form.Field>
              </div>
            </FormContent>
          </StepContentsWrapper>
        </>
      ),
    }),
    [
      daoName,
      daoSymbol,
      errors.daoName,
      errors.daoSymbol,
      handleDaoName,
      handleDaoSymbol,
    ],
  );

  return {
    daoName,
    daoSymbol,
    contractConfgStep,
    resetContractConfig,
    validateContractConfig,
  };
};
