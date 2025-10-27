import config from '../config';
import * as b from './backend';
import * as appType from '../config/appType';
import { STORAGE_KEYS } from '../storage';

const daoFactoryAddress = config.contract.daoFactory;
export const EXTENSIONS = {
  DAOFACTORY: 'DAOFACTORY',
  COMMUNITYPROPOSAL: 'COMMUNITYPROPOSAL',
  CONFIGURATIONPROPOSAL: 'CONFIGURATIONPROPOSAL',
  SBTPROPOSAL: 'SBTPROPOSAL',
  BANK: 'BANK',
  PROPOSALMANAGER: 'PROPOSALMANAGER',
  DAOSTATISTICS: 'DAOSTATISTICS',
  STATISTICS: 'STATISTICS',
  PROFILE: 'PROFILE',
  PROPOSAL: 'PROPOSAL',
  MEMBER: 'MEMBER',
};
export class Contract {
  constructor() {
    this.init();
    this.loadContracts();
  }

  async init() {
    // DAO Facotry 데이터 호출
    const daoName = localStorage.getItem(STORAGE_KEYS.DAO_NAME);
    this.daoName = daoName;
    await this.loadDaoFactory();

    if (daoName) {
      await this.loadDaoRegistry(daoName);
      const ext = await this.extensions();
      const contracts = {};

      for (let i = 0; i < ext.length; i++) {
        const name = ext[i].name.toLowerCase();
        const abi = await b.getABI(name);

        if (!localStorage.getItem(`${name}.address`)) {
          localStorage.setItem(
            `${name}.address`,
            ext[i].address || ext[i].addr,
          );
        }

        contracts[name] = {
          address: ext[i].address || ext[i].addr,
          abi,
        };
      }

      this.contracts = contracts;
    }
  }

  async loadContracts() {
    let ext = await this.extensions();

    // FIXME: Add handler location path
    if (
      window.location.pathname !== '/' &&
      window.location.pathname !== '/create/dao'
    ) {
      const daoAddress = localStorage.getItem(STORAGE_KEYS.DAO_REG_ADDR);

      const contract = window.caver.contract.create(
        this.daoRegistry.abi,
        daoAddress,
      );
      ext = await contract.methods.extensions().call();
    }

    const contracts = {};

    for (let i = 0; i < ext.length; i++) {
      const name = ext[i].name.toLowerCase();
      const data = await b.getABI(name);

      contracts[name] = {
        address: ext[i].address || ext[i].addr,
        abi: data.abi,
      };
    }

    this.contracts = contracts;
  }

  async loadExtContract(extName, dao) {
    const daoName = localStorage.getItem(STORAGE_KEYS.DAO_NAME);

    if (!daoName) {
      return null;
    }

    if (daoName !== dao) {
      await this.loadDaoRegistry(dao);
    } else {
      await this.loadDaoRegistry();
    }

    if (this.daoName !== daoName) {
      this.daoName = daoName;
    }

    const daoRegistryAddress = await this.call(
      this.daofactory,
      'addressOfDao',
      [daoName],
    );

    this.daoRegistry = {
      name: daoName,
      address: daoRegistryAddress,
      abi: this.daoRegistry.abi,
    };

    const extAddr = await this.getExtensionAddress(extName);

    const abi = await b.getABI(extName);
    const contract = {
      address: extAddr,
      abi,
    };

    return contract;
  }

  async loadDaoFactory() {
    const abi = await b.getABI('DaoFactory');

    if (!this.daofactory) {
      this.daofactory = {
        address: daoFactoryAddress,
        abi,
      };
    }
  }

  async loadDaoRegistry(dao) {
    await this.loadDaoFactory();

    let daoRegistryAddress;

    const abi = await b.getABI('daoregistry');

    if (dao) {
      daoRegistryAddress = await this.call(this.daofactory, 'addressOfDao', [
        dao,
      ]);

      this.daoRegistry = {
        name: dao,
        address: daoRegistryAddress,
        abi,
      };
    } else if (!this.daoRegistry) {
      const daoName = localStorage.getItem(STORAGE_KEYS.DAO_NAME);

      if (daoName) {
        daoRegistryAddress = await this.call(this.daofactory, 'addressOfDao', [
          daoName,
        ]);

        this.daoRegistry = {
          name: daoName,
          address: daoRegistryAddress,
          abi,
        };
      }
    }
  }

