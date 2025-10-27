import { toast } from 'react-toastify';
import { css } from 'styled-components';

const toastOption = {
  hideProgressBar: true,
  style: {
    // backgroundColor: 'var(--biyard)',
    // color: 'white',
    opacity: '0.95',
  },
};

export const byToast = (message, type) => {
  if (!type || !['info', 'success', 'warn', 'error'].includes(type)) {
    return toast(message, toastOption);
  }

  return toast[type](message, toastOption);
};
