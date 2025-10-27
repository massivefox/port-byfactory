import { Contract, EXTENSIONS } from '../../contract';

export class ProposalContract extends Contract {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  // FIXME: SBT extension should be split from ProposalManager
  //        this function is for admin.
  async loadSbts(address, dao) {
    // FIXME: loading proper images and one call for all SBTs.

    const cont = await this.loadExtContract(EXTENSIONS.STATISTICS, dao);

    const proposal = await this.call(cont, 'sbtAmount', [1]);
    const voting = await this.call(cont, 'sbtAmount', [2]);
    const comments = await this.call(cont, 'sbtAmount', [3]);

    const ret = [];
    if (proposal !== '0') {
      ret.push({
        name: 'Proposal',
        image:
          'https://metadata-store.klaytnapi.com/c037a7b8-06e3-3c54-c1a7-579ee86aecc5/6426ab34-cc38-7154-06b0-b4042e51d4a6.png',
        value: proposal,
      });
    }

    if (voting !== '0') {
      ret.push({
        name: 'Voting',
        image:
          'https://metadata-store.klaytnapi.com/c037a7b8-06e3-3c54-c1a7-579ee86aecc5/1380e716-667f-ce57-1c33-ed8dc19d8f45.png',
        value: voting,
      });
    }

    if (comments !== '0') {
      ret.push({
        name: 'Discussion',
        image:
          'https://metadata-store.klaytnapi.com/c037a7b8-06e3-3c54-c1a7-579ee86aecc5/4b83ed76-0bd4-6309-a27e-096967ea4138.png',
        value: comments,
      });
    }

    return ret;
  }
}

const proposalContract = new ProposalContract();
export default proposalContract;
