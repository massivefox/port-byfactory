/**
 *
 * ProposalSubmit
 *
 */

import './style.css';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Form, Menu } from 'semantic-ui-react';
import { useNavigate, useParams } from 'react-router-dom';
import wrap from 'components/BaseApp/wrap';
import { useGetListMembers } from 'hooks/useGetMembers';
import contract from 'services/contract';
import proposalManagerContract from 'services/contracts/proposals/proposalManager';
import { policiesTextInfo } from 'utils/textUtil';
import makeSelectProposalSubmit from './selectors';
import reducer from './reducer';
import saga from './saga';
import * as a from './actions';
import { CommunityProposal, ConfigProposal } from './ProposalTypes';
const contractName = 'abcdao';

export function ProposalSubmit({ rootState, loadContractData }) {
  useInjectReducer({ key: 'proposalSubmit', reducer });
  useInjectSaga({ key: 'proposalSubmit', saga });

  const { daoname } = useParams();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('community');
  const [policies, setPolicies] = useState({});
  const [lowerMembers, setLowerMembers] = useState([]);
  const { data: member } = useGetListMembers();

  useEffect(() => {
    (async () => {
      const isDao = await contract.isExistDao(daoname);
      if (!isDao) {
        navigate('/error');
      }
    })();
  }, [daoname, navigate]);

  useEffect(() => {
    if (rootState.contractData === undefined) {
      loadContractData(contractName);
    }
  }, [loadContractData, rootState.contractData]);
  useEffect(() => {
    const init = async () => {
      const policiesName = await proposalManagerContract.getPolicies();
      const policiesArr = [];

      for await (const [index, name] of policiesName.entries()) {
        const value = await proposalManagerContract.getPolicy(name);
        const lowerMember = await member.map(function(upperMember) {
          return upperMember.toLowerCase();
        });
        setLowerMembers(lowerMember);
        policiesArr.push({
          index,
          key: name,
          text: `${name} (${policiesTextInfo[name].desc})`,
          value,
        });
      }

      setPolicies(policiesArr);
    };
    init();
  }, [member]);

  // TODO: shows charge page if it is not enough.
  return (
    <div>
      <ByMenu pointing secondary>
        <Menu.Item
          name="Community Proposal"
          active={activeMenu === 'community'}
          onClick={() => setActiveMenu('community')}
        />
        <Menu.Item
          name="Configuration Proposal"
          active={activeMenu === 'config'}
          onClick={() => setActiveMenu('config')}
        />
      </ByMenu>

      {activeMenu === 'community' && (
        <CommunityProposal members={lowerMembers} />
      )}

      {activeMenu === 'config' && (
        <ConfigProposal policies={policies} members={lowerMembers} />
      )}
    </div>
  );
}

ProposalSubmit.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  rootState: PropTypes.object,
  loadContractData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  rootState: makeSelectProposalSubmit(),
  title: () => 'Submit Proposal',
  description: () =>
    'DAO에서 언제든지 새로운 제안을 만들고 제출할 수 있습니다.\n단, 여러분이 속한 DAO의 규칙에 따라 제안 제출시에는 일정량 이상의 토큰을 필요로 합니다.',
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    // eslint-disable-next-line no-shadow
    loadContractData: contractName => {
      dispatch(a.emitLoadContractData(contractName));
    },
  };
}

export default wrap(mapStateToProps, mapDispatchToProps, ProposalSubmit);

export const Description = styled.div`
  margin: 10px auto 30px;
`;

export const ByForm = styled(Form)`
  & .field {
    margin: 0 0 35px !important;
  }

  input,
  textarea,
  .dropdown,
  .text,
  .menu {
    // color: rgb(50, 50, 50) !important;
    background-color: rgb(8, 34, 53) !important;
  }
`;

export const SelectFileWrapper = styled.div`
  margin-bottom: 50px;
`;

export const FileInput = styled.div`
  label {
    padding: 6px 25px;
    background-color: var(--biyard);
    border-radius: 4px;
    color: white;
    cursor: pointer;
  }

  input[type='file'] {
    display: none;
  }
`;

export const ByMenu = styled(Menu)`
  & * {
    color: #000000 !important;
  }
`;
