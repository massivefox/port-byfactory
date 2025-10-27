import { atom, selector } from 'recoil';
import DefaultProfile from 'images/default_profile.png';
import { v1 } from 'uuid';
import { getKlayBalance } from '../services/caver';
import bankContract from '../services/contracts/bank';
import memberContract from '../services/contracts/member';
import profileContract from '../services/contracts/profile';
const { klaytn } = window;

export const accountState = atom({
  key: `accountState-${v1()}`,
  default: klaytn?.selectedAddress,
});

export const profileState = atom({
  key: `profileState-${v1()}`,
  default: selector({
    key: `profileSelector-${v1()}`,
    get: async ({ get }) => {
      let profile = DefaultProfile;
      try {
        profile = await profileContract.getProfile(get(accountState));
      } catch (e) {
        console.log('get profile error', e);
      }
      return profile;
    },
  }),
});

export const balanceState = atom({
  key: `balanceState-${v1()}`,
  default: selector({
    key: `balanceSelector-${v1()}`,
    get: async ({ get }) => {
      let balance = 0;
      try {
        balance = parseInt(
          await bankContract.getTokenBalance(get(accountState)),
          10,
        );
      } catch (e) {
        console.log('get balance error', e);
      }
      return balance;
    },
  }),
});

export const klayBalanceState = atom({
  key: `klayBalanceState-${v1()}`,
  default: selector({
    key: `klayBalanceSelector-${v1()}`,
    get: async ({ get }) => {
      let balance = 0;
      try {
        balance = await getKlayBalance(get(accountState));
      } catch (e) {
        console.log('get klay balance error', e);
      }
      return balance;
    },
  }),
});

export const memberState = atom({
  key: `memberState-${v1()}`,
  default: selector({
    key: `memberSelector-${v1()}`,
    get: async ({ get }) => {
      let isMember = false;
      try {
        isMember = await memberContract.isMember(get(accountState));
      } catch (e) {
        console.log('get isMember error', e);
      }
      return isMember;
    },
  }),
});

export const userState = selector({
  key: `userState-${v1()}`,
  get: ({ get }) => {
    const userObj = {
      address: get(accountState),
      profile: get(profileState),
      balance: get(balanceState),
      klay: get(klayBalanceState),
      isMember: get(memberState),
    };

    return userObj;
  },
});

export const networkState = atom({
  key: `networkState-${v1()}`,
  default: klaytn?.networkVersion,
});
