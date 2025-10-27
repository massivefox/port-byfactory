import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { connect } from 'react-redux';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Theme from 'components/Theme';
import Tooltip from '@mui/material/Tooltip';
import { Dimmer, Icon, Menu } from 'semantic-ui-react';
import { NovuNotification } from '../Novu';
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import saga from './saga';
import defaultImage from './default.png';

import './index.css';
import { userState, accountState } from '../../states';
import bankContract from '../../services/contracts/bank';
import { STORAGE_KEYS } from '../../storage';
import { Desktop, Mobile } from '../Responsive';

const Root = styled.div`
  background: white;
`;

const Wrapper = styled.div`
  ${props => props.isDesktop && 'display: grid;'}
  grid-template-areas:
    'header header'
    'nav content';
  grid-template-columns: min-content 1fr;
  height: 100vh;
  overflow: hidden;
`;

const Header = styled.header`
  grid-area: header / header / header / header;
  z-index: 10000;
  height: 60px;
  border-bottom: 1px solid #e0e0e0;
  background-color: var(--biyard-header);
  color: #696969;
  display: flex;
  padding-left: 8px;
  ${({ isMobile }) => (isMobile ? 'position: relative !important;' : '')}
`;

const LogoLink = styled.a`
  padding: 10px 16px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  position: relative;

  img {
    height: 100%;
  }

  .title {
    margin-left: 1rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  margin-left: auto;
  margin-right: 10px;
  font-size: 14px;
`;

const TopMenus = styled.div`
  display: flex;
  gap: 16px;
`;

const TopMenuItem = styled.a`
  font-size: 16px;
  line-height: 22px;
  font-weight: 500;
  color: #696969;
  background-color: transparent;
  padding: 8px;
  border-radius: 2px;
  position: relative;
  height: 36px;
  transition: background 0.2s ease-out 0s;

  &:hover {
    color: var(--biyard-primary);
  }
`;

const TopMenuEmphasizedItem = styled.a`
  margin-right: 16px;
  padding: 4px 16px;
  line-height: 22px;
  border-radius: 2px;
  border: 1px solid var(--biyard-primary);
  font-weight: 500;
  color: #696969;

  &:hover {
    color: var(--biyard-primary);
  }
`;

const AccountProfile = styled.a`
  display: flex;
  gap: 8px;
  text-decoration: none !important;
`;

const AccountWrapper = styled.div`
  padding: 8px;
  color: rgb(255, 255, 255);
  font-size: 14px;
  display: flex;
`;

const SupportSideMenu = styled.div`
display: flex;
flex-direction: column;
padding: 6px 16px;
border-top: 1px solid #d1d1d1
}`;

const AccountTokensWrapper = styled.div`
  display: flex !important;
  align-items: center;
  max-width: 160px;
  justify-content: end;
  margin: 0 20px 0 10px;

  & p {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const DaoInfoWrapper = styled.div`
  color: var(--biyard-text) !important;
  display: flex;
  align-items: center;
  max-width: 160px;
  justify-content: end;
  margin: 0 10px 0 40px;
  & p {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-weight: 700;
  }
  & p:hover {
    color: var(--biyard-primary);
  }
