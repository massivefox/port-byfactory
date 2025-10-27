import { Contract, EXTENSIONS } from '../../contract';

// TODO: proposalmanager extension들은 나중에 여기로 옮겨서 사용.
export class ProposalManagerContract extends Contract {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  async listProposals(contractAddress) {
    const cont = await this.loadExtContract(EXTENSIONS.PROPOSALMANAGER);
    const res = await this.call(cont, 'contractListProposals', [
      contractAddress,
    ]);

    return res.map(el => JSON.parse(el));
  }

  async getTotalProposals() {
    const cont = await this.loadExtContract(EXTENSIONS.PROPOSALMANAGER);
    const res = await this.call(cont, 'getTotalProposals');
    return res.map(el => JSON.parse(el));
  }

  async getPagenationProposals(page, pageSize) {
    const cont = await this.loadExtContract(EXTENSIONS.PROPOSALMANAGER);
    const res = this.call(cont, 'getPagenationProposals', [page, pageSize]);

    return res.map(el => JSON.parse(el));
  }

  async getProposal(uuid) {
    const cont = await this.loadExtContract(EXTENSIONS.PROPOSALMANAGER);
    const res = await this.call(cont, 'getProposal', [uuid]);

    const proposal = JSON.parse(res[2]);
    Object.assign(proposal, {
      proposalType: res[0],
      proposer: res[1],
      status: res[3] ? 'FINISHED' : 'ACTIVE',
      passed: res[4] ? 'PASSED' : 'REJECTED',
      timestamp: Number(res[5]),
      finishedAt: Number(res[6]),
      acceptedPowers: Number(res[7]),
      rejectedPowers: Number(res[8]),
    });

    return proposal;
  }

  async getPolicies() {
    const cont = await this.loadExtContract(EXTENSIONS.PROPOSALMANAGER);
    return await this.call(cont, 'getPolicies');
  }

  async getPolicy(policyName) {
    const cont = await this.loadExtContract(EXTENSIONS.PROPOSALMANAGER);
    return await this.call(cont, 'getPolicy', [policyName]);
  }

  async getProposedPolicy(uuid) {
    const cont = await this.loadExtContract(EXTENSIONS.PROPOSALMANAGER);
    return await this.call(cont, 'getProposedPolicy', [uuid]);
  }

  async getParticipants(uuid) {
    const cont = await this.loadExtContract(EXTENSIONS.PROPOSALMANAGER);
    return await this.call(cont, 'getParticipants', [uuid]);
  }

  async getAccepters(uuid) {
    const cont = await this.loadExtContract(EXTENSIONS.PROPOSALMANAGER);
    return await this.call(cont, 'getAccepters', [uuid]);
  }

  async getRejecters(uuid) {
    const cont = await this.loadExtContract(EXTENSIONS.PROPOSALMANAGER);
    return await this.call(cont, 'getRejecters', [uuid]);
  }

  async getComments(uuid) {
    const cont = await this.loadExtContract(EXTENSIONS.PROPOSALMANAGER);
    return await this.call(cont, 'getComment', [uuid]);
  }

  async mintSBT(user, tokenId, quantity) {
    const cont = await this.loadExtContract(EXTENSIONS.PROPOSALMANAGER);
    return await this.send(cont, 'mintSBT', [user, tokenId, quantity]);
  }

  async getVoterRemainedValue(uuid) {
    const cont = await this.loadExtContract(EXTENSIONS.PROPOSALMANAGER);
    return await this.call(cont, 'getVoterValue', [uuid]);
  }
}

const proposalManagerContract = new ProposalManagerContract();
export default proposalManagerContract;
