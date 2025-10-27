import { useMemo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRecoilValueLoadable } from 'recoil';
import NotFound from 'components/NotFoundPage';
import { useProposalCount } from 'hooks/useGetStatistics';
import contract from 'services/contract';
import { proposalListState, useRecoilCacheRefresh, userState } from 'states';

import { PROPOSAL_STATUS } from 'utils/constants';

export function useViewModel(daoname, queryString) {
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState('LATEST');
  const [proposals, setProposals] = useState([]);

  const navigate = useNavigate();

  const { contents: userInfo } = useRecoilValueLoadable(userState);
  const {
    data: proposalCount,
    isLoading: isProposalCountLoading,
  } = useProposalCount(daoname);

  const {
    contents: proposalList,
    state: proposalState,
  } = useRecoilValueLoadable(proposalListState(daoname));

  const refetchProposals = useRecoilCacheRefresh(proposalListState(daoname));

  useEffect(() => {
    (async () => {
      const isDao = await contract.isExistDao(daoname);
      if (!isDao) {
        navigate('/error');
      }
    })();

    if (proposalState === 'loading' || isProposalCountLoading) return;

    if (proposalList.length !== Number(proposalCount)) {
      refetchProposals();
    }

    if (proposalState === 'hasValue') {
      setProposals(proposalList);
    }
  }, [
    daoname,
    isProposalCountLoading,
    navigate,
    proposalCount,
    proposalList,
    proposalState,
    refetchProposals,
  ]);

  const sortDropdownClick = useCallback(
    e => {
      const txt = e.target.innerText;
      if (txt === sortType) return;

      setSortType(txt);
      const p = [...proposals];
      if (txt === 'LATEST') {
        const DESC = p.sort((a, b) => b.timestamp - a.timestamp);
        setProposals(DESC);
      } else {
        const ASC = p.sort((a, b) => a.timestamp - b.timestamp);
        setProposals(ASC);
      }
    },
    [proposals, sortType],
  );

  const filtedProposals = useMemo(() => {
    setLoading(true);
    if (proposals.length === 0) {
      setLoading(false);
      return [];
    }
    let result = proposals;
    if (queryString.status === PROPOSAL_STATUS.ACTIVE) {
      const activeProposal = proposals.filter(
        p => p.status === PROPOSAL_STATUS.ACTIVE,
      );
      result = activeProposal;
    } else if (queryString.status === PROPOSAL_STATUS.FINISHED) {
      const finished = proposals.filter(
        p => p.status === PROPOSAL_STATUS.FINISHED,
      );
      result = finished;
    }

    setLoading(false);
    return result;
  }, [proposals, queryString.status]);

  const isLoading = useMemo(
    () => loading || isProposalCountLoading || proposalState !== 'hasValue',
    [isProposalCountLoading, loading, proposalState],
  );

  return {
    sortType,
    isLoading,
    filtedProposals,
    userInfo,
    sortDropdownClick,
    proposalList,
    proposalState,
  };
}
