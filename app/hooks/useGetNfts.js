import { useInfiniteQuery, useQuery } from 'react-query';
import { getTokensFromAddress } from '../services/backend';
import profileContract from '../services/contracts/profile';

export function useGetAccountContract(address) {
  return useInfiniteQuery(
    ['contract', address],
    ({ pageParam }) => getTokensFromAddress(address, { cursor: pageParam }),
    {
      enabled: address !== undefined,
      getNextPageParam: lastPage => lastPage.cursor || false,
    },
  );
}

export function useGetDefaultProfile() {
  return useQuery(
    ['get-default-profile'],
    async () => await profileContract.getDefaultProfile(),
  );
}
