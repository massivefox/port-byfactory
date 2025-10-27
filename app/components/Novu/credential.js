import React from 'react';
import { Novu, ChatProviderIdEnum } from '@novu/node';
import config from '../../config';

export function NovuCredentials() {
  const novuConfig = {
    backendUrl: config.novu.backendUrl,
  };
  const Identifier = config.novu.adminIdentifier;
  const novu = new Novu(config.novu.apiKey, novuConfig);

  novu.subscribers.setCredentials(Identifier, ChatProviderIdEnum.Slack, {
    webhookUrl: config.novu.slackWebHookUrl,
  });
}
