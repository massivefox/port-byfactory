import { Contract, EXTENSIONS } from '../contract';

class StatisticsContract extends Contract {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  async handleProposalAdd() {
    const params = window.caver.abi.encodeParameters(
      ['address'],
      [window.klaytn.selectedAddress],
    );

    return await this.execute(
      EXTENSIONS.STATISTICS,
      'handleProposalAdd',
      params,
    );
  }

  async handleVoteAdd() {
    const params = window.caver.abi.encodeParameters(
      ['address'],
      [window.klaytn.selectedAddress],
    );

    return await this.execute(EXTENSIONS.STATISTICS, 'handleVoteAdd', params);
  }

  async getNumberOfHolders() {
    const cont = await this.loadExtContract(EXTENSIONS.STATISTICS);
    const res = await this.call(cont, 'numberOfHolders');
    return res;
  }

  async getListHolders() {
    const cont = await this.loadExtContract(EXTENSIONS.STATISTICS);
    const res = await this.call(cont, 'listHolders');
    return res;
  }

  async getRmProposalTokenCount() {
    const cont = await this.loadExtContract(EXTENSIONS.STATISTICS);
    return await this.call(cont, 'rmProposalTokenCount');
  }

  async getRmVoteTokenCount() {
    const cont = await this.loadExtContract(EXTENSIONS.STATISTICS);
    return await this.call(cont, 'rmVoteTokenCount');
  }

  async getKlayProfit() {
    const cont = await this.loadExtContract(EXTENSIONS.STATISTICS);
    return await this.call(cont, 'klayProfit');
  }

  async getTransactionCount() {
    const cont = await this.loadExtContract(EXTENSIONS.STATISTICS);
    return await this.call(cont, 'transactionCount');
  }

  async proposalCount(daoName) {
    const cont = await this.loadExtContract(EXTENSIONS.STATISTICS, daoName);
    return await this.call(cont, 'proposalCount');
  }

  async proposalAccountCount() {
    const cont = await this.loadExtContract(EXTENSIONS.STATISTICS);
    return await this.call(cont, 'proposalAccountCount');
  }

  async proposalAccountList() {
    const cont = await this.loadExtContract(EXTENSIONS.STATISTICS);
    return await this.call(cont, 'proposalAccountList');
  }

  async voteAccountCount() {
    const cont = await this.loadExtContract(EXTENSIONS.STATISTICS);
    return await this.call(cont, 'voteAccountCount');
  }

  async voteAccountList() {
    const cont = await this.loadExtContract(EXTENSIONS.STATISTICS);
    return await this.call(cont, 'voteAccountList');
  }

  async sbtCount() {
    const cont = await this.loadExtContract(EXTENSIONS.STATISTICS);
    return await this.call(cont, 'sbtCount');
  }

  async sbtAmount() {
    const cont = await this.loadExtContract(EXTENSIONS.STATISTICS);
    return await this.call(cont, 'sbtAmount');
  }

  async sbtAccountCount() {
    const cont = await this.loadExtContract(EXTENSIONS.STATISTICS);
    return await this.call(cont, 'sbtAccountCount');
  }

  async sbtAccountList() {
    const cont = await this.loadExtContract(EXTENSIONS.STATISTICS);
    return await this.call(cont, 'sbtAccountList');
  }
}

const statContract = new StatisticsContract();

export default statContract;
