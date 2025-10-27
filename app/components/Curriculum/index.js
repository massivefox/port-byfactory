/**
 *
 * Curriculum
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectCurriculum from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

const SectionPrefix = styled.div`
  text-align: center;
  font-size: 0.575rem;
  line-height: 0.6rem;
  font-weight: bold;
  font-family: 'Open Sans', sans-serif;
  letter-spacing: 4px;
  color: #6e767f;
  text-transform: uppercase !important;
`;

const SectionNumber = styled.div`
  text-align: center;
  font-size: 1.75rem;
  line-height: 1.9rem;
  font-weight: normal;
  font-family: 'Open Sans', sans-serif;
  color: #6e767f;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: auto;
  vertical-align: middle;
  height: inherit;
  min-height: 3.5rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: solid;
  border-bottom-width: 0.5px;
  border-bottom-color: #8e969f;
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 2em;
`;

const SectionTitle = styled.div`
  text-align: left;
  margin-top: auto;
  margin-bottom: auto;
  font-size: 17px;
  font-weight: bold;
  letter-spacing: 3px;
  // color: rgb(3, 171, 120);
`;

const Subsection = styled.div`
  text-align: left;
  padding-left: 4em;
`;

export function Curriculum({ data }) {
  useInjectReducer({ key: 'curriculum', reducer });
  useInjectSaga({ key: 'curriculum', saga });
  console.log(data);
  const comp = data.map((el, i) => {
    const { name, subsections } = el;

    return (
      <Section key={name}>
        <SectionHeader>
          <div style={{ margin: 'auto' }}>
            <SectionPrefix>Section</SectionPrefix>
            <SectionNumber>{i + 1}</SectionNumber>
          </div>
        </SectionHeader>
        {subsections && subsections.length > 0 ? (
          <SectionContent>
            <SectionTitle> {name}</SectionTitle>
            <Subsection>
              {subsections.map(s => (
                <ul style={{ listStyleType: 'circle' }}>
                  <li>{s}</li>
                </ul>
              ))}
            </Subsection>
          </SectionContent>
        ) : (
          <SectionContent>
            <SectionTitle> {name}</SectionTitle>
          </SectionContent>
        )}
      </Section>
    );
    // return (
    //   <li className="sample-schedule-list-item columns medium-6 col-1">
    //     {name}
    //     {subsections && subsections.length > 0
    //       ? /* <ul style={{ listStyleType: 'circle' }}> */
    //         subsections.map(s => (
    //           <ul style={{ listStyleType: 'circle' }}>
    //           <li>{s}</li>
    //         </ul>
    //         ))
    //       : /* </ul> */
    //       ''}
    //   </li>
    // );
  });

  return (
    <section
      className="sample-schedule-block content-block"
      style={{ overflow: 'auto' }}
    >
      <div className="row">
        <div className="columns">
          <h2 className="no-top-bar" style={{ marginBottom: '0.7em' }}>
            커리큘럼
          </h2>
        </div>
      </div>
      <div className="row">
        <div className="columns">
          {/* <ol */}
          {/*   className="sample-schedule-list" */}
          {/*   style={{ listStyleType: 'decimal' }} */}
          {/* > */}
          {comp}
          {/* </ol> */}
        </div>
      </div>
    </section>
  );
}

Curriculum.propTypes = {
  curriculum: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  curriculum: makeSelectCurriculum(),
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

export default compose(withConnect)(Curriculum);
