import { Contract, EXTENSIONS } from '../../contract';

class ConfigurationProposalContract extends Contract {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  async getConfigurationPolicies() {
    const cont = this.loadExtContract(EXTENSIONS.CONFIGURATIONPROPOSAL);
    return await this.call(cont, 'getPolicies');
  }

  async getConfigurationPolicy(policyName) {
    const cont = this.loadExtContract(EXTENSIONS.CONFIGURATIONPROPOSAL);
    return await this.call(cont, 'getPolicy', [policyName]);
  }

  async getConfigurationComments(uuid) {
    const cont = this.loadExtContract(EXTENSIONS.CONFIGURATIONPROPOSAL);
    return await this.call(cont, 'getComment', [uuid]);
  }

  async setConfigurationComment(uuid, content) {
    const params = window.caver.abi.encodeParameters(
      ['string', 'string'],
      [uuid, JSON.stringify(content)],
    );

    return await this.execute(
      EXTENSIONS.CONFIGURATIONPROPOSAL,
      'setComment',
      params,
    );
  }

  async getConfigurationParticipants(uuid) {
    const cont = this.loadExtContract(EXTENSIONS.CONFIGURATIONPROPOSAL);
    return await this.call(cont, 'getParticipants', [uuid]);
  }

  async getConfigurationAccepters(uuid) {
    const cont = this.loadExtContract(EXTENSIONS.CONFIGURATIONPROPOSAL);
    return await this.call(cont, 'getAccepters', [uuid]);
  }

  async getConfigurationVoterValue(uuid) {
    const cont = this.loadExtContract(EXTENSIONS.CONFIGURATIONPROPOSAL);
    return await this.call(cont, 'getVoterValue', [uuid]);
  }

  async getConfigurationRejecters(uuid) {
    const cont = this.loadExtContract(EXTENSIONS.CONFIGURATIONPROPOSAL);
    return await this.call(cont, 'getRejecters', [uuid]);
  }

  async listConfigurationProposals() {
    const cont = this.loadExtContract(EXTENSIONS.CONFIGURATIONPROPOSAL);
    const res = await this.call(cont, 'listProposals', []);

    return res.map(el => JSON.parse(el));
  }

  async getConfigurationProposal(uuid) {
    const cont = this.loadExtContract(EXTENSIONS.CONFIGURATIONPROPOSAL);
    const res = await this.call(cont, 'getProposal', [uuid]);

    const proposal = JSON.parse(res[2]);
    proposal.proposalType = res[0];
    proposal.proposer = res[1];
    proposal.status = res[3] ? 'FINISHED' : 'ACTIVE';
    proposal.passed = res[4] ? 'PASSED' : 'REJECTED';
    proposal.timestamp = Number(res[5]);
    proposal.finishedAt = Number(res[6]);
    proposal.acceptedPowers = Number(res[7]);
    proposal.rejectedPowers = Number(res[8]);
    return proposal;
  }

  async getConfigurationProposalStructure(uuid) {
    const cont = this.loadExtContract(EXTENSIONS.CONFIGURATIONPROPOSAL);
    return await this.call(cont, 'getProposalStructure', [uuid]);
  }

  async submitConfigurationProposal(proposal, uuid) {
    const params = window.caver.abi.encodeParameters(
      ['string', 'uint256', 'string', 'string', 'string', 'uint256', 'uint256'],
      [
        uuid,
        proposal.type,
        JSON.stringify({
          uuid,
          type: proposal.type,
          title: proposal.title,
          category: proposal.category,
          policyValue: proposal.policyValue,
          policyName: proposal.policyName,
        }),
        JSON.stringify({
          uuid,
          ...proposal,
        }),
        proposal.policyName,
        proposal.policyValue,
        proposal.finishedAt,
      ],
    );

    return await this.execute(
      EXTENSIONS.CONFIGURATIONPROPOSAL,
      'submitPolicyProposal',
      params,
    );
  }

  async getConfigurationProposedPolicy(uuid) {
    const cont = this.loadExtContract(EXTENSIONS.CONFIGURATIONPROPOSAL);
    return await this.call(cont, 'getProposedPolicy', [uuid]);
  }

  async acceptConfigurationProposal(uuid, value, comments) {
    const params = window.caver.abi.encodeParameters(
      ['string', 'bool', 'uint256', 'string'],
      [
        uuid,
        true,
        value,
        comments !== '' ? JSON.stringify(comments) : comments,
      ],
    );

    return await this.execute(
      EXTENSIONS.CONFIGURATIONPROPOSAL,
      'votePolicyProposal',
      params,
    );
  }

  async rejectConfigurationProposal(uuid, value, comments) {
    const params = window.caver.abi.encodeParameters(
      ['string', 'bool', 'uint256', 'string'],
      [
        uuid,
        false,
        value,
        comments !== '' ? JSON.stringify(comments) : comments,
      ],
    );

    return await this.execute(
      EXTENSIONS.CONFIGURATIONPROPOSAL,
      'votePolicyProposal',
      params,
    );
  }
}

const configurationProposalContract = new ConfigurationProposalContract();

export default configurationProposalContract;
