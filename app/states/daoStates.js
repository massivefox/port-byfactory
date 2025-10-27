import { selector } from 'recoil';
import { v1 } from 'uuid';
import { getABI } from '../services/backend';
import contract, { EXTENSIONS } from '../services/contract';
import daoFactoryContract from '../services/contracts/daoFactory';

export const daoListState = selector({
  key: `daoListState-${v1()}`,
  get: async () => {
    const daoList = await daoFactoryContract.getDaoNameList();

    const daoAddrList = await daoFactoryContract.getDaoAddressList();

    const registryABI = await getABI('daoRegistry');
    const memberABI = await getABI('member');
    const statABI = await getABI('statistics');

    const m = [];
    for await (const [index, daoAddress] of daoAddrList.entries()) {
      const daoRegistry = {
        name: daoList[index],
        address: daoAddress,
        abi: registryABI,
      };

      const memberExtAddress = await contract.call(
        daoRegistry,
        'addressOfExtension',
        [EXTENSIONS.MEMBER],
      );
      const statisticsAddress = await contract.call(
        daoRegistry,
        'addressOfExtension',
        [EXTENSIONS.STATISTICS],
      );

      const statExt = {
        address: statisticsAddress,
        abi: statABI,
      };

      const memberExt = {
        address: memberExtAddress,
        abi: memberABI,
      };

      // FIXME: contract 생성자 계정을 registry 컨트랙트에서 받아와야될지 고민.
      // 현재는 daoFactory가 contract owner로 되어있음.
      const owner = await contract.call(statExt, 'owner');

      const result = await contract.call(memberExt, 'listMembers');

      const proposalCount = await contract.call(statExt, 'proposalCount');

      m.push({
        name: daoList[index],
        address: daoAddress,
        members: result.length,
        proposals: proposalCount,
      });
    }
    return m;
  },
});
