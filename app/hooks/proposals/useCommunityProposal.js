import { useQuery } from 'react-query';
import communityProposalContract from '../../services/contracts/proposals/communityProposal';

export function useGetCommunityProposals() {
  return useQuery(
    ['list-community-proposals'],
    async () => await communityProposalContract.listCommunityProposals(),
  );
}

export function useGetCommunityProposal(uuid) {
  return useQuery(
    ['get-community-proposal', uuid],
    async () => await communityProposalContract.getCommunityProposal(uuid),
  );
}

export function useGetCommunityProposalTypes(doaname) {
  return useQuery(
    ['get-community-proposal-type', doaname],
    async () => await communityProposalContract.getProposalTypeList(doaname),
  );
}

export function useGetIsEnabledComment(doaname) {
  return useQuery(
    ['get-enabled-comment', doaname],
    async () => await communityProposalContract.getIsEnabledComment(doaname),
  );
}

export function useGetIsEnabledPublicComment(doaname) {
  return useQuery(
    ['get-enabled-public-comment', doaname],
    async () => await communityProposalContract.getIsEnabledComment(doaname),
  );
}
