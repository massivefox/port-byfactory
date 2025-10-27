import axios from 'axios';
import { atom, atomFamily, selectorFamily } from 'recoil';
import DefaultProfile from 'images/default_profile.png';
import { v1 } from 'uuid';
import { getABI } from '../services/backend';
import contract, { EXTENSIONS } from '../services/contract';
import proposalManagerContract from '../services/contracts/proposals/proposalManager';
import { PROPOSAL_STATUS } from '../utils/constants';
import { changeIpfsToHttps, isIpfsUrl } from '../utils/nft';

export const refetchTrigger = atom({
  key: `trigger-${v1()}`,
  default: 0,
});

export const proposalState = atomFamily({
  key: 'proposalsState',
  default: selectorFamily({
    key: 'proposalsSelector',
    get: filter => async ({ get }) => {
      get(refetchTrigger);
      let proposalList = [];
      try {
        const p = await proposalManagerContract.listProposals();
        for (const { uuid } of p) {
          const proposalData = await proposalManagerContract.getProposal(uuid);

          const voters = await proposalManagerContract.getParticipants(uuid);
          proposalData.votes = voters.length;
          proposalList.push(proposalData);
        }
      } catch (e) {
        console.log(e);
      }

      proposalList = proposalList.reverse();

      if (filter === PROPOSAL_STATUS.ACTIVE) {
        proposalList = proposalList.filter(
          p => p.status === PROPOSAL_STATUS.ACTIVE,
        );
      } else if (filter === PROPOSAL_STATUS.FINISHED) {
        proposalList = proposalList.filter(
          p => p.status === PROPOSAL_STATUS.FINISHED,
        );
      }

      return proposalList;
    },
  }),
});

export const proposalListState = selectorFamily({
  key: `proposalListSelector-${v1()}`,
  get: daoName => async () => {
    await contract.loadDaoRegistry(daoName);

    const profileExtAddress = await contract.call(
      contract.daoRegistry,
      'addressOfExtension',
      [EXTENSIONS.PROFILE],
    );
    const profileABI = await getABI(EXTENSIONS.PROFILE);

    const profileExt = {
      address: profileExtAddress,
      abi: profileABI,
    };

    const pmExtAddress = await contract.call(
      contract.daoRegistry,
      'addressOfExtension',
      [EXTENSIONS.PROPOSALMANAGER],
    );

    const pmABI = await getABI(EXTENSIONS.PROPOSALMANAGER);

    const pmExt = {
      address: pmExtAddress,
      abi: pmABI,
    };

    const res = await contract.call(pmExt, 'getTotalProposals');

    const propos = res.map(el => JSON.parse(el));

    const proposalList = [];

    for (const { uuid } of propos) {
      const p = await contract.call(pmExt, 'getProposal', [uuid]);
      const proposal = JSON.parse(p[2]);
      Object.assign(proposal, {
        proposalType: p[0],
        proposer: p[1],
        status: p[3] ? 'FINISHED' : 'ACTIVE',
        passed: p[4] ? 'PASSED' : 'REJECTED',
        timestamp: Number(p[5]),
        finishedAt: Number(p[6]),
        acceptedPowers: Number(p[7]),
        rejectedPowers: Number(p[8]),
      });

      const voters = await contract.call(pmExt, 'getParticipants', [uuid]);
      const comments = await contract.call(pmExt, 'getComment', [uuid]);
      proposal.votes = voters.length;
      proposal.comments = comments.length;

      let imageUri = DefaultProfile;

      try {
        let result;
        result = await contract.call(profileExt, 'getProfile', [
          proposal.proposer,
        ]);
        if (result) {
          if (isIpfsUrl(result)) {
            result = changeIpfsToHttps(result);
          }

          const meta = await axios.get(result);

          if (!meta.data?.image) return imageUri;
          if (isIpfsUrl(meta.data.image)) {
            imageUri = changeIpfsToHttps(meta.data.image);
          } else {
            imageUri = meta.data.image;
          }
        }
      } catch (error) {
        imageUri = DefaultProfile;
      }

      proposal.proposerImg = imageUri;
      proposalList.push(proposal);
    }

    return proposalList;
  },
});