`;

const TokenIcon = styled.div`
  width: 16px;
  height: 16px;
  background-image: url(https://cdn.decentraland.org/@dcl/account-site/3.0.2/static/media/mana-red-logo.9a5f9e65.svg);
  background-size: contain;
  margin-right: 10px;
`;

const AccountProfileImage = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  margin-right: 8px;
`;

const SideMenu = styled.div`
  ${({ isMobile, open }) =>
    isMobile &&
    open &&
    `position: fixed !important;
  ;
  `}

  ${({ isMobile, open }) =>
    isMobile &&
    !open &&
    `position: fixed !important;
    margin-left: -236px;`}

  transition: all 0.25s !important;
  position: relative;
  grid-area: nav / nav / nav / nav;
  width: 236px;
  z-index: 10001;
  border-right: 1px solid #d1d1d1;
  background-color: var(--biyard-bg-primary);
  color: var(--biyard-text);
  min-height: 100px;
  height: calc(100vh - 2 * env(safe-area-inset-bottom) - 60px);
  font-size: 14px;
  line-height: 22px;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: repeat(1, max-content) repeat(1, minmax(0px, min-content));
`;

const SideMenuQuickAccess = styled.div`
  background-color: var(--biyard-bg-primary);
  color: var(--biyard-text);
  z-index: 3;
`;

const SideMenuQuickAccessSection = styled.div`
  display: block;
`;

const SideMenuQuickAccessMenu = styled.div`
  border-bottom: 1px solid #d1d1d1;
  padding: 20px 0px;
`;

const SideExpandableMenu = styled.div`
  overflow-y: auto;
  padding-bottom: 20px;
`;

const AccountSideMenu = styled.div`
  background: var(--biyard-bg-primary);
  position: absolute;
  padding: 16px 24px;
  bottom: 0;
  width: 100%;

  a {
    color: var(--biyard-text) !important;
    font-weight: 500;
  }
`;

const QuickAccessHeader = styled.h6`
  padding: 0px 24px;
  font-size: 1em;
  line-height: 20px;
  font-weight: 600;
  margin: 0px;
  margin-bottom: 12px;
`;

const QuickAccessLink = styled.a`
  padding: 4px 24px;
  color: rgb(154, 162, 170);
  font-weight: 700;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  &:hover {
    background-color: var(--biyard-secondary);
    color: var(--biyard-primary);
  }
`;

const QuickAccessText = styled.div`
  font-size: 1em;
  position: relative;
  z-index: 2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0px;
`;

const ExpandPanel = styled.div`
  display: flex;
  padding: 0px 24px;
  margin-bottom: 12px;
  gap: 4px;
  margin-left: -10px;
  margin-top: 16px;
`;

const ExpandButton = styled.button`
  font-size: 1em;
  line-height: 20px;
  padding-top: 2px;
  padding-bottom: 2px;
  background-color: transparent;
  border-color: transparent;
  color: rgb(201, 207, 212);
  appearance: none;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  flex-wrap: nowrap;
  border: 1px solid transparent;
  border-radius: 2px;
  transition: all 0.1s ease-in 0s;
  font-weight: 400;
  padding: 0px 8px;
  height: 16px;
  position: relative;
  margin: 0px;
  overflow: visible;
  text-transform: none;
  font-family: inherit;
  &:hover {
    background-color: var(--biyard-secondary);
    color: var(--biyard-light);
  }
`;

const ExpandableMenuInnerSection = styled.div`
  margin-top: 6px;
  display: block;
`;

const ExpandableMenuItem = styled.div`
  color: rgb(154, 162, 170);
`;

const ExpandableMenuItemUpperButton = styled.div`
  padding-top: 6px;
  padding-bottom: 6px;
  padding-right: 24px;
  padding-left: 24px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  font-weight: 700;
  ${({ hasSubMenu }) => !hasSubMenu && `color: var(--biyard-text);`}
  &:hover {
    color: var(--biyard-primary);
    cursor: pointer;
  }
  ${({ expanded }) => expanded && `color: var(--biyard-text);`}
`;

const ExpandableMenuItemUpperButtonIcon = styled.svg`
  flex-shrink: 0;
  transition: transform 0.1s ease-out 0s;
  margin-left: auto;
  ${({ expanded }) =>
    expanded
      ? `
  transform: rotateZ(-180deg);
  color: var(--biyard-text);`
      : `color: var(--biyard-text);
  transform: rotateZ(0deg);
`}
`;

const ExpandableMenuItemLowerSection = styled.div`
  ackground-color: transparent;
  max-height: 0px;
  overflow: hidden;
  transition: max-height 0.2s ease-out 0s;
  ${({ expanded }) => expanded && `max-height: 500px;`}
`;

const ExpandableMuneItemLink = styled.a`
  padding: 4px 24px;
  padding-left: 40px;
  color: rgb(154, 162, 170);
  font-weight: 500;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  &:hover {
    background-color: var(--biyard-secondary);
    color: var(--biyard-primary);
  }
`;

const MainContainer = styled.div`
  min-width: 375px;
  height: 100%;

  transition: all 0.25s;
  background: #f7f7f9;
  grid-area: content / content / content / content;
  overflow-y: auto;
  background: #eeeeee;
`;

const ContentWrapper = styled.div`
  position: relative;
  padding-bottom: 36px;
`;

const ContentHeader = styled.div`
  z-index: 3;
  min-height: 64px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  padding: 8px 48px;
  font-size: 14px;
  line-height: 22px;
  border-bottom: 1px solid #e0e0e0;
  background-color: var(--biyard-bg-primary);
`;

const ContentHeaderTitle = styled.h1`
  font-size: 20px;
  line-height: 28px;
  margin: 0px;
  padding: 0px;
  display: flex;
  -webkit-box-align: baseline;
  align-items: baseline;
  min-width: fit-content;
  font-weight: 600;
  color: #18191b;
`;

const ContentHeaderDescription = styled.span`
  width: 20px;
  height: 20px;
  margin-right: 2px;
  cursor: pointer;
  * {
    color: rgb(154, 162, 170);
  }
`;

const ContentSectionWrapper = styled.nav`
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid transparent;
  padding: 10vh 48px 0px;
  -webkit-box-pack: center;
  justify-content: center;
`;

const ContentSection = styled.div`
  display: flex;
  width: 100%;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-flex: 1;
  flex-grow: 1;
`;

const MenuLink = styled(Link)`
  color: #18191b !important;
`;

const MobileMenu = styled(Menu)`
  diplay: grid !important;
  margin: 0 !important;
  border: none !important;
  .icon {
    color: var(--biyard-primary) !important;
  }
`;

function BaseApp({
  menus,
  color,
  title,
  titleColor,
  logo,
  dispatch,
  onConnect,
  loadTokens,
  rootState,
  link,
  popup,
  quickMenus,
  profileLink,
  sideMenus,
  children,
  toggleAtomicCategory,
  toggleExpanded,
  handleTokens,
}) {
  useInjectReducer({ key: 'baseApp', reducer });
  useInjectSaga({ key: 'baseApp', saga });
  const daoname = localStorage.getItem(STORAGE_KEYS.DAO_NAME);
  const location = useLocation();
  const navigate = useNavigate();

  const [userAddress, setUserAddress] = useRecoilState(accountState);
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const { contents: userInfo } = useRecoilValueLoadable(userState);
  document.title = title;

  const desc = `Input any address to see who or what it is, along with
information on balances, wallet activity, related wallets
and addresses that wallet interacts with.
`;

  const [catOpen, setCatOpen] = useState();

  const links = [];
  for (let i = 0; i < menus.length; i++) {
    const { name, url, emphasized, email } = menus[i];
    if (!emphasized) {
      links.push(
        <TopMenuItem
          key={`baseapp-link-${i}-${url}`}
          href={`${email ? 'mailto:' : ''}${url}`}
        >
          {name}
        </TopMenuItem>,
      );
    } else {
      links.push(
        <TopMenuEmphasizedItem
          target="_blank"
          key={`baseapp-link-${i}-${url}`}
          href={`${email ? 'mailto:' : ''}${url}`}
        >
          {name}
        </TopMenuEmphasizedItem>,
      );
    }
  }

  const daoName = useMemo(() => {
    const name = localStorage.getItem(STORAGE_KEYS.DAO_NAME);
    if (location.pathname === '/') {
      return '';
    }
    return name || '';
  }, [daoname]);

  const loadAccountInfo = useCallback(async () => {
    const { klaytn } = window;
    if (!klaytn) return;

    try {
      await klaytn.enable();

      setUserAddress(klaytn.selectedAddress);
      dispatch(actions.isKaikasConnected());
      klaytn.on('accountsChanged', () => dispatch(actions.isKaikasConnected()));
    } catch (error) {
      throw new Error(error);
    }
  }, [dispatch]);
  useEffect(() => {
    loadAccountInfo();
    bankContract.getTokenBalance().then(el => {
      handleTokens(el);
    });
  }, [rootState, loadAccountInfo, handleTokens]);

  useEffect(() => {
    const sideMenuObj = {};

    sideMenus?.forEach(el => {
      const name = `sidemenu-category-${el.name}`;

      let def = false;
      if (rootState?.atomicExpanded && rootState.atomicExpanded[name]) {
        def = rootState.atomicExpanded[name];
      }

      Object.assign(sideMenuObj, {
        [name]: def,
      });
    });

    setCatOpen(sideMenuObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sideMenus]);

  const expandAll = useCallback(() => {
    setCatOpen(
      Object.keys(catOpen).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {}),
    );
    // setOpen(true);
    toggleExpanded(true);
  }, [catOpen, toggleExpanded]);

  const collasesAll = useCallback(() => {
    setCatOpen(
      Object.keys(catOpen).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
    );

    toggleExpanded(false);
  }, [catOpen, toggleExpanded]);

  const collaseMenu = useCallback(
    name => {
      const expanded = !catOpen[name];
      setCatOpen(prev => ({ ...prev, [name]: expanded }));
      toggleAtomicCategory(name, expanded);
    },
    [catOpen, toggleAtomicCategory],
  );

  const mainContent = useMemo(
    () => (
      <MainContainer open={openMobileMenu} isMobile={isMobile}>
        <ContentWrapper>
          <ContentHeader>
            <ContentHeaderTitle>
              {location.pathname !== '/' &&
                location.pathname !== '/create/dao' && (
                  <span>
                    <MenuLink
                      to={`/proposals/${daoName}`}
                      style={{ color: 'red !important' }}
                    >
                      {daoName}
                    </MenuLink>
                    <Icon name="angle right" />
                  </span>
                )}
              <span>{rootState.content?.title || ''} </span>
              <ContentHeaderDescription>
                {rootState.content?.description !== '' && (
                  <Tooltip
                    title={
                      <div style={{ whiteSpace: 'pre-line' }}>
                        {rootState.content?.description || ''}
                      </div>
                    }
                    arrow
                    placement="right-start"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      style={{ marginLeft: '6px' }}
                    >
                      <rect width="256" height="256" fill="none" />
                      <circle
                        cx="128"
                        cy="128"
                        r="96"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                      />
                      <polyline
                        points="120 124 128 124 128 176 136 176"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                      />
                      <circle cx="126" cy="84" r="16" />
                    </svg>
                  </Tooltip>
                )}
              </ContentHeaderDescription>
            </ContentHeaderTitle>
          </ContentHeader>
          <ContentSectionWrapper>
            <ContentSection>{children}</ContentSection>
          </ContentSectionWrapper>
        </ContentWrapper>
      </MainContainer>
    ),
    [
      children,
      daoName,
      isMobile,
      location.pathname,
      openMobileMenu,
      rootState.content,
    ],
  );

  const sideBarMenu = useMemo(
    () => (
      <SideMenu isMobile={isMobile} open={openMobileMenu}>
        <SideMenuQuickAccess>
          <SideMenuQuickAccessSection>
            <SideMenuQuickAccessMenu>
              <QuickAccessHeader> QUICK ACCESS</QuickAccessHeader>
              {quickMenus?.map(el => (
                <QuickAccessLink key={el.url + el.name} as={Link} to={el.url}>
                  <QuickAccessText> {el.name}</QuickAccessText>
                </QuickAccessLink>
              ))}
            </SideMenuQuickAccessMenu>
          </SideMenuQuickAccessSection>
          <ExpandPanel>
            <ExpandButton onClick={expandAll}>Expand all</ExpandButton>
            <ExpandButton onClick={collasesAll}>Collapse all</ExpandButton>
          </ExpandPanel>
        </SideMenuQuickAccess>
        <SideExpandableMenu>
          <ExpandableMenuInnerSection>
            {catOpen &&
              sideMenus?.map(el => {
                const name = `sidemenu-category-${el.name}`;
                return (
                  <ExpandableMenuItem key={`${name}`}>
                    <ExpandableMenuItemUpperButton
                      expanded={catOpen[name]}
                      hasSubMenu={el.menus !== undefined}
                      onClick={() => {
                        if (el.menus) {
                          collaseMenu(name);
                        } else {
                          navigate(el.url);
                        }
                      }}
                    >
                      <span>{el.name} </span>
                      {el.menus && (
                        <ExpandableMenuItemUpperButtonIcon
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          expanded={catOpen[name]}
                        >
                          <rect width="256" height="256" fill="none" />
                          <polyline
                            points="208 96 128 176 48 96"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="24"
                          />
                        </ExpandableMenuItemUpperButtonIcon>
                      )}
                    </ExpandableMenuItemUpperButton>
                    <ExpandableMenuItemLowerSection expanded={catOpen[name]}>
                      {el.menus?.map(cl => (
                        <ExpandableMuneItemLink
                          key={`sidemenu-line-${el.name}-${cl.name}-${cl.url}`}
                          as={Link}
                          to={cl.url}
                        >
                          {cl.name}
                        </ExpandableMuneItemLink>
                      ))}
                    </ExpandableMenuItemLowerSection>
                  </ExpandableMenuItem>
                );
              })}
          </ExpandableMenuInnerSection>
        </SideExpandableMenu>
        <Mobile>
          <SupportSideMenu>{links}</SupportSideMenu>
        </Mobile>
        <AccountSideMenu>
          {userAddress ? (
            <Link to="/account">
              <AccountProfileImage
                src={userInfo.profile || defaultImage}
                alt={userInfo.address}
              />
              My Account
            </Link>
          ) : (
            <TopMenuEmphasizedItem
              style={{ marginLeft: '2rem' }}
              onClick={onConnect}
            >
              Connect
            </TopMenuEmphasizedItem>
          )}
        </AccountSideMenu>
      </SideMenu>
    ),
    [
      catOpen,
      collaseMenu,
      collasesAll,
      expandAll,
      isMobile,
      links,
      navigate,
      onConnect,
      openMobileMenu,
      quickMenus,
      rootState.account,
      sideMenus,
      userInfo.profile,
    ],
  );

  return (
    <Root>
      <Wrapper isDesktop={isDesktop}>
        <Header isMobile={isMobile}>
          <Mobile>
            <MobileMenu
              inverted
              pointing
              secondary
              style={{ display: 'grid', margin: 0 }}
            >
              <Menu.Item onClick={() => setOpenMobileMenu(!openMobileMenu)}>
                <Icon name="sidebar" />
              </Menu.Item>
            </MobileMenu>
          </Mobile>

          <LogoLink href={link}>
            <img alt={title} src={logo} />
            <div className="title">{title}</div>
          </LogoLink>
          <Desktop>
            <Nav>
              <TopMenus>{links}</TopMenus>
              {!userAddress ? (
                <TopMenuEmphasizedItem
                  style={{ marginLeft: '2rem' }}
                  onClick={onConnect}
                >
                  Connect
                </TopMenuEmphasizedItem>
              ) : (
                <>
                  {daoName !== '' && (
                    <>
                      <div
                        as={Link}
                        to={`/proposals/${daoName}`}
                        className="dao-info-wrapper"
                      >
                        <p>{daoName} DAO</p>
                      </div>
                      <div className="account-token-wrapper">
                        <TokenIcon />
                        <p>{userInfo.balance || 0}</p>
                      </div>
                    </>
                  )}
                  <AccountProfile as={Link} to={profileLink}>
                    <AccountWrapper>
                      <AccountProfileImage
                        src={userInfo.profile || defaultImage}
                        alt={userInfo.balance}
                      />
                    </AccountWrapper>
                  </AccountProfile>
                </>
              )}
              {/* TODO: Apply after novu backend */}
              {/* <NovuNotification address={rootState.account} /> */}
            </Nav>
          </Desktop>
        </Header>
        {sideBarMenu}
        <Dimmer active={isMobile && openMobileMenu} />
        {mainContent}
      </Wrapper>
    </Root>
  );
}

BaseApp.propTypes = {
  menus: PropTypes.array.isRequired,
  color: PropTypes.string,
  title: PropTypes.string.isRequired,
  titleColor: PropTypes.string,
  logo: PropTypes.any,
  link: PropTypes.string.isRequired,
  popup: PropTypes.array.isRequired,
  profileLink: PropTypes.string.isRequired,
  quickMenus: PropTypes.array,
  sideMenus: PropTypes.array,
  children: PropTypes.node,

  rootState: PropTypes.object.isRequired,
  onConnect: PropTypes.func.isRequired,
  loadTokens: PropTypes.func,
  dispatch: PropTypes.func,
  toggleAtomicCategory: PropTypes.func,
  toggleExpanded: PropTypes.func,
  handleTokens: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  rootState: selectors.makeSelectBaseApp(),
});

function mapDispatchToProps(dispatch) {
  return {
    onConnect: () => {
      dispatch(actions.handleLogin());
    },
    handleTokens: tokens => {
      dispatch(actions.handleTokens(tokens));
    },
    loadTokens: () => {
      dispatch(actions.getTokens());
    },
    toggleAtomicCategory: (name, expanded) => {
      dispatch(actions.expandedForOne(name, expanded));
    },
    toggleExpanded: expanded => {
      dispatch(actions.expandedForAll(expanded));
    },
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default React.memo(compose(withConnect)(BaseApp));
