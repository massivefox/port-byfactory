export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

export const PROPOSAL_TYPE = {
  NEW_FUND: '새로운 펀드 제안',
  NEW_DEAL: '새로운 딜 제안',
  VC: '투자 심사 제안',
  ETC: '기타',
  LEGACY_POLICY: 'DAO policy 제안',
  NEW_POLICY: 'New policy 제안',
};

export const PROPOSAL_STATUS = {
  FINISHED: 'FINISHED',
  ACTIVE: 'ACTIVE',
};

export const PROPOSAL_PASS = {
  PASSED: 'PASSED',
  REJECTED: 'REJECTED',
};

// upload 최대 50mb까지 허용
export const MAX_FILE_SIZE = 1024 * 1024 * 50;
