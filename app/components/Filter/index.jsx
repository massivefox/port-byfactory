import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import './filter.css';
import { Link } from 'react-router-dom';

export function Filter({ name, items }) {
  const [open, setOpen] = React.useState(true);

  const links = [];
  for (let i = 0; i < items.length; i++) {
    const { image, title, link } = items[i];
    links.push(
      <Link
        key={`${link}-${i}-filter`}
        to={link}
        className="CategoryOption CategoryOption--all CategoryOption--active CategoryFilter__CategoryOption"
      >
        {image && image !== '' ? (
          <span>
            <img src={image} alt="" width="24" height="24" />
          </span>
        ) : (
          <div />
        )}
        <span key={`filterspan-${i}`}>
          <p className="dg Paragraph Paragraph--semi-bold Paragraph--tiny">
            {title}
          </p>
        </span>
      </Link>,
    );
  }

  return (
    <div className="CollapsibleFilter">
      <div className="FilterHeader" onClick={() => setOpen(!open)}>
        <div className="ui sub header FilterHeader__Title">{name}</div>
        <div className="PlusMinusContainer">
          <div className={open ? 'PlusMinus' : 'PlusMinus PlusMinus--closed'} />
          <div className="PlusMinus" />
        </div>
      </div>
      <div
        className={open ? 'FilterContent FilterContent--open' : 'FilterContent'}
      >
        {links}
      </div>
    </div>
  );
}

Filter.propTypes = {
  name: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Filter);
