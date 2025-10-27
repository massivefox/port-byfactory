/**
 *
 * SubMenu
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectSubMenu from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export function Tab({ tabs }) {
  useInjectReducer({ key: 'subMenu', reducer });
  useInjectSaga({ key: 'subMenu', saga });

  const navigate = useNavigate();
  const location = useLocation();

  const [selected, setSelected] = React.useState(0);
  const [openSearch, setOpenSearch] = React.useState(false);
  const [keyword, setKeyword] = React.useState('');

  const tbs = [];
  for (let i = 0; i < tabs.length; i++) {
    const { title, link } = tabs[i];

    tbs.push(
      <a
        key={`tab-${link}-${i}`}
        hrefLang="en"
        className="dg Link Link--pointer"
        style={{ color: 'black' }}
        onClick={() => {
          navigate(link);
        }}
      >
        <div className="dcl tab active">
          {title}
          {link === location.pathname ? (
            <div
              className="active-bar"
              style={{ borderBottomColor: '#03AB78' }}
            />
          ) : (
            <div />
          )}
        </div>
      </a>,
    );
  }

  return (
    <div className="dcl tabs " style={{ height: '150px' }}>
      <div className="ui container">
        <div className="dcl tabs-left">{tbs}</div>
        {/* <div className="dcl tabs-right"> */}
        {/*   <div className="SearchContainer"> */}
        {/*     <input */}
        {/*       className={ */}
        {/*         openSearch ? 'SearchInput SearchInput--open' : 'SearchInput' */}
        {/*       } */}
        {/*       placeholder="Search..." */}
        {/*       value={keyword} */}
        {/*       onChange={evt => setKeyword(evt.target.value)} */}
        {/*       onBlur={() => setOpenSearch(false)} */}
        {/*       onClick={() => setOpenSearch(true)} */}
        {/*     /> */}
        {/*   </div> */}
        {/* </div> */}
      </div>
    </div>
  );
}

Tab.propTypes = {
  tabs: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  subMenu: makeSelectSubMenu(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Tab);
