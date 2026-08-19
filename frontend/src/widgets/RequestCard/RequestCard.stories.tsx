import type { Meta, StoryObj } from '@storybook/react-vite';
import type { SkillShareRequest } from '@/entities/request/types';
import '@/app/styles/globals.css';
import { RequestCard } from './RequestCard';

const pendingRequest: SkillShareRequest = {
  id: 'request-preview-1',
  createdAt: '2026-08-18T09:30:00.000Z',
  status: 'pending',
  isRead: false,
  sender: {
    id: 'sender-1',
    name: 'Анна Петрова',
    email: 'anna.petrova@example.com',
    avatar: null,
    role: 'user',
  },
  receiver: {
    id: 'receiver-1',
    name: 'Кирилл Федотов',
    email: 'kirill.fedotov@example.com',
    avatar: null,
    role: 'user',
  },
  offeredSkill: {
    id: 'skill-1',
    title: 'Фотография',
    description: 'Основы портретной фотографии',
  },
  requestedSkill: {
    id: 'skill-2',
    title: 'Английский язык',
    description: 'Разговорный английский',
  },
};

const meta = {
  title: 'Widgets/RequestCard',
  component: RequestCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    request: pendingRequest,
    direction: 'incoming',
  },
} satisfies Meta<typeof RequestCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IncomingPending: Story = {};

export const IncomingAccepted: Story = {
  args: {
    request: { ...pendingRequest, id: 'request-preview-2', status: 'inProgress' },
  },
};

export const OutgoingPending: Story = {
  args: {
    request: { ...pendingRequest, id: 'request-preview-3' },
    direction: 'outgoing',
  },
};
