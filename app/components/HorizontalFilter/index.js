/**
 *
 * HorizontalFilter
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
import makeSelectHorizontalFilter from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

function Item({ id, value, name, onClick }) {
  const [active, setActive] = React.useState(false);

  return (
    <li
      key={id}
      data-value={value}
      className={active ? 'disabled active' : 'disabled'}
      onClick={e => {
        setActive(!active);
        onClick(id);
        e.stopPropagation();
      }}
    >
      {name}
    </li>
  );
}

export function HorizontalFilter({ filters, onApply }) {
  useInjectReducer({ key: 'horizontalFilter', reducer });
  useInjectSaga({ key: 'horizontalFilter', saga });
  const [selectedFilter, setSelectedFilter] = React.useState('');
  const [appliedFilters, setAppliedFilters] = React.useState({});

  const handleSelected = key => {
    if (!appliedFilters[key]) {
      appliedFilters[key] = true;
      setAppliedFilters(appliedFilters);
    } else {
      delete appliedFilters[key];
      setAppliedFilters(appliedFilters);
    }
  };

  const filterGroup = filters.map(el => {
    const selectors = el.selectors.map(s => (
      <Item
        key={`${el.filter.value}-${s.value}`}
        id={`${el.filter.value}-${s.value}`}
        value={s.value}
        name={s.name}
        onClick={() => handleSelected(`${el.filter.value}-${s.value}`)}
      />
    ));

    return (
      <div key={`${el.filter.value}`} className="filter-group">
        <small>{el.filter.name}</small>
        <div
          data-filter={el.filter.value}
          data-default=""
          className={
            selectedFilter === el.filter.value ? 'filter active' : 'filter'
          }
          onClick={() => {
            selectedFilter !== el.filter.value
              ? setSelectedFilter(el.filter.value)
              : setSelectedFilter('');
          }}
        >
          <small>{el.filter.name}</small>
          <ul>{selectors}</ul>
        </div>
      </div>
    );
  });

  return (
    <section className="filters new active">
      <div className="container">
        <small className="toggle_filters">
          Filters <span>+</span>
        </small>
        <div className="filters">
          <div
            className="reset"
            aria-hidden="true"
            onClick={e => {
              onApply(appliedFilters);
              e.stopPropagation();
            }}
          >
            <small>Apply</small>
          </div>
          {filterGroup}
        </div>
      </div>
    </section>
  );
}

HorizontalFilter.propTypes = {
  filters: PropTypes.array.isRequired,
  onApply: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  horizontalFilter: makeSelectHorizontalFilter(),
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

export default compose(withConnect)(HorizontalFilter);
