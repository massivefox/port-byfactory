import { selectorFamily } from 'recoil';
import { v1 } from 'uuid';

import memberContract from 'services/contracts/member';
import profileContract from 'services/contracts/profile';
import daoRegistryContract from 'services/contracts/daoRegistry';
import proposalContract from 'services/contracts/proposals/proposal';

export const memberListState = selectorFamily({
  key: `memberListState`,
  get: daoName => async () => {
    const owner = await daoRegistryContract.getDaoOwner(daoName);
    const members = await memberContract.listMembers();

    const list = [];
    for await (const account of members) {
      try {
        const memberInfo = {};
        const profile = await profileContract.getProfile(account, daoName);
        const res = await proposalContract.loadSbts(account, daoName);
        if (account.toLowerCase() === owner.toLowerCase()) {
          Object.assign(memberInfo, {
            isOwner: true,
          });
        }

        Object.assign(memberInfo, {
          address: account,
          profile,
          activities: res,
        });

        list.push(memberInfo);
      } catch (e) {
        // eslint-disable-next-line no-continue
        continue;
      }
    }

    return list;
  },
});
