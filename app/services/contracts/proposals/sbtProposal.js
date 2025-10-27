import { v4 as c } from 'uuid';
import { Contract, EXTENSIONS } from '../../contract';

class SbtProposalContract extends Contract {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  async setUriProposalComment(uuid, contents) {
    const data = await this.loadExtContract(EXTENSIONS.SBTPROPOSAL);

    return await this.send(data, 'setComment', [uuid, contents]);
  }

  async getUriProposalComments(uuid, contents) {
    const data = await this.loadExtContract(EXTENSIONS.SBTPROPOSAL);

    return await this.call(data, 'getComment', [uuid, contents]);
  }

  async getUriProposalParticipants(uuid) {
    const data = await this.loadExtContract(EXTENSIONS.SBTPROPOSAL);

    return await this.call(data, 'getParticipants', [uuid]);
  }

  async getUriProposalAccepters(uuid) {
    const data = await this.loadExtContract(EXTENSIONS.SBTPROPOSAL);

    return await this.call(data, 'getAccepters', [uuid]);
  }

  async getUriProposalRejecters(uuid) {
    const data = await this.loadExtContract(EXTENSIONS.SBTPROPOSAL);

    return await this.call(data, 'getRejecters', [uuid]);
  }

  async getUriProposal(uuid) {
    const data = await this.loadExtContract(EXTENSIONS.SBTPROPOSAL);

    return await this.call(data, 'getProposal', [uuid]);
  }

  async getUriProposalStructure(uuid) {
    const data = await this.loadExtContract(EXTENSIONS.SBTPROPOSAL);

    return await this.call(data, 'getProposalStructure', [uuid]);
  }

  async getUriProposalVoterValue(uuid) {
    const data = await this.loadExtContract(EXTENSIONS.SBTPROPOSAL);

    return await this.call(data, 'getVoterValue', [uuid]);
  }

  async submitUriProposal(proposal, uri) {
    const data = await this.loadExtContract(EXTENSIONS.SBTPROPOSAL);
    const uuid = c();

    return await this.send(data, 'submitUriProposal', [
      uuid,
      uri,
      JSON.stringify({
        uuid,
        type: proposal.type,
        title: proposal.title,
        category: proposal.category,
        policyValue: proposal.policyValue,
        policyName: proposal.policyName,
      }),
    ]);
  }

  async acceptUriProposal(uuid, value, comments) {
    const data = await this.loadExtContract(EXTENSIONS.SBTPROPOSAL);
    return await this.send(data, 'voteUriProposal', [
      uuid,
      true,
      value,
      comments,
    ]);
  }

  async rejectUriProposal(uuid, value, comments) {
    const data = await this.loadExtContract(EXTENSIONS.SBTPROPOSAL);
    return await this.send(data, 'voteUriProposal', [
      uuid,
      false,
      value,
      comments,
    ]);
  }
}

const sbtProposalContract = new SbtProposalContract();

export default sbtProposalContract;
