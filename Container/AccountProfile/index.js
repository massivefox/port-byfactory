/* eslint-disable no-continue */
/**
 *
 * AccountProfile
 *
 */

import React, { useRef, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as actions from 'components/BaseApp/actions';
import {
  Card,
  Button,
  Image,
  Modal,
  Grid,
  Dimmer,
  Loader,
  Header,
  Divider,
  Input as SeInput,
  Container,
} from 'semantic-ui-react';
import DefaultProfile from 'images/default_profile.png';
import { createStructuredSelector } from 'reselect';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Input } from '@mui/material';
import {
  // eslint-disable-next-line camelcase
  useRecoilRefresher_UNSTABLE,
  useRecoilValueLoadable,
} from 'recoil';
import { sleep } from 'utils/time';
import {
  useRecoilCacheRefresh,
  balanceState,
  profileState,
  userState,
} from 'states';
import makeSelectAccountProfile from './selectors';
import reducer from './reducer';
import saga from './saga';
import { buyTokens, claimTokens } from './actions';
import * as baseAppSelector from '../../components/BaseApp/selectors';
import './style.css';
import { changeIpfsToHttps, isIpfsUrl } from '../../utils/nft';
import {
  BiyardButton,
  ByButton,
  ByOutlineButton2,
} from '../../components/Button/BiyardButton';
import wrap from '../../components/BaseApp/wrap';
import { byToast } from '../../components/Toast';
import { PageLoader } from '../../components/Loader/PageLoader';
import {
  useGetAccountContract,
  useGetDefaultProfile,
} from '../../hooks/useGetNfts';
import { useModal } from '../../hooks/Modal';
import InfoPopup from '../../components/Helper/InfoPopup';
import bankContract from '../../services/contracts/bank';
import proposalContract from '../../services/contracts/proposals/proposal';
import profileContract from '../../services/contracts/profile';
import { TpCard } from '../../components/Card/TransparencyCard';
import { ByModal } from '../../components/Modal';

const Wrapper = styled.div`
  flex-direction: column;
`;

const AccountCard = styled(TpCard)``;

const ProfileWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 50px;

  > div:first-child {
    flex: 1;

    div {
      margin-bottom: 20px;
    }
  }

  > div:last-child {
    display: flex;
    align-items: center;
    color: var(--biyard-header2);
    flex: 4 1 auto;
  }
  .profile-address {
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: var(--biyard-header2);
  }
`;

const RedeemInputWrapper = styled.div`
  display: flex;
  margin-bottom: 24px;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
`;

const RedeemInput = styled(SeInput)`
  flex: 4;
  input {
    border-radius: 12px !important;
  }
`;

const TokenInfoWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  .token-info {
    display: flex;
    gap: 20px;
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;

    color: var(--biyard-header2);
  }
`;

const SbtCardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
`;

const SbtCard = styled.div`
  padding: 14px;

  width: 31.8%;
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 12px;

  display: flex;
  flex-direction: column;

  .sbt-name {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    /* identical to box height */

    color: var(--biyard-header2);
    margin-bottom: 14px;
  }

  img {
    margin: 0 auto;
    max-width: 80% !important;
  }
`;

const NftSection = styled.div`
  padding: 10px 60px;
