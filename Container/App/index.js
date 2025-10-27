/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useCallback, useEffect, useState } from 'react';
import BaseApp from 'components/BaseApp';
import AccountProfile from 'containers/AccountProfile';
import ProposalSubmit from 'containers/ProposalSubmit';
import ProposalDetail from 'containers/ProposalDetail';
import ProposalList from 'containers/ProposalList';
import TransparencyPage from 'containers/Transparency';
import Members from 'containers/Members';
import Home from 'containers/Home';

import ReactGA from 'react-ga';

import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import NotFoundPage from 'components/NotFoundPage';
import { useSetRecoilState } from 'recoil';
import { Dimmer, Image } from 'semantic-ui-react';
import styled from 'styled-components';
import CreateDao from 'containers/CreateDao';

import TopLogo from 'images/biyard_logo_top.png';
import logo from '../../images/sss-logo.png';
import { accountState, networkState } from '../../states';
import config from '../../config';
import { initContract } from '../../services/contract';

const DimmerContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  div {
    margin-top: 15px;
  }
`;

const menus = [
  {
    name: 'Getting Started',
    url: 'https://docs.biyard.co/docs/getting-started',
  },
  { name: 'Documentation', url: 'https://docs.biyard.co/docs' },
  { name: 'Support', url: config.contactEmail, email: true },
];

const quickMenus = [{ name: 'Home', url: '/' }];

const sideMenus = [
  // {
  //   name: 'Account',
  //   menus: [{ name: 'Account info', url: '/account' }],
  // },
];

export default function App() {
  const { klaytn } = window;
  const location = useLocation();

  const [sideBar, setSideBar] = useState(sideMenus);
  const selectedDao = localStorage.getItem('daoName');
  const [disable, setDisable] = useState(false);
  const setAccount = useSetRecoilState(accountState);

  const setNetwork = useSetRecoilState(networkState);

  const init = useCallback(async () => {
    initContract();
    if (!klaytn) return;

    await klaytn.enable();

    setDisable(
      klaytn.networkVersion.toString() !== config.chainId ||
        typeof window.klaytn === 'undefined',
    );

    setAccount(klaytn.selectedAddress);
    klaytn.on('accountsChanged', () => {
      setAccount(klaytn.selectedAddress);
    });

    klaytn.on('networkChanged', () => {
      setNetwork(klaytn.networkVersion);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [klaytn, klaytn?.networkVersion]);

  useEffect(() => {
    init();
    ReactGA.initialize(config.gaId);
  }, [init]);

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (selectedDao) {
      const m = [
        {
          name: 'Home',
          url: '/',
        },
        {
          name: `${selectedDao} DAO`,
          menus: [
            { name: 'Proposals', url: `/proposals/${selectedDao}` },
            { name: 'Transparency', url: `/transparency/${selectedDao}` },
            { name: 'Members', url: `/members/${selectedDao}` },
            { name: 'My activity', url: `/activity/${selectedDao}` },
          ],
        },
        ...sideMenus,
      ];

      setSideBar(m);
    }
  }, [selectedDao]);

  const title = '';
  const description = 'This site is for investment platform';
  const popup = [
    {
      icon: () => <i aria-hidden="true" className="user icon" />,
      url: '/account',
      text: 'Account',
    },
    {
      icon: () => <i className="sign-out-icon" />,
      url: '',
      text: 'Sign Out',
    },
  ];

  return (
    <>
      <BaseApp
        menus={menus}
        title={title}
        description={description}
        /* onClick={() => console.log('signin')} */
        color="#000000"
        titleColor="#03AB78"
        logo={TopLogo}
        link="/"
        profileLink="/account"
        popup={popup}
        quickMenus={quickMenus}
        sideMenus={sideBar}
      >
        <Dimmer.Dimmable dimmed>
          <Dimmer
            active={disable || typeof window.klaytn === 'undefined'}
            page
            style={{
              zIndex: '10001',
              width: '100%',
              left: '0 !important',
            }}
            className="global"
          >
            <DimmerContent>
              <Image src={logo} size="tiny" />
              <div>
                {typeof window.klaytn === 'undefined' ? (
                  <>
                    <p>Kaikas를 먼저 설치해주세요.</p>
                    <a
                      href="https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi"
                      target="_blank"
                    >
                      Kaikas 크롬 확장 프로그램 바로가기 (PC 버전)
                    </a>
                  </>
                ) : (
                  <p>네트워크를 변경해주세요.</p>
                )}
              </div>
            </DimmerContent>
          </Dimmer>
        </Dimmer.Dimmable>

        {typeof window.klaytn !== 'undefined' && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route exact path="/create/dao" element={<CreateDao />} />
            <Route path="/proposals/:daoname" element={<ProposalList />} />
            <Route path="/activity/:daoname" element={<AccountProfile />} />
            <Route path="/account" element={<AccountProfile />} />
            <Route
              exact
              path="/proposal/:daoname"
              element={<ProposalSubmit />}
            />
            <Route
              exact
              path="/proposal/:daoname/:id"
              element={<ProposalDetail />}
            />
            <Route
              path="/transparency/:daoname"
              element={<TransparencyPage />}
            />
            <Route path="/members/:daoname" element={<Members />} />
            {/* <Route exact path="/auth/login" element={<Login />} />
            <Route exact path="/auth/signup" element={<SignUp />} />
            <Route
              exact
              path="/auth/reset-password"
              element={<ResetPassword />}
            /> */}

            <Route path="*" element={<NotFoundPage />} />
            <Route path="/error" element={<NotFoundPage />} />
          </Routes>
        )}
      </BaseApp>

      {/* <Footer /> */}
      {/* <GlobalStyle /> */}
    </>
  );
}
