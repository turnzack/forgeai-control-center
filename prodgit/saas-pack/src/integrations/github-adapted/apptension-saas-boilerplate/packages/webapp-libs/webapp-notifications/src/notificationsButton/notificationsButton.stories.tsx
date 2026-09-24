/**
 * @provenance
 * Source Repository: https://github.com/apptension/saas-boilerplate
 * Original File: saas-boilerplate-master/packages/webapp-libs/webapp-notifications/src/notificationsButton/notificationsButton.stories.tsx
 * License: MIT
 * Adapted by: ForgeAI Studio Builder for saas-pack
 * Generated: 2026-09-24T00:34:53.724Z
 */

import { action } from '@storybook/addon-actions';
import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { append } from 'ramda';

import { fillNotificationsListQuery } from '../tests/factories';
import { withProviders } from '../utils/storybook';
import { NotificationsButton, NotificationsButtonProps } from './notificationsButton.component';

const Template: StoryFn<NotificationsButtonProps> = (args: NotificationsButtonProps) => {
  return <NotificationsButton {...args} />;
};

const meta: Meta = {
  title: 'Notifications/NotificationsButton',
  component: NotificationsButton,
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: Template,
  args: { onClick: action('on click') },

  decorators: [
    withProviders({
      apolloMocks: append(fillNotificationsListQuery([], { hasUnreadNotifications: false })),
    }),
  ],
};

export const WithUnreadDot: StoryObj<typeof meta> = {
  render: Template,
  args: { onClick: action('on click') },

  decorators: [
    withProviders({
      apolloMocks: append(fillNotificationsListQuery([], { hasUnreadNotifications: true, unreadNotificationsCount: 0 })),
    }),
  ],
};

export const WithUnreadCount: StoryObj<typeof meta> = {
  render: Template,
  args: { onClick: action('on click') },

  decorators: [
    withProviders({
      apolloMocks: append(fillNotificationsListQuery([], { hasUnreadNotifications: true, unreadNotificationsCount: 5 })),
    }),
  ],
};

export const WithHighUnreadCount: StoryObj<typeof meta> = {
  render: Template,
  args: { onClick: action('on click') },

  decorators: [
    withProviders({
      apolloMocks: append(fillNotificationsListQuery([], { hasUnreadNotifications: true, unreadNotificationsCount: 150 })),
    }),
  ],
};
