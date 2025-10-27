import { useQuery } from 'react-query';
import memberContract from '../services/contracts/member';

export function useGetListMembers(daoname) {
  return useQuery(
    ['list-members', daoname],
    async () => await memberContract.listMembers(),
  );
}

export function useGetIsMember(daoname) {
  return useQuery(
    ['is-member', daoname],
    async () => await memberContract.isMember(),
  );
}
