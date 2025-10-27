import axios from 'axios';
import { Contract, EXTENSIONS } from '../contract';
import * as b from '../backend';
import config from '../../config';
const { url } = config;

// TODO: factory extensions 로드
const extensionStateConstant = [
  'COMMUNITYPROPOSALSTATE',
  'CONFIGURATIONPROPOSALSTATE',
  'BANKSTATE',
  'DAOSTATISTICSSTATE',
  'PROFILESTATE',
  'MEMBERSTATE',
  'PROPOSALSTATE',
  'PROPOSALMANAGERSTATE',
  'SBTPROPOSALSTATE',
  'STATISTICSSTATE',
  'NONTRANSFERABLEKIP37STATE',
  'STANDARDNFTSTATE',
];
const extensionsConstant = [
  'COMMUNITYPROPOSAL',
  'CONFIGURATIONPROPOSAL',
  'BANK',
  'DAOSTATISTICS',
  'PROFILE',
  'MEMBER',
  'PROPOSAL',
  'PROPOSALMANAGER',
  'SBTPROPOSAL',
  'STATISTICS',
  'NONTRANSFERABLEKIP37',
  'STANDARDNFT',
];
class DaoFactoryContract extends Contract {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  async factoryLoadContract(address) {
    if (!this.daoRegistry) {
      this.daoRegistry = await b.getDaoContract('daoregistry');
    }

    const contract = window.caver.contract.create(
      this.daoRegistry.abi,
      address,
    );

    const ext = await contract.methods.extensions().call();

    const contracts = {};

    for (let i = 0; i < ext.length; i++) {
      const name = ext[i].name.toLowerCase();
      const data = await b.getContractData(name);
      if (!localStorage.getItem(name)) {
        localStorage.setItem(
          name,
          JSON.stringify({
            address: ext[i].address,
            abi: data.abi,
          }),
        );
      }

      contracts[name] = {
        address: ext[i].address,
        abi: data.abi,
      };
    }
    this.contracts = contracts;
  }

  // FIXME: contract 호출로 변경
  async deployDao(dao) {
    await this.loadDaoFactory();

    const params = {
      strings: [
        dao.name,
        dao.symbol,
        dao.symbol,
        'https://metadata-store.klaytnapi.com/e4232b30-80b5-052b-4c6a-f9726b4a02d5/factory-sbt/{id}.json',
        dao.name,
        dao.symbol,
        'https://metadata-store.klaytnapi.com/e4232b30-80b5-052b-4c6a-f9726b4a02d5/factory-sbt/{id}.json',
        'https://metadata-store.klaytnapi.com/e4232b30-80b5-052b-4c6a-f9726b4a02d5/factory-sbt/{id}.json',
        'https://metadata-store.klaytnapi.com/e4232b30-80b5-052b-4c6a-f9726b4a02d5/factory-sbt/{id}.json',
        'https://metadata-store.klaytnapi.com/e4232b30-80b5-052b-4c6a-f9726b4a02d5/factory-sbt/{id}.json',
      ],
      numbers: [
        window.caver.utils.toPeb(1, 'KLAY'),
        window.caver.utils.toPeb(1, 'KLAY'),
        window.caver.utils.toPeb(1, 'KLAY'),
      ],
      bools: [false, true, true, true, true, true, true, true, true, true],
      addresses: [
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
      ],
      addType: dao.proposalTypes,
    };
    try {
      await this.send(
        this.daofactory,
        window.caver.utils.toPeb(1, 'KLAY'),
        'initializeDao',
        [params.strings[0]],
      );
      const registryAddr = await this.call(this.daofactory, 'addressOfDao', [
        params.strings[0],
      ]);
      const regABI = await b.getABI('daoRegistry');
      for (let i = 0; i < extensionStateConstant.length; i += 1) {
        await this.send(this.daofactory, 0, 'addExtensionToDao', [
          params.strings[0],
          extensionStateConstant[i],
          extensionsConstant[i],
          params,
        ]);
      }
      await this.send(this.daofactory, 0, 'setReady', [
        params.strings[0],
        true,
      ]);
      await this.send(
        { address: registryAddr, abi: regABI },
        0,
        'setPermissionPerOnce',
      );
      await this.send(this.daofactory, 0, 'connectInterface', [
        extensionsConstant,
        params.strings[0],
      ]);
    } catch (e) {
      console.log('extErr', e);
    }
  }

  async deployDaoRegistry(name) {
    await this.loadDaoFactory();
    return await this.send(this.daofactory, 'deployDaoRegistry', [name]);
  }

  async getDaoRegistryAddress(name) {
    await this.loadDaoFactory();
    const res = await this.call(this.daofactory, 'getDaoRegistryAddress', [
      name,
    ]);
    return res;
  }

  async getDaoAddressList() {
    await this.loadContracts();
    await this.loadDaoFactory();

    const res = await this.call(this.daofactory, 'listDaos');
    console.log('asd', res);

    return res[1];
  }

  async getDaoNameList() {
    await this.loadDaoFactory();
    const res = await this.call(this.daofactory, 'listDaos');
    return res[0];
  }

  async getContractBalance(daoName) {
    await this.loadDaoFactory();
    const registryAddr = await this.call(this.daofactory, 'addressOfDao', [
      daoName,
    ]);
    const regABI = await b.getABI('daoRegistry');
    return await this.call(
      { address: registryAddr, abi: regABI },
      'getBalance',
    );
  }
}

const daoFactoryContract = new DaoFactoryContract();

export default daoFactoryContract;
