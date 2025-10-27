# NOVU Notification Center

- novu docs: https://docs.novu.co
- novu api docs : https://docs.novu.co/api/overview/
- 기본제공하는 notification center는 반영된 기능이 많이 없음, 따라서 custom notification으로 구성해야 할 것

1.  novu 환경 설정

    - npm install

          ```
          npm install @novu/node
          ```

    - sample code

          ```
          import { Novu } from '@novu/node';

           const novu = new Novu(process.env.NOVU_API_KEY);
           await novu.trigger('<TRIGGER_NAME>',
           {
           to: [{
           subscriberId: '<UNIQUE_IDENTIFIER>',
           email: 'john1@doemail.com',
           firstName: 'John',
           lastName: 'Doe',
           }],
           payload: {
           name: "Hello World",
           },
           }
           );
          ```

    - novu제공 서버 이용시 = https://web.novu.co/activities
    - 로컬 novu 서버 이용시 = localhost:서버포트(default 4200)
      ```
          NOVU_API KEY: admin Template - setting- apiKeys
          TRIGGER_NAME: Notification - New - NotificationName = TRIGGER_NAME
          UNIQUE_IDENTIFIER: 알람 수신할 계정의 unique 값
      ```
    - local server 생성(https://docs.novu.co/community/run-locally)

    - local npm run

    - require

      - Requirements
      - Node.js version v16.15.1
      - MongoDB
      - Redis
      - (Optional) pnpm - Needed if you want to install new packages
      - (Optional) localstack (required only in S3 related modules)

    ```
      # Ports
        API_PORT= api 서버 포트
        REDIS_PORT= redis 포트
        WS_PORT=웹소켓 포트

      # Root URL
        REACT_APP_WS_URL=웹소켓 주소
        API_ROOT_URL=api 서버 주소
        FRONT_BASE_URL=웹 admin pannel 주소
        WIDGET_EMBED_PATH=http://localhost:4701/embed.umd.min.js
        WIDGET_URL=http://localhost:4500
    ```

    ```
      start:dev - Synonym to npm run start
      start:web - Only starts the web management platform
      start:ws - Only starts the WebSocket service for notification center updates
      start:widget - Starts the widget wrapper project that hosts the notification center inside an iframe
      start:api - Run the API in watch mode
      start:dal - Run the Data Access Layer package in watch mode
      start:shared - Starts the watch mode for the shared client and API library
      start:node - Runs the @novu/node package in watch mode
      start:notification-center - Runs and build the React package for the Novu notification center
    ```

- run docker 필수 설정 env

  ```
  # Ports
    API_PORT= api 서버 포트
    REDIS_PORT= redis 포트
    WS_PORT=웹소켓 포트

  # Root URL
    REACT_APP_WS_URL=웹소켓 주소
    API_ROOT_URL=api 서버 주소
    FRONT_BASE_URL=웹 admin pannel 주소
    WIDGET_EMBED_PATH=http://localhost:4701/embed.umd.min.js
    WIDGET_URL=http://localhost:4500
  ```

  - nove/docker \$ docker-compose up -d
    <img src="./docker.png">

  - example notification code

    ```
         import React from 'react';
         import {
         NovuProvider,
         PopoverNotificationCenter,
         NotificationBell,
         useSocket,
         useNotifications,
         } from '@novu/notification-center';
         import config from '../../config';

         const ko = {
         lang: 'ko',
         translations: {
         poweredBy: 'biyard',
         markAllAsRead: '모두 읽음으로 표시',
         notifications: '알림',
         settings: '설정',
         },
         };
         //translation setting - 알림선터 문구 변환

         const theme = {
         dark: {
         layout: {
         background: '#1E1E26',
         },
         header: {
         badgeColor: 'yellow',
         badgeTextColor: 'black',
         fontColor: 'white',
         },
         },
         };
         // 알림센터 테마 선택

         export function NovuNotification(address) {
         return (
         <>
         <NovuProvider
         stores={[
         { storeId: 'Noti', query: { feedIdentifier: 'Noti' } },
         { storeId: 'Act', query: { feedIdentifier: 'Act' } },
         ]}
          <!-- 각 알림의 identifier별로 저장될 공간, adminPannel - Notification - choose trigger - workflow editor - inApp - edit template -  add new feed  -->

         backendUrl={config.novu.backendUrl}
         subscriberId={address.address}
         //보여줄 알림의 address > 현재 사용자가 들어가도록
         applicationIdentifier="KLYkvESxlRpO"
         i18n={ko} >
         <PopoverWrapper />
         </NovuProvider>
         </>
         );
         }

         function PopoverWrapper() {
         const { updateAction } = useNotifications();

         function handlerOnNotificationClick(IMessage) {
         if (IMessage?.cta?.data?.url) {
         window.location.href = IMessage.cta.data.url;
         }
         }

         async function handlerOnActionClick(
         IMessage,
         applicationIdentifier,
         ButtonTypeEnum,
         ) {
         if (applicationIdentifier === 'primary') {
         // eslint-disable-next-line no-underscore-dangle
         await updateAction(ButtonTypeEnum.\_id, ButtonTypeEnum, 'done');
         }
         }

         return (
         <PopoverNotificationCenter
         tabs={[
         { name: 'Noti', storeId: 'Noti' },
         { name: 'Act', storeId: 'Act' },
         ]}
         //알림센터 알림 탭 구분표시
         onNotificationClick={handlerOnNotificationClick}
         //notification 클릭
         onActionClick={handlerOnActionClick}
         //notification의 버튼 클릭
         theme={theme}
         showUserPreferences >
         {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
         </PopoverNotificationCenter>
         );
         }
    ```

- custom notification example(미완성)

  ```
    import React, { useState, useEffect, useRef } from 'react';
    import styled from 'styled-components';
    import {
      NovuProvider,
      PopoverNotificationCenter,
      NotificationBell,
      useSocket,
      useNotifications,
    } from '@novu/notification-center';
    import fetch from 'node-fetch';
    import { Scrollbar } from 'swiper';
    import config from '../../config';
    import { BiyardButton } from '../Button/BiyardButton';
    import * as b from '../../services/backend';

    const NotificationItem = styled.div`
      border: white;
      padding: 15px;
      height: 80px;
      position: relative;
      display: flex;
      line-height: 20px;
      justify-content: space-between;
      align-items: center;
      border-radius: 7px;
      margin: 10px 15px;
      cursor: pointer;
      background: ${props =>
        props.background === true ? 'rgb(41, 41, 40)' : 'rgb(41, 41, 51)'};
      opacity: ${props => (props.background === true ? '0.33' : '1')};
      box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 20px;
      color: rgb(255, 255, 255);
      font-weight: 700;
    `;
    const Wrapper = styled.div`
      margin: 0 auto;
      margin-left: 10px;
      maxwidth: 200px;
    `;
    const Relative = styled.div`
      width: 50px;
      height: 50px;
      display: flex;
      align-items: right;
      justify-content: right;
    `;
    const Absolute = styled.div`
      width: 600px;
      min-width: 400px;
      max-height: 400px;
      border-radius: 10px;
      box-shadow: 5px 10px 10px 1px rgba(0, 0, 0, 0.3);
    `;
    const Circle = styled.div`
      margin: 0 auto;
      display: flex;
      width: 30px;
      height: 20px;
      border: 15px solid green;
      border-radius: 50%;
      text-align: center;
      align-items: center;
      justify-content: center;
      border-inline: none;
    `;
    const OpenNotification = styled.div`
      display: flex;
      flex-direction: row-reverse;
    `;
    const BackgroundColor = styled.div`
      background: rgb(30, 30, 38);
      border-radius: 10px;
    `;
    const NotificationBox = styled.div`
      overflow-y: scroll;
      max-height: 500px;
      scroll-bar-width: none;
      min-height: 500px;
    `;
    const ContentHeaderBox = styled.div`
      padding: 5px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 55px;
    `;
    const TabBox = styled.li`
      list-style: none;
      float: left;
      width: 33%;
      padding: 10px 15px;
      cursor: pointer;
      text-align: center;
      border: 1px solid #bebebe;
      background: ${props =>
        props.background === true ? 'rgb(41, 41, 40)' : 'rgb(30, 30, 38)'};
    `;
    const TabContainer = styled.div`
      display: flex;
    `;

    export function NovuNotification(address) {
      const [unSeenCount, setUnSeenCount] = useState(0);
      const [showPanel, setShowPanel] = useState(false);
      const [storeName, setStoreName] = useState('Comment');

      const closeModal = useRef();

      useEffect(() => {
        const clickOutside = e => {
          if (
            showPanel &&
            closeModal.current &&
            !closeModal.current.contains(e.target)
          ) {
            setShowPanel(false);
          }
        };
        document.addEventListener('mousedown', clickOutside);
        return () => {
          // Cleanup the event listener
          document.removeEventListener('mousedown', clickOutside);
        };
      }, [showPanel]);

      async function getCount() {
        const data = await b.getUnSeenNotification(address.address);
        setUnSeenCount(data.data.count);
      }

      async function changeTabs(tab) {
        setStoreName(tab);
      }
      useEffect(() => {
        getCount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [showPanel, storeName]);
      const CustomNotificationCenter = () => {
        const {
          notifications,
          fetchNextPage,
          hasNextPage,
          fetching,
          markAsSeen,
          refetch,
          updateAction,
        } = useNotifications({ storeId: storeName });
        function handlerOnNotificationClick(IMessage) {
          const hrefUrl = `${IMessage.cta.data.url}`;
          if (IMessage?.cta?.data?.url) {
            window.location.href = hrefUrl;
          } else {
            console.log('fail');
          }
        }
        refetch();
        async function handlerOnDeleteClick(applicationIdentifier) {
          await b.deleteNotification(applicationIdentifier);
          getCount();
        }
        async function markSeenNoticeClick(seenAddress, applicationIdentifier) {
          await b.markSeenNotification(seenAddress, applicationIdentifier);
          getCount();
        }

        return (
          <Relative ref={closeModal}>
            {showPanel === false && (
              <BiyardButton
                className="openPopup"
                icon="bell"
                onClick={() => {
                  setShowPanel(!showPanel);
                }}
              />
            )}
            {showPanel && (
              <>
                <Absolute>
                  <OpenNotification>
                    <BiyardButton
                      className="close button"
                      icon="delete"
                      style={{
                        display: 'flex',
                        justifyContent: 'right',
                        width: '40.52px',
                        height: '50px',
                        alignItems: 'center',
                      }}
                      onClick={() => {
                        setShowPanel(!showPanel);
                      }}
                    />
                  </OpenNotification>
                  <BackgroundColor>
                    <ContentHeaderBox>
                      <h3 style={{ display: 'contents' }}>Notification Center</h3>

                      <Wrapper>
                        <Circle>{unSeenCount}</Circle>
                      </Wrapper>
                    </ContentHeaderBox>
                    <hr style={{ color: 'white' }} />
                    <TabContainer>
                      <ul
                        className="tab_title"
                        style={{ width: '100%', padding: '10px' }}
                      >
                        <TabBox onClick={() => changeTabs('Comment')}>
                          {storeName === 'Comment' ? (
                            <u>Comment </u>
                          ) : (
                            <p>Comment</p>
                          )}
                        </TabBox>
                        <TabBox onClick={() => changeTabs('Voting')}>
                          {storeName === 'Voting' ? <u>Voting </u> : <p>Voting</p>}
                        </TabBox>
                        <TabBox
                          onClick={() => {
                            changeTabs('CreateProposal');
                          }}
                        >
                          {storeName === 'CreateProposal' ? (
                            <u>Proposal</u>
                          ) : (
                            <p>Proposal</p>
                          )}
                        </TabBox>
                      </ul>
                    </TabContainer>
                    <NotificationBox>
                      {notifications?.map(
                        // eslint-disable-next-line no-return-assign
                        notification => (
                          <NotificationItem
                            background={notification.seen}
                            onClick={() => {
                              handlerOnNotificationClick(notification);
                              markSeenNoticeClick(
                                address.address,
                                notification._id,
                              );
                            }}
                          >
                            <div className="content text">
                              {notification.content}
                            </div>
                            <div>
                              <BiyardButton
                                className="seen button"
                                icon="book"
                                style={{
                                  display: 'flex',
                                  width: '10px',
                                  height: '10px',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                onClick={event => {
                                  event.stopPropagation();
                                  markSeenNoticeClick(
                                    address.address,
                                    notification._id,
                                  );
                                  console.log(notification);
                                }}
                              />
                              <BiyardButton
                                className="close button"
                                icon="delete"
                                style={{
                                  display: 'flex',
                                  width: '10px',
                                  height: '10px',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                onClick={event => {
                                  event.stopPropagation();
                                  handlerOnDeleteClick(notification._id);
                                }}
                              />
                            </div>
                          </NotificationItem>
                        ),
                      )}
                    </NotificationBox>
                  </BackgroundColor>
                </Absolute>
              </>
            )}
          </Relative>
        );
      };
      return (
        <>
          <NovuProvider
            stores={[
              { storeId: 'Voting', query: { feedIdentifier: 'Voting' } },
              { storeId: 'Comment', query: { feedIdentifier: 'Comment' } },
              {
                storeId: 'CreateProposal',
                query: { feedIdentifier: 'CreateProposal' },
              },
            ]}
            subscriberId={address.address}
            applicationIdentifier="KLYkvESxlRpO"
            backendUrl={config.novu.backendUrl}
          >
            <CustomNotificationCenter />
          </NovuProvider>
        </>
      );
    }
  ```

```

```

- trigger example - backendUrl은 key:value 형태로 삽입 되어야함

  - 정의

    ```
    import { Novu } from '@novu/node';
    import config from '../../config';

    export async function notificationTrigger(notice, receivers, data) {
      const novuConfig = {
        backendUrl: config.novu.backendUrl,
      };
      const novu = new Novu(config.novu.apiKey, novuConfig);
      await novu.trigger(notice, {
        to: receivers,
        payload: {
          inputdata: data,
        },
      });
    }
    ```

  - 사용 예
    ```
    notificationTrigger(
    'CreateProposal',
      ['0xf1b735641e307ef82b3d1eb795554ac5f9270b08'],
      { daoname, proposalid: uuid },
      //storeidentifier,수신할 유저identifier배열, payload
    );
    ```
  - slack webhook

    ```
    import React from 'react';
    import { Novu, ChatProviderIdEnum } from '@novu/node';
    import config from '../../config';

    export function NovuCredentials() {
      const novuConfig = {
        backendUrl: config.novu.backendUrl,
      };
      const Identifier = '0xf1b735641e307ef82b3d1eb795554ac5f9270b08';
      const novu = new Novu(config.novu.apiKey, novuConfig);

      novu.subscribers.setCredentials(Identifier, ChatProviderIdEnum.Slack, {
        webhookUrl: config.novu.slackWebHookUrl,
      });
      //Identifier의 유저에게 trigger가 작동할때마다 웹훅 동작해서 전달
      //단순히 트리거 작동시 웹훅이 동작하는것이라 파라미터는 전달되지 않는것 같음
    ```
