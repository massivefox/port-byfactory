import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './TokenBalanceCard.css';
import TokensPerWalletPopup from './TokensPerWalletPopup';

export default function TokenBalanceCard({ tokenBalance, imageSrc }) {
  const [openPopup, setOpenPopup] = useState(false);

  function handleClick() {
    setOpenPopup(!openPopup);
  }

  function onCloseHandler() {
    setOpenPopup(false);
  }

  return (
    <>
      <div className="TokenBalanceCard" onClick={handleClick}>
        <img src={imageSrc} width="60" height="60" alt="" />
        <div className="TokenBalanceCard_description">
          <div className="TokenBalanceCard__Header">
            <div className="ui sub header TokenBalanceCard__Symbol">
              {`${tokenBalance.symbol}`}
            </div>
            {/* {tokenBalance.amount > 0 && (
              <TokensPerWalletPopup
                open={openPopup}
                onCloseHandler={onCloseHandler}
              />
            )} */}
          </div>
          <span>{tokenBalance.amount}</span>
        </div>
      </div>
    </>
  );
}

TokenBalanceCard.propTypes = {
  tokenBalance: PropTypes.object,
  imageSrc: PropTypes.string,
};