`;

export const NftCard = styled(Card)`
  // box-shadow: 0 2px 10px 0 rgb(34 36 38 / 15%) !important;

  box-shadow: none !important;

  .image {
    height: 120px !important;
    background: none !important;
  }
  .image > img {
    height: 100% !important;

    background: white;
    object-fit: contain;
    padding: 14px;
    border: 1px solid #bebebe !important;
    border-radius: 8px !important;
  }

  .nft-info-overlay {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover .nft-info-overlay {
    display: block !important;
  }

  .content {
    padding: 6px 10px !important;
  }

  .content > * {
    font-size: 13px !important;
  }
  .meta {
    font-size: 14px !important;
    line-height: 17px;

    color: #3c3c3c !important;
  }

  > :last-child {
    border: none !important;
  }
`;

const NftModal = styled(ByModal)`
  > .header .image {
    width: 166px;
    height: 127px;
    margin: 30px auto;
    object-fit: contain;
    padding: 14px;
    border-radius: 8px;
    background: #ececec;
  }

  .circular.image > img {
    width: 150px;
    height: 150px;
    margin: auto;
    object-fit: cover;
  }
`;

const ArrowButton = styled(Button)`
  border: none !important;
  box-shadow: none !important;
  background: #ecedf4 !important;
  width: 33px !important;
  height: 33px !important;
  margin: 0 !important;
  padding: 0 !important;

  .icon {
    font-size: 20px !important;
    vertical-align: middle !important;
  }
`;

const LeftArrowButton = styled(ArrowButton)`
  position: absolute;
  top: 440px;
  left: 24px;
`;

const RightArrowButton = styled(ArrowButton)`
  position: absolute;
  top: 440px;
  right: 24px;
`;

const BuyBodal = styled(ByModal)`
  .content-title {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 10px;

    color: var(--biyard-header2);
  }

  .content-value {
    font-weight: 500;
    font-size: 16px;
    line-height: 17px;

    color: #8e929b;
    margin-bottom: 32px;
  }

  .buy-max {
    cursor: pointer;
    font-weight: 700;
    font-size: 19px;
    line-height: 17px;
    text-align: right;

    color: #ff0000;
  }

  .buy-max:hover {
    font-weight: 700;
  }

  .buy-token-input {
    margin: 12px 24px 12px 0;
    width: 85%;
    font-size: 20px !important;
  }

  .buy-token-input > input {
    text-align: right;
    padding: 5px 10px;
  }

  .buy-token-modal-error {
    color: #ff2d55;
  }
  > .actions {
    display: flex;
    justify-content: center;

    button {
      margin: 0 !important;
      width: 120px;
    }
  }
`;

export function AccountProfile({ rootState, loadTokens }) {
  const { caver } = window;
  useInjectReducer({ key: 'accountProfile', reducer });
  useInjectSaga({ key: 'accountProfile', saga });

  const { daoname } = useParams();
  const redeemCodeRef = useRef();
  const { state, contents: userInfo } = useRecoilValueLoadable(userState);
  // const setProfile = useSetRecoilState(profileState(userInfo.address));
  const refetch = useRecoilRefresher_UNSTABLE(userState);
  const profileRefresh = useRecoilCacheRefresh(profileState);
  const balanceRefresh = useRecoilCacheRefresh(balanceState);

  const [isBuyModalOpen, openBuyModal, closeBuyModal] = useModal();

  const [count, setCount] = useState(0);

  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [userTokenID, setUserTokenID] = useState(1);
  const [contractAddr, setContractAddr] = useState(1);
  const [profileImage, setProfileImage] = useState('');
  const isDisabledByAmount = count > klayBalance;
  const [sbts, setSbts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [redeemCodeError, setRedeemCodeErr] = useState('');

  const {
    data: userNfts,
    hasNextPage,
    isFetching,
    isLoading,
    fetchNextPage,
  } = useGetAccountContract(userInfo.address);

  const { data: defaultProfile } = useGetDefaultProfile();

  const nftLoading = useMemo(() => isFetching || isLoading, [
    isFetching,
    isLoading,
  ]);

  const klayBalance = useMemo(() => {
    if (!userInfo?.klay) return 0;
    return Math.floor(parseFloat(userInfo.klay, 10) * 1000000) / 1000000;
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo.address) return;
    (async () => {
      const res = await proposalContract.loadSbts(userInfo.address);
      setSbts(res);
    })();
  }, [userInfo.address]);

  window.klaytn.on('accountsChanged', () => {
    setCurrentPage(1);
    setProfileImage('');
  });

  const handleMax = () => {
    setCount(Math.floor(klayBalance));
  };

  const handleChange = e => {
    const intValue = parseInt(e.currentTarget.value, 10);
    if (e.currentTarget.value.length === 0) {
      setCount(0);
    } else if (!isNaN(intValue)) {
      setCount(intValue);
    }
  };

  const handleBuyTokens = async () => {
    try {
      setPageLoading(true);
      await bankContract.buyTokens(count);
      byToast('Token purchase success.', 'success');
      closeBuyModal();
      setCount(0);
      loadTokens();
      refetch();
    } catch (e) {
      byToast('Token purchase failed.', 'error');
      console.log(e);
    }
    setPageLoading(false);
  };
  const handleClaimToken = async () => {
    setPageLoading(true);
    try {
      const redeemCode = redeemCodeRef.current.value;

      if (!redeemCode) {
        setRedeemCodeErr('Please input redeem code');
        setPageLoading(false);
        await sleep(3000);
        setRedeemCodeErr('');
        return;
      }
      await bankContract.claimTokens(redeemCode);
      redeemCodeRef.current.value = '';
      byToast('Token claim success.', 'success');
      loadTokens();
      balanceRefresh();
      refetch();
    } catch (error) {
      byToast('Token claim failed.', 'error');
      console.log(error);
    }

    setPageLoading(false);
  };
  const handleClaimTokenChange = async e => {
    redeemCodeRef.current.value = e.target.value;
  };
  const handleProfileModalOpen = async () => {
    setOpen(true);
  };

  const handleProfileApply = async () => {
    setLoading(true);
    try {
      await profileContract.setProfile(
        userInfo.address,
        contractAddr,
        userTokenID,
      );

      byToast('Profile has been changed.', 'success');
      profileRefresh();
      refetch();
    } catch (e) {
      console.log(e);
      byToast(`Profile change failed.\n${e}`, 'error');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleProfileChange = (tokenId, imageUri, contractAddress) => {
    setProfileImage(imageUri);
    setUserTokenID(tokenId);
    setContractAddr(contractAddress);
  };

  const handleProfileModalClose = () => {
    setOpen(false);
    setProfileImage('');
  };

  useEffect(() => {
    setLoading(true);
    const initMyNfts = async () => {
      if (nftLoading || userNfts === undefined || !defaultProfile) return;

      const nftData = [];

      if (currentPage === 1) {
        nftData.push({
          tokenID: 1,
          name: 'Default profile',
          imageUri: defaultProfile?.imageUri,
          compressedURL: defaultProfile?.imageUri,
          contractAddress: defaultProfile?.address,
        });
      }

      const { items } = userNfts.pages[currentPage - 1];

      if (items && items.length > 0) {
        for await (const { contractAddress, extras } of items) {
          try {
            let metaUri = extras.tokenUri;
            let imageUri = '';
            const kip17 = new caver.kct.kip17(contractAddress);
            const name = await kip17.name();

            if (isIpfsUrl(extras.tokenUri)) {
              metaUri = changeIpfsToHttps(extras.tokenUri);
              const metadata = await axios.get(metaUri);

              if (!metadata.data.image) {
                continue;
              }

              if (isIpfsUrl(metadata.data.image)) {
                imageUri = changeIpfsToHttps(metadata.data.image);
              } else {
                imageUri = metadata.data.image;
              }
            } else {
              const metadata = await axios.get(metaUri);
              imageUri = metadata.data.image;
              if (!metadata.data.image) {
                continue;
              }
            }

            const tokenID = caver.utils.hexToNumberString(extras.tokenId);
            nftData.push({
              tokenID,
              name,
              imageUri,
              contractAddress,
            });
          } catch (e) {
            // NOTE: CORS 이슈로 인해 이미지를 못불러와서 skip 하고 진행
            console.log(e);
          }
        }
      }

      setNfts(nftData);

      setLoading(false);
    };

    initMyNfts();
  }, [
    userNfts,
    nftLoading,
    currentPage,
    caver.kct.kip17,
    caver.utils,
    defaultProfile,
  ]);

  const userProfile = useMemo(() => {
    if (profileImage !== '') {
      return profileImage;
    }

    return userInfo.profile || DefaultProfile;
  }, [userInfo.profile, profileImage]);

  if (!rootState.isConnected) {
    return <div className="dcl page HomePage"> 로그인 후 이용해주세요</div>;
  }

  return (
    <Wrapper>
      <PageLoader loading={pageLoading} />
      <Container>
        <AccountCard fluid>
          <Card.Content>
            <Header>내 프로필 / 주소 정보</Header>
            <Divider />
            <ProfileWrapper>
              <div>
                <div>
                  <img
                    className="profile-Image"
                    src={userInfo.profile || DefaultProfile}
                    alt=""
                  />
                </div>
                <NftModal
                  onClose={handleProfileModalClose}
                  onOpen={handleProfileModalOpen}
                  closeIcon
                  open={open}
                  size="small"
                  trigger={
                    <ByOutlineButton2 style={{ width: '238px' }} fluid>
                      Edit profile
                    </ByOutlineButton2>
                  }
                >
                  <Modal.Header>
                    Set profile from your NFTs
                    <span>
                      <InfoPopup
                        content={
                          <div>
                            카이카스 지갑 계정이 보유하고 있는 NFT 목록에서
                            프로필 사진을 설정 할 수 있습니다.
                          </div>
                        }
                      />
                    </span>
                    <Image src={userProfile} />
                    <Divider />
                  </Modal.Header>
                  <Modal.Content>
                    <Dimmer active={nftLoading || loading} inverted>
                      <Loader />
                    </Dimmer>
                    <NftSection>
                      {nfts.length > 0 ? (
                        <Grid doubling columns={4} stackable>
                          {nfts.map(
                            (
                              {
                                imageUri, // compressedURL,
                                name,
                                tokenID,
                                contractAddress,
                              },
                              index,
                            ) => (
                              <Grid.Column key={`${index}-${name}-${tokenID}`}>
                                <NftCard
                                  raised
                                  link
                                  onClick={() =>
                                    handleProfileChange(
                                      tokenID,
                                      imageUri,
                                      contractAddress,
                                    )
                                  }
                                >
                                  <Image
                                    as="img"
                                    src={imageUri}
                                    wrapped
                                    ui={false}
                                  />
                                  <Card.Content>
                                    <Card.Header>{`# ${tokenID}`}</Card.Header>
                                    <Card.Meta className="card-desc">
                                      {name}
                                    </Card.Meta>
                                  </Card.Content>
                                </NftCard>
                              </Grid.Column>
                            ),
                          )}
                        </Grid>
                      ) : (
                        <>{!loading && <p>NFT가 존재 하지 않습니다.</p>}</>
                      )}
                    </NftSection>
                    {userNfts?.pages[0]?.items?.length > 0 && (
                      <>
                        <LeftArrowButton
                          icon="angle left"
                          disabled={currentPage <= 1}
                          onClick={() => {
                            setCurrentPage(currentPage - 1);
                          }}
                        />

                        <RightArrowButton
                          icon="angle right"
                          disabled={!hasNextPage}
                          onClick={() => {
                            if (currentPage >= userNfts.pages.length)
                              fetchNextPage();
                            setCurrentPage(currentPage + 1);
                          }}
                        />
                      </>
                    )}
                  </Modal.Content>
                  <Modal.Actions>
                    <ByOutlineButton2
                      content="취소"
                      onClick={handleProfileModalClose}
                    />

                    {nfts.length > 0 && (
                      <ByButton content="확인" onClick={handleProfileApply} />
                    )}
                  </Modal.Actions>
                </NftModal>
              </div>
              <div>
                <div className="profile-address">{userInfo.address}</div>
              </div>
            </ProfileWrapper>
          </Card.Content>
        </AccountCard>
        <RedeemInputWrapper>
          <RedeemInput
            ref={redeemCodeRef}
            name="redeem"
            type="text"
            onChange={handleClaimTokenChange}
            placeholder={redeemCodeError || 'Redeem code를 입력하세요.'}
          />
          <ByButton onClick={handleClaimToken}>Claim tokens</ByButton>
        </RedeemInputWrapper>

        <AccountCard fluid>
          <Card.Content>
            <Header> Token 보유 현황</Header>
            <Divider />
            <TokenInfoWrapper>
              <div className="token-info">
                <div className="mana-logo" />
                {userInfo.balance}
              </div>

              <ByButton content="BUY" onClick={openBuyModal} />
            </TokenInfoWrapper>
          </Card.Content>
        </AccountCard>

        <AccountCard fluid>
          <Card.Content>
            <Header>SBT 보유 현황</Header>
            <Divider />
            <SbtCardsWrapper>
              {sbts &&
                sbts.map((el, i) => (
                  <SbtCard key={`${i}=${el.value}`}>
                    <div className="sbt-name">
                      {el.name} x {el.value}
                    </div>
                    <img src={el.image} alt="" />
                  </SbtCard>
                ))}
            </SbtCardsWrapper>
          </Card.Content>
        </AccountCard>
      </Container>

      <BuyBodal
        size="tiny"
        closeIcon
        onClose={() => {
          closeBuyModal();
          setCount(0);
        }}
        onOpen={openBuyModal}
        open={isBuyModalOpen}
      >
        <Modal.Header>Buy DAO Tokens</Modal.Header>

        <Modal.Content>
          <Modal.Description>
            <p>
              카이카스 지갑 계정이 보유하고 있는 KLAY로 {daoname} DAO token을
              구매할 수 있습니다.
            </p>
            <p>1 KLAY = 1 {daoname} DAO token</p>
            <p>{daoname} DAO 토큰 구매시 수수료는 부과되지 않습니다.</p>
          </Modal.Description>
          <Divider />
        </Modal.Content>
        <Modal.Content style={{ paddingTop: 0 }}>
          <div className="content-title ">Account</div>
          <p className="content-value">{userInfo.address}</p>
          <div className="content-title">
            Balance (KLAY){' '}
            <span>
              <InfoPopup content="카이카스 지갑 계정이 보유하고 있는 KLAY 잔액입니다." />
            </span>
          </div>
          <p className="content-value">{klayBalance}</p>
          <div className="content-title">
            Amount ({daoname} DAO tokens)
            <span>
              <InfoPopup
                content={
                  <div>
                    구매할 {daoname} DAO 토큰 갯수를 입력해주세요.
                    <br />※ 소수점 자리 제외하고 입력해주세요.
                  </div>
                }
              />
            </span>
          </div>
          <Input
            className="buy-token-input"
            onChange={handleChange}
            value={count}
          />
          <span className="buy-max" onClick={handleMax}>
            MAX
          </span>
          {isDisabledByAmount && (
            <div className="buy-token-modal-error">
              {`You don't have enough balance`}
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <ByButton
            content="확인"
            primary
            onClick={handleBuyTokens}
            disabled={isDisabledByAmount || count === 0}
          />
        </Modal.Actions>
      </BuyBodal>
    </Wrapper>
  );
}

AccountProfile.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  accountProfile: PropTypes.object.isRequired,
  rootState: PropTypes.object.isRequired,
  handleClaim: PropTypes.func.isRequired,
  handleBuy: PropTypes.func.isRequired,
  loadTokens: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  rootState: baseAppSelector.makeSelectBaseApp(),
  accountProfile: makeSelectAccountProfile(),
  title: () => 'Account',
  description: () =>
    '토큰 보유 현황, SBT, 프로필 등 계정 정보를 확인할 수 있습니다.',
});

function mapDispatchToProps(dispatch) {
  return {
    handleClaim: async redeemCode => {
      dispatch(claimTokens(redeemCode));
    },
    handleBuy: async count => {
      dispatch(buyTokens(count));
    },
    loadTokens: () => {
      dispatch(actions.getTokens());
    },
  };
}

export default wrap(mapStateToProps, mapDispatchToProps, AccountProfile);
