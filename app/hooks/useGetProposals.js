import { useQuery } from 'react-query';

import proposalContract from '../services/contracts/proposals/proposal';
import proposalManagerContract from '../services/contracts/proposals/proposalManager';

export function useGetPolicies() {
  return useQuery(
    ['get-policies'],
    async () => await proposalManagerContract.getPolicies(),
  );
}

export function useGetPolicy(policyName) {
  return useQuery(
    ['get-policy', policyName],
    async () => await proposalManagerContract.getPolicy(policyName),
  );
}

export function useGetListProposals() {
  return useQuery(
    ['get-proposals'],
    async () => await proposalManagerContract.listProposals(),
  );
}

export function useGetProposal(id) {
  return useQuery(
    ['get-proposal', id],
    async () => await proposalManagerContract.getProposal(id),
  );
}

export function useGetParticipants(id) {
  return useQuery(
    ['get-participants', id],
    async () => await proposalManagerContract.getParticipants(id),
  );
}

export function useGetAccepters(id) {
  return useQuery(
    ['get-accepters', id],
    async () => await proposalManagerContract.getAccepters(id),
  );
}

export function useGetRejecters(id) {
  return useQuery(
    ['get-rejecters', id],
    async () => await proposalManagerContract.getRejecters(id),
  );
}

export function useGetComments(id) {
  return useQuery(
    ['get-coments', id],
    async () => await proposalManagerContract.getComments(id),
  );
}

export function useGetVoterRmValue(id) {
  return useQuery(
    ['get-voter-value', id],
    async () => await proposalManagerContract.getVoterRemainedValue(id),
  );
}

export function useGetTotalProposals(daoName) {
  return useQuery(
    ['get-total-proposal', daoName],
    async () => await proposalManagerContract.getTotalProposals(),
  );
}
