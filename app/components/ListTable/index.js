/**
 *
 * ListTable
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectListTable from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

const image =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00IDEyQzQgNy41ODg1MyA3LjU4ODUzIDQgMTIgNEMxNi40MTE1IDQgMjAgNy41ODg1MyAyMCAxMkMyMCAxNi40MTE1IDE2LjQxMTUgMjAgMTIgMjBDNy41ODg1MyAyMCA0IDE2LjQxMTUgNCAxMlpNNS4yMzkzNCAxMkM1LjIzOTM0IDE1LjcyNzMgOC4yNzI2NiAxOC43NjA3IDEyIDE4Ljc2MDdDMTUuNzI3MyAxOC43NjA3IDE4Ljc2MDcgMTUuNzI3MyAxOC43NjA3IDEyQzE4Ljc2MDcgOC4yNzI2NiAxNS43MjggNS4yMzkzNCAxMiA1LjIzOTM0QzguMjcyNjYgNS4yMzkzNCA1LjIzOTM0IDguMjcyNjYgNS4yMzkzNCAxMlpNMTIuNjE5NyAxMS43Mzk3TDE0Ljg1MDUgMTMuNDEyOEMxNS4xMjQ0IDEzLjYxOCAxNS4xODAyIDE0LjAwNjUgMTQuOTc0NCAxNC4yNzk4QzE0Ljg1MjkgMTQuNDQzNCAxNC42NjcgMTQuNTI4MyAxNC40NzggMTQuNTI4M0MxNC4zNDg1IDE0LjUyODMgMTQuMjE4NCAxNC40ODggMTQuMTA2OCAxNC40MDQ0TDExLjYyODIgMTIuNTQ1M0MxMS40NzIgMTIuNDI4OCAxMS4zODAzIDEyLjI0NDggMTEuMzgwMyAxMi4wNDk2VjguMzMxNTNDMTEuMzgwMyA3Ljk4ODg0IDExLjY1NzMgNy43MTE4NCAxMiA3LjcxMTg0QzEyLjM0MjcgNy43MTE4NCAxMi42MTk3IDcuOTg4ODQgMTIuNjE5NyA4LjMzMTUzVjExLjczOTdaIiBmaWxsPSIjNzM2RTdEIi8+Cjwvc3ZnPgo=';

export function ListTable({ items, submit }) {
  useInjectReducer({ key: 'listTable', reducer });
  useInjectSaga({ key: 'listTable', saga });
  const [openMenu, setOpenMenu] = React.useState(false);
  const [selected, setSelected] = React.useState('Latest');

  const handleSelected = el => {
    setSelected(el);
    setOpenMenu(false);
  };

  const el = [];
  for (let i = 0; i < items.length; i++) {
    const { id, uuid, createdAt, category, leading, result, title } = items[i];
    let { status } = items[i];
    const link = `/proposal/${id || uuid}`;
    const now = Date.now();
    const d = new Date(createdAt);
    // FIXME: it should be depends on the configuration of contracts
    d.setDate(d.getDate() + 10);
    const diffTime = d - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let time = '';
    if (diffDays < 0) {
      time = 'Finished';
      status = 'finished';
    } else if (diffDays === 0) {
      time = 'Ends in today';
    } else {
      time = `Ends in ${diffDays} days`;
    }

    el.push(
      <a
        className="dg Link Link--pointer ui card ProposalItem"
        key={`${link}-${i}`}
        href={link}
        hrefLang="en"
      >
        <div className="content">
          <div className="ProposalItem__Title">
            <div className="ui header">{`[${category}] ${title}`}</div>
            {/* <div className="LeadingOption"> */}
            {/*   <p className="dg Paragraph Paragraph--secondary Paragraph--small"> */}
            {/*     {leading ? ( */}
            {/*       <span> */}
            {/*         Leading: <strong>yes</strong> */}
            {/*       </span> */}
            {/*     ) : ( */}
            {/*       <span> Result: {result}</span> */}
            {/*     )} */}
            {/*   </p> */}
            {/* </div> */}
          </div>
          <div className="ProposalItem__Status">
            <div>
              {/* <div className={`StatusLabel StatusLabel--${status}`}> */}
              {/*   <span>{status}</span> */}
              {/* </div> */}
              <div className="CategoryLabel CategoryLabel--draft">
                <span>{category}</span>
              </div>
            </div>
            {/* <div className="FinishLabel"> */}
            {/*   <img src={image} width="24" height="24" /> */}
            {/*   <span> */}
            {/*     <time>{time}</time> */}
            {/*   </span> */}
            {/* </div> */}
          </div>
        </div>
      </a>,
    );
  }

  return (
    <div className="twelve wide tablet column Animated ProposalsTable">
      <div className="ActionableLayout">
        <div className="ActionableLayout__Action">
          <div className="ActionableLayout__Left">
            <div className="ui sub header">10 proposals</div>
          </div>
          <div className="ActionableLayout__Right">
            <div
              role="listbox"
              aria-expanded="false"
              className="ui dropdown SortingMenu Upwards"
              tabIndex="0"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text"
              >
                {selected}
              </div>
              <i aria-hidden="true" className="dropdown icon" />
              <div
                className={
                  openMenu
                    ? 'menu transition right visible'
                    : 'menu transition right'
                }
                style={{ color: '#03AB78' }}
              >
                <div
                  role="option"
                  className="item"
                  onClick={() => handleSelected('Latest')}
                  style={{ color: '#03AB78' }}
                >
                  <span className="text" style={{ color: '#03AB78' }}>
                    Latest
                  </span>
                </div>
                <div
                  role="option"
                  className="item"
                  onClick={() => handleSelected('Oldest')}
                >
                  <span className="text">Oldest</span>
                </div>
              </div>
            </div>
            <a
              href={submit}
              className="dg Link Link--pointer ui small primary button SubmitButton"
              role="button"
              style={{ backgroundColor: '#03AB78' }}
            >
              Submit a proposal
            </a>
          </div>
        </div>
        <div className="ActionableLayout__Content">{el}</div>
      </div>
    </div>
  );
}

ListTable.propTypes = {
  dispatch: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  submit: PropTypes.string.isRequired,
};

const mapStateToProps = createStructuredSelector({
  listTable: makeSelectListTable(),
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

export default compose(withConnect)(ListTable);
