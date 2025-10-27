import { Contract, EXTENSIONS } from '../../contract';
class CommunityProposalContract extends Contract {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  async getCommunityPolicies() {
    const cont = await this.loadExtContract(EXTENSIONS.COMMUNITYPROPOSAL);
    return await this.call(cont, 'getPolicies');
  }

  async getCommunityPolicy(policyName) {
    const cont = await this.loadExtContract(EXTENSIONS.COMMUNITYPROPOSAL);
    return await this.call(cont, 'getPolicy', [policyName]);
  }

  async getCommunityComments(uuid) {
    const cont = await this.loadExtContract(EXTENSIONS.COMMUNITYPROPOSAL);
    return await this.call(cont, 'getComment', [uuid]);
  }

  async setCommunityComment(uuid, content) {
    const params = window.caver.abi.encodeParameters(
      ['string', 'string'],
      [uuid, JSON.stringify(content)],
    );

    return await this.execute(
      EXTENSIONS.COMMUNITYPROPOSAL,
      'setComment',
      params,
    );
  }

  async getCommunityParticipants(uuid) {
    const cont = await this.loadExtContract(EXTENSIONS.COMMUNITYPROPOSAL);
    return await this.call(cont, 'getParticipants', [uuid]);
  }

  async getCommunityAccepters(uuid) {
    const cont = await this.loadExtContract(EXTENSIONS.COMMUNITYPROPOSAL);
    return await this.call(cont, 'getAccepters', [uuid]);
  }

  async getCommunityVoterValue(uuid) {
    const cont = await this.loadExtContract(EXTENSIONS.COMMUNITYPROPOSAL);
    return await this.call(cont, 'getVoterValue', [uuid]);
  }

  async getCommunityRejecters(uuid) {
    const cont = await this.loadExtContract(EXTENSIONS.COMMUNITYPROPOSAL);
    return await this.call(cont, 'getRejecters', [uuid]);
  }

  async listCommunityProposals() {
    const cont = await this.loadExtContract(EXTENSIONS.COMMUNITYPROPOSAL);
    const res = await this.call(cont, 'listProposals', []);

    return res.map(el => JSON.parse(el));
  }

  async getCommunityProposal(uuid) {
    const cont = await this.loadExtContract(EXTENSIONS.COMMUNITYPROPOSAL);
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

  async getCommunityProposalStructure(uuid) {
    const cont = await this.loadExtContract(EXTENSIONS.COMMUNITYPROPOSAL);
    return await this.call(cont, 'getProposalStructure', [uuid]);
  }

  async submitCommunityProposal(proposal, uuid) {
    await this.loadContracts();

    const params = window.caver.abi.encodeParameters(
      ['string', 'string', 'string', 'string', 'uint256'],
      [
        uuid,
        JSON.stringify({
          uuid,
          title: proposal.title,
          category: proposal.category,
          policyValue: proposal.policyValue,
          policyName: proposal.policyName,
        }),
        JSON.stringify({
          uuid,
          ...proposal,
        }),
        proposal.category,
        proposal.finishedAt,
      ],
    );

    return await this.execute(
      EXTENSIONS.COMMUNITYPROPOSAL,
      'submitCommunityProposal',
      params,
    );
  }

  async acceptCommunityProposal(uuid, value, comments) {
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
      EXTENSIONS.COMMUNITYPROPOSAL,
      'voteCommunityProposal',
      params,
    );
  }

  async rejectCommunityProposal(uuid, value, comments) {
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
      EXTENSIONS.COMMUNITYPROPOSAL,
      'voteCommunityProposal',
      params,
    );
  }

  async getProposalTypeList(daoname) {
    const cont = await this.loadExtContract(
      EXTENSIONS.COMMUNITYPROPOSAL,
      daoname,
    );
    return await this.call(cont, 'proposalTypeList');
  }

  async getIsEnabledComment(daoname) {
    const cont = await this.loadExtContract(
      EXTENSIONS.COMMUNITYPROPOSAL,
      daoname,
    );
    return await this.call(cont, 'getEnabledCommentCheck');
  }

  async getIsEnabledPublicComment(daoname) {
    const cont = await this.loadExtContract(
      EXTENSIONS.COMMUNITYPROPOSAL,
      daoname,
    );
    return await this.call(cont, 'getPublicCommentCheck');
  }
}

const communityProposalContract = new CommunityProposalContract();

export default communityProposalContract;
