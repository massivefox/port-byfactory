import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import contract from 'services/contract';
import { useRecoilValueLoadable } from 'recoil';
import { memberListState, useRecoilCacheRefresh } from 'states';

export function useViewModel() {
  const { daoname } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  console.log('a', members);
  const { contents: memberData, state: memberState } = useRecoilValueLoadable(
    memberListState(daoname),
  );
  const refetchMember = useRecoilCacheRefresh(memberListState(daoname));
  useEffect(() => {
    (async () => {
      const isDao = await contract.isExistDao(daoname);
      if (!isDao) {
        navigate('/error');
      }
    })();
  }, [daoname, navigate]);

  useEffect(() => {
    refetchMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      if (memberState === 'hasValue') {
        setMembers(memberData);
      }
    })();
  }, [memberData, memberState, refetchMember]);

  const loading = useMemo(() => memberState === 'loading', [memberState]);

  return {
    members,
    loading,
  };
}
