import { useQuery } from 'react-query';
import statContract from '../services/contracts/statistics';

export function useGetTokenHolders() {
  return useQuery(
    ['number-of-holders'],
    async () => await statContract.getNumberOfHolders(),
  );
}

export function useGetListHolders(daoname) {
  return useQuery(
    ['list-holders', daoname],
    async () => await statContract.getListHolders(),
  );
}

export function useGetRmTokenCount() {
  return useQuery(
    ['rm-token-count'],
    async () => await statContract.getRmTokenCount(),
  );
}

export function useGetKlayProfit() {
  return useQuery(
    ['klay-profit'],
    async () => await statContract.getKlayProfit(),
  );
}

export function useGetTransactionCount() {
  return useQuery(
    ['tx-count'],
    async () => await statContract.getTransactionCount(),
  );
}

export function useProposalCount(daoName) {
  return useQuery(
    ['proposal-count', daoName],
    async () => await statContract.proposalCount(daoName),
  );
}

export function useProposalAccountCount() {
  return useQuery(
    ['proposal-account-count'],
    async () => await statContract.proposalAccountCount(),
  );
}

export function useProposalAccountList() {
  return useQuery(
    ['proposal-account-list'],
    async () => await statContract.proposalAccountList(),
  );
}

export function useVoteAccountCount() {
  return useQuery(
    ['vote-account-count'],
    async () => await statContract.voteAccountCount(),
  );
}

export function useVoteAccountList() {
  return useQuery(
    ['vote-account-list'],
    async () => await statContract.voteAccountList(),
  );
}

export function useSbtCount() {
  return useQuery(['sbt-count'], async () => await statContract.sbtCount());
}

export function useSbtAmount() {
  return useQuery(['sbt-amount'], async () => await statContract.sbtAmount());
}

export function useSbtAccountCount() {
  return useQuery(
    ['sbt-account-count'],
    async () => await statContract.sbtAccountCount(),
  );
}

export function useSbtAccountList() {
  return useQuery(
    ['sbt-account-list'],
    async () => await statContract.sbtAccountList(),
  );
}
