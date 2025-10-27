import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { setContentHeader as sch } from 'components/BaseApp/actions';

import reducer from './reducer';
import saga from './saga';

function wrap(mapStateToProps, dtp, component) {
  const mapDispatchToProps = dispatch => ({
    dispatch,
    setContentHeader: (title, description) => {
      dispatch(sch(title, description));
    },
    ...dtp(dispatch),
  });

  const wrappedComponent = (...args) => {
    useInjectReducer({ key: 'baseApp', reducer });
    useInjectSaga({ key: 'baseApp', saga });

    // console.log(args);
    const [load, setLoad] = useState(false);

    React.useEffect(() => {
      if (!load) {
        const { setContentHeader, title, description } = args[0];
        setContentHeader(title, description);
        setLoad(true);
      }
    }, [load]);

    return component(...args);
  };

  const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
  );

  return compose(withConnect)(wrappedComponent);
}

export default wrap;