  async call(contract, methodName, args) {
    if (!contract) return;

    try {
      const c = new window.caver.klay.Contract(contract.abi, contract.address);
      const method = c.methods[methodName];

      let res;
      if (args?.length > 0) {
        res = await method(...args).call({
          from: window.klaytn.selectedAddress,
        });
      } else {
        res = await method().call({
          from: window.klaytn.selectedAddress,
        });
      }
      // console.log(`${methodName}(${args}) = `, res);

      return res;
    } catch (e) {
      console.log(`${contract.address}: ${methodName}(${args}) = `, e);
      // throw (`${contract.address}: ${methodName}(${args}) = `, e);
    }
  }

  async send(contract, value, methodName, args) {
    try {
      await this.loadContracts();
      const c = new window.caver.klay.Contract(contract.abi, contract.address);
      const method = c.methods[methodName];

      let d;
      if (args?.length > 0) {
        d = await method(...args);
      } else {
        d = await method();
      }
      const data = await d.encodeABI();
      const signedTransaction = await window.caver.klay.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        to: contract.address,
        from: window.klaytn.selectedAddress,
        value,
        gas: methodName !== 'deployDao' ? 100000000 : 100000000,
        data,
      });

      const senderRawTransaction = signedTransaction.rawTransaction;
      const res = await b.sendTransaction(senderRawTransaction);
      // console.log('send result:', methodName, res.data);

      return res.data;
    } catch (e) {
      // console.log('send error:', contract, methodName, args, e);
      throw ('send error:', contract, methodName, args, e);
    }
  }

  /**
   * dao명에 따라 daoFactory 에서 executeFunction method를 실행하여
   * daoRegistry -> extension contract 순으로 함수 실행
   *
   * @param {*} extName 확장 contract 명
   * @param {*} methodName contract method 명
   * @param {*} args method 인자 값
   * @param {*} value msg.value
   */
  async execute(extName, methodName, args, value = 0) {
    try {
      const daoName = localStorage.getItem(STORAGE_KEYS.DAO_NAME);
      const registryAddr = await this.call(this.daofactory, 'addressOfDao', [
        daoName,
      ]);
      await this.loadDaoRegistry(daoName);
      const regABI = await b.getABI('daoRegistry');
      const c = new window.caver.klay.Contract(regABI, registryAddr);

      let method;
      if (Number(value) > 0) {
        method = c.methods.executePayableFunction;
      } else {
        method = c.methods.executeFunction;
      }

      let d;
      if (args?.length > 0) {
        d = await method(extName, methodName, args);
      } else {
        d = await method(extName, methodName);
      }

      const data = d.encodeABI();
      const signedTransaction = await window.caver.klay.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        to: registryAddr,
        from: window.klaytn.selectedAddress,
        value,
        gas: '8500000',
        data,
      });

      const senderRawTransaction = signedTransaction.rawTransaction;
      const res = await b.sendTransaction(senderRawTransaction);
      // console.log('send result:', methodName, res.data);

      return res.data;
    } catch (e) {
      throw ('send error:', contract, methodName, args, e);
    }
  }

  // DAO Registry methods
  async extensions() {
    await this.loadDaoRegistry();
    const res = await this.call(this.daoRegistry, 'extensions');
    if (!res) return [];

    return res.map(([name, revision, address]) => ({
      name,
      revision,
      address,
    }));
  }

  // Get extension method address
  async getExtensionAddress(extName) {
    const res = await this.call(this.daoRegistry, 'addressOfExtension', [
      extName.toUpperCase(),
    ]);
    return res;
  }

  async isExistDao(daoName) {
    await this.loadDaoFactory();
    const daoRegistryAddress = await this.call(
      this.daofactory,
      'addressOfDao',
      [daoName],
    );

    return !!daoRegistryAddress;
  }
}

export function initContract() {
  contract = new Contract();
}

// NOTE: 컨트랙트를 호출하는 곳이 있어 다시 살려둠.
const contract = new Contract();

export default contract;
