import { Contract, EXTENSIONS } from '../contract';

class MemberContract extends Contract {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  // Member extension methods
  async listMembers() {
    const cont = await this.loadExtContract(EXTENSIONS.MEMBER);
    return await this.call(cont, 'listMembers');
  }

  async isMember(address) {
    const cont = await this.loadExtContract(EXTENSIONS.MEMBER);
    return await this.call(cont, 'isMember', [
      address || window.klaytn.selectedAddress,
    ]);
  }
}

const memberContract = new MemberContract();

export default memberContract;
