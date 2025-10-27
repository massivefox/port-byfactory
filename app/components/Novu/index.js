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
import { useGetListMembers } from '../../hooks/useGetMembers';
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
        applicationIdentifier={config.novu.novuAppIdentifier}
        backendUrl={config.novu.backendUrl}
      >
        <CustomNotificationCenter />
      </NovuProvider>
    </>
  );
}
