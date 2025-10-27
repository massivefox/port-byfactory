import { useQuery } from 'react-query';
import bankContract from '../services/contracts/bank';

export function useGetTotalSupply() {
  return useQuery(
    ['total-supply'],
    async () => await bankContract.totalSupply(),
  );
}
