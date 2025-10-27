import { Contract, EXTENSIONS } from '../contract';

class DaoStatisticsContract extends Contract {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  async getVoteToken() {
    const cont = this.loadExtContract(EXTENSIONS.DAOSTATISTICS);
    const res = await this.call(cont, 'getVoteToken');
    return res;
  }

  async getProposalToken() {
    const cont = this.loadExtContract(EXTENSIONS.DAOSTATISTICS);
    const res = await this.call(cont, 'getProposalToken');
    return res;
  }

  async getKlayProfit() {
    const cont = this.loadExtContract(EXTENSIONS.DAOSTATISTICS);
    const res = await this.call(cont, 'getKlayProfit');
    return res;
  }

  async getTransactionCount() {
    const cont = this.loadExtContract(EXTENSIONS.DAOSTATISTICS);
    const res = await this.call(cont, 'getTransactionCount');
    return res;
  }
}

const daoStatContract = new DaoStatisticsContract();

export default daoStatContract;
