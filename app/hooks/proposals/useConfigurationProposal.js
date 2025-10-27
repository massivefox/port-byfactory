import { useQuery } from 'react-query';
import configurationProposalContract from '../../services/contracts/proposals/configurationProposal';

export function useGetConfigurationProposals() {
  return useQuery(
    ['list-config-proposals'],
    async () =>
      await configurationProposalContract.listConfigurationProposals(),
  );
}

export function useGetConfigurationProposal(uuid) {
  return useQuery(
    ['get-config-proposal', uuid],
    async () =>
      await configurationProposalContract.getConfigurationProposal(uuid),
  );
}
