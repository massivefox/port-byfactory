import React from 'react';
import { Card, Header, Popup } from 'semantic-ui-react';
import { HelperPopup } from '../Helper/Helper';

import './TokensPerWalletPopup.css';

export default function TokensPerWalletPopup({ detailData, open }) {
  const content = (
    <Card className="TokensPerWalletPopup__Card">
      <Card.Content className="TokensPerWalletPopup__Content">
        <div className="TokensPerWalletPopup__Row">
          <div className="TokensPerWalletPopup__Block">
            <Header>Token purchase</Header>
          </div>
          <div className="TokensPerWalletPopup__Block TokensPerWalletPopup__RightBlock">
            <div className="TokensPerWalletPopup__Balance">
              <Header>1000</Header>
              <p tiny>KLAY</p>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );

  return (
    <HelperPopup
      className="TokensPerWalletPopup"
      content={content}
      position="bottom center"
      trigger={
        <div>
          <svg
            className="Helper__Icon"
            width="14"
            height="14"
            viewBox="0 2 24 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
            />
          </svg>
        </div>
      }
      eventsEnabled
      // onClose={onCloseHandler}
      open={open}
      on="click"
      pinned={false}
    />
  );
}
