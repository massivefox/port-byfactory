/* eslint-disable camelcase */
import { useRecoilRefresher_UNSTABLE } from 'recoil';

export * from './userStates';
export * from './proposalStates';
export * from './memberStates';

export const useRecoilCacheRefresh = state => {
  const refresher = useRecoilRefresher_UNSTABLE(state);
  return refresher;
};
