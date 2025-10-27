import { Novu } from '@novu/node';
import config from '../../config';

export async function notificationTrigger(notice, receivers, data) {
  const novuConfig = {
    backendUrl: config.novu.backendUrl,
  };
  const novu = new Novu(config.novu.apiKey, novuConfig);
  await novu.trigger(notice, {
    to: receivers,
    payload: {
      inputdata: data,
    },
  });
  // 관리자에게 전송
  await novu.trigger(notice, {
    to: config.novu.adminIdentifier,
    payload: {
      inputdata: data,
    },
  });
}
