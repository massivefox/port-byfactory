import { Contract, EXTENSIONS } from '../contract';

class BankContract extends Contract {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  async totalSupply() {
    const cont = await this.loadExtContract(EXTENSIONS.BANK);
    return await this.call(cont, 'totalSupply');
  }

  async contractBalance() {
    const cont = await this.loadExtContract(EXTENSIONS.BANK);
    return await this.call(cont, 'balanceOf', [cont.address]);
  }

  async getTokenBalance() {
    const cont = await this.loadExtContract(EXTENSIONS.BANK);

    const pebBalance = await this.call(cont, 'balanceOf', [
      window.klaytn.selectedAddress,
    ]);
    const balance = window.caver.utils.fromPeb(pebBalance || '0', 'KLAY');

    return balance;
  }

  async claimTokens(redeem) {
    const params = window.caver.abi.encodeParameters(['string'], [redeem]);
    return await this.execute(EXTENSIONS.BANK, 'claimTokens', params);
  }

  async buyTokens(quantity) {
    const params = window.caver.abi.encodeParameters(['uint256'], [quantity]);

    return await this.execute(
      EXTENSIONS.BANK,
      'buyTokens',
      params,
      window.caver.utils.toPeb(quantity, 'KLAY'),
    );
  }
}

const bankContract = new BankContract();

export default bankContract;
