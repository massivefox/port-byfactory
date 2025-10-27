import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRecoilValueLoadable } from 'recoil';
import _ from 'lodash';
import { useRecoilCacheRefresh, userState } from 'states';
import { daoListState } from 'states/daoStates';
import { STORAGE_KEYS } from 'storage';
import styled from 'styled-components';
import { Label } from 'semantic-ui-react';

const { DAO_NAME, DAO_REG_ADDR } = STORAGE_KEYS;

const SearchLabel = styled(Label)`
  background: none !important;
  color: var(--biyard-text) !important;
`;

export function useViewModel() {
  const [sortType, setSortType] = useState('LATEST');
  const [searchResults, setSearchResults] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [daoList, setDaoList] = useState([]);

  const { contents, state: daoState } = useRecoilValueLoadable(daoListState);
  const { contents: userInfo } = useRecoilValueLoadable(userState);
  const userRefresh = useRecoilCacheRefresh(userState);
  const navigate = useNavigate();

  useEffect(() => {
    if (daoState === 'hasValue') {
      setDaoList([...contents].reverse());
    }
  }, [contents, daoState]);

  const sortDropdownClick = useCallback(
    e => {
      const txt = e.target.innerText;
      if (txt === sortType) return;

      setSortType(txt);
      const p = [...contents];
      if (txt === 'LATEST') {
        setDaoList(p.reverse());
      } else {
        setDaoList(p);
      }
    },
    [contents, sortType],
  );

  const handleDaoClick = useCallback(
    (daoName, index) => {
      if (daoState !== 'hasValue') return;

      localStorage.setItem(DAO_NAME, daoName);
      localStorage.setItem(DAO_REG_ADDR, contents[index].address);
      userRefresh();
      navigate(`/proposals/${daoName}`);
    },

    [contents, daoState, navigate, userRefresh],
  );

  const handleSearchChange = e => {
    const txt = e.target.value;
    setSearchValue(txt);
    const re = new RegExp(_.escapeRegExp(txt), 'i');
    const isMatch = result => re.test(result.name);
    setSearchResults(_.filter(contents, isMatch));
  };

  // eslint-disable-next-line react/prop-types
  const resultRenderer = ({ name, address }) => (
    <SearchLabel
      content={`${name} DAO`}
      onClick={() => {
        if (daoState !== 'hasValue') return;
        localStorage.setItem(DAO_NAME, name);
        localStorage.setItem(DAO_REG_ADDR, address);
        userRefresh();
        navigate(`/proposals/${name}`);
      }}
    />
  );

  return {
    sortType,
    userRefresh,
    userInfo,
    sortDropdownClick,
    handleDaoClick,
    daoList,
    daoState,
    searchResults,
    searchValue,
    handleSearchChange,
    resultRenderer,
  };
}
