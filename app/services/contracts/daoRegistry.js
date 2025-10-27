import { Contract, EXTENSIONS } from '../contract';

// TODO: factory extensions 로드
class DaoRegistryContract extends Contract {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  async getContractBalance() {
    await this.loadExtContract(EXTENSIONS.DAOFACTORY);
    return await this.call(this.daoRegistry, 'getBalance');
  }

  async getDaoOwner(daoname) {
    await this.loadExtContract(EXTENSIONS.DAOFACTORY, daoname);
    return await this.call(this.daoRegistry, 'owner');
  }
}

const daoRegistryContract = new DaoRegistryContract();

export default daoRegistryContract;
