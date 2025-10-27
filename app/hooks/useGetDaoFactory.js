import { useQuery } from 'react-query';
import daoFactoryContract from '../services/contracts/daoFactory';

export function useGetDaoRegistryAddress(name) {
  return useQuery(
    ['dao-facotry-address', name],
    async () => await daoFactoryContract.getDaoRegistryAddress(name),
  );
}

export function useGetDaoAddressList() {
  return useQuery(
    ['dao-address-list'],
    async () => await daoFactoryContract.getDaoAddressList(),
  );
}

export function useGetDaoNameList() {
  return useQuery(
    ['dao-name-list'],
    async () => await daoFactoryContract.getDaoNameList(),
  );
}
