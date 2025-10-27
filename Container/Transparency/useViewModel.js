import { useEffect, useState, useMemo, useCallback } from 'react';
import DefaultProfile from 'images/default_profile.png';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetListHolders,
  useProposalAccountList,
  useSbtCount,
  useVoteAccountCount,
  useSbtAccountCount,
  useGetKlayProfit,
  useProposalCount,
  useProposalAccountCount,
  useGetTransactionCount,
} from 'hooks/useGetStatistics';

import { useGetListMembers } from 'hooks/useGetMembers';
import { useGetPolicies, useGetTotalProposals } from 'hooks/useGetProposals';

import bankContract from 'services/contracts/bank';
import proposalManagerContract from 'services/contracts/proposals/proposalManager';
import daoFactoryContract from 'services/contracts/daoFactory';
import profileContract from 'services/contracts/profile';
import daoRegistryContract from 'services/contracts/daoRegistry';
import contract from 'services/contract';
import { PROPOSAL_STATUS } from 'utils/constants';

export function useViewModel() {
  const { daoname } = useParams();

  const navigate = useNavigate();
  const { caver } = window;
  const [daoMembers, setDaoMembers] = useState([]);
  const [holders, setHolders] = useState([]);
  const [detailProposals, setDetailProposals] = useState({
    total: 0,
    active: [],
    finished: [],
  });

  const [balanceLoading, setBalanceLoading] = useState(false);
  const [policies, setPolicies] = useState({
    header: ['Policy name', 'Value'],
    data: [],
  });
  const [policiesLoading, setPoliciesLoading] = useState(false);
  const [balanceData, setBalanceData] = useState({
    totalSupply: { symbol: 'Total supply', amount: 0 },
    balance: { symbol: 'Total supply', amount: 0 },
  });

  const [klayBalance, setKlayBalance] = useState({
    symbol: 'KLAY Balance',
    amount: 0,
  });

  const { data: holderData, isLoading: isHoldersLoading } = useGetListHolders(
    daoname,
  );
  const { data: member, isLoading: isMemberLoading } = useGetListMembers(
    daoname,
  );
  const [memberLoading, setMemberLoading] = useState(false);
  const { data: policiesData } = useGetPolicies();

  const { data: totalProposals } = useGetTotalProposals();

  const { data: proposalAccounts } = useProposalAccountList();
  const { data: proposalCount } = useProposalCount(daoname);
  const { data: propsoalAccountsCount } = useProposalAccountCount();
  const { data: transactionCount } = useGetTransactionCount();
  const { data: totalVoter } = useVoteAccountCount();
  const { data: totalSbt } = useSbtCount();
  const { data: totalSbtAccount } = useSbtAccountCount();
  const { data: klayProfit } = useGetKlayProfit();

  const getDaoMembers = async () => {
    const list = [];
    setMemberLoading(true);
    if (isMemberLoading) return;

    for await (const account of member) {
      try {
        const profile = await profileContract.getProfile(account);

        list.push({ account, profile });
      } catch (e) {
        // NOTE: 프로필 설정이 되어있지 않은 계정은 에러를 반환해서 continue로 처리하고 default image로 설정
        list.push({ account, profile: DefaultProfile });
        // eslint-disable-next-line no-continue
        continue;
      }
    }

    setDaoMembers(list);
    setMemberLoading(false);
  };

  const getHolders = async () => {
    const list = [];
    if (!holderData || holderData.length === 0) return;

    for await (const account of holderData) {
      try {
        const profile = await profileContract.getProfile(account);
        list.push({ account, profile });
      } catch (e) {
        // NOTE: 프로필 설정이 되어있지 않은 계정은 에러를 반환해서 continue로 처리하고 default image로 설정
        list.push({ account, profile: DefaultProfile });
        // eslint-disable-next-line no-continue
        continue;
      }
    }

    setHolders(list);
  };

  const getPolicies = async () => {
    setPoliciesLoading(true);
    if (!policiesData) return;

    const pData = [];
    for (const name of policiesData) {
      const value = await proposalManagerContract.getPolicy(name);
      pData.push([name, value]);
    }
    setPolicies({ ...policies, data: pData });
    setPoliciesLoading(false);
  };

  const getBalance = async () => {
    setBalanceLoading(true);
    const res = await bankContract.totalSupply();
    const b = await bankContract.contractBalance();

    const klay = await daoFactoryContract.getContractBalance(daoname);
    // const Regklay = await daoRegistryContract.getContractBalance();
    const contractKlay = parseInt(caver.utils.convertFromPeb(klay, 'KLAY'), 10);
    const totalSupply = parseInt(caver.utils.convertFromPeb(res, 'KLAY'), 10);
    const balance = parseInt(caver.utils.convertFromPeb(b, 'KLAY'), 10);

    setBalanceData({
      totalSupply: {
        symbol: 'Total supply',
        amount: totalSupply.toLocaleString('ko-KR'),
      },
      balance: { symbol: 'Balance', amount: balance.toLocaleString('ko-KR') },
    });

    setKlayBalance({
      symbol: 'KLAY Balance',
      amount: contractKlay.toLocaleString('ko-KR'),
    });
    setBalanceLoading(false);
  };

  const getDetailProposal = useCallback(async () => {
    if (!totalProposals) return;

    const list = [];

    try {
      for (const { uuid } of totalProposals) {
        const propData = await proposalManagerContract.getProposal(uuid);
        const voters = await proposalManagerContract.getParticipants(uuid);
        propData.votes = voters.length;
        list.push(propData);
      }
    } catch (e) {
      console.log(e);
    }

    const activeData = list.filter(p => p.status === PROPOSAL_STATUS.ACTIVE);
    const finishedData = list.filter(
      p => p.status === PROPOSAL_STATUS.FINISHED,
    );

    setDetailProposals({
      total: proposalCount,
      active: activeData,
      finished: finishedData,
    });
  }, [proposalCount, totalProposals]);

  useEffect(() => {
    (async () => {
      const isDao = await contract.isExistDao(daoname);
      if (!isDao) {
        navigate('/error');
      }
    })();
  }, [daoname, navigate]);

  useEffect(() => {
    getDaoMembers();
    getHolders();
    return () => {
      getDaoMembers();
      getHolders();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member, holderData, daoname]);

  useEffect(() => {
    getDetailProposal();
    return () => getDetailProposal();
  }, [getDetailProposal, proposalCount]);

  useEffect(() => {
    getPolicies();
    return () => getPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policiesData]);

  useEffect(() => {
    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const proposedPolicies = useMemo(() => {
    if (!detailProposals) {
      return {
        header: ['category', 'Policy name', 'Value'],
        data: [],
      };
    }

    const policyP = detailProposals.active
      .filter(item => item.type > 0)
      .map(({ policyName, policyValue }) => [policyName, policyValue]);

    return {
      header: ['category', 'Policy name', 'Value'],
      data: policyP,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailProposals.active]);

  const statisticsData = useMemo(() => {
    const data = {
      transactions: transactionCount || 0,
      proposals: proposalCount || 0,
      proposers: propsoalAccountsCount || 0,
      votes: totalVoter || 0,
      sbts: totalSbt || 0,
      sbtAccounts: totalSbtAccount || 0,
    };

    return data;
  }, [
    transactionCount,
    proposalCount,
    propsoalAccountsCount,
    totalVoter,
    totalSbt,
    totalSbtAccount,
  ]);

  const klayProfitData = useMemo(
    () => ({
      symbol: 'KLAY profilt',
      amount: klayProfit,
    }),
    [klayProfit],
  );

  return {
    balanceLoading,
    klayBalance,
    klayProfitData,
    detailProposals,
    holders,
    isHoldersLoading,
    daoMembers,
    memberLoading,
    policies,
    policiesLoading,
    balanceData,
    proposedPolicies,
    statisticsData,
  };
}
