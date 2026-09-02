import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

import { Link } from './Link';
import '@/app/styles/globals.css';

const meta: Meta<typeof Link> = {
  title: 'Shared/Link',
  component: Link,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'text'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    underline: { control: 'select', options: ['always', 'hover', 'never'] },
    target: { control: 'select', options: ['_self', '_blank'] },
    ariaLabel: { control: 'text' },
    className: { control: 'text' },
    activeClassName: { control: 'text' },
    to: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    children: 'Go to profile',
    to: '/profile',
    variant: 'primary',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const PrimaryInternalLink: Story = {
  args: {
    variant: 'text',
  },

  name: 'Primary internal link',

  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <Link to="/profile" variant="primary" size="md">
        Go to profile
      </Link>
    </MemoryRouter>
  ),
};

export const SecondaryInternalLink: Story = {
  name: 'Secondary internal link',
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <Link to="/settings" variant="secondary" size="md">
        Settings
      </Link>
    </MemoryRouter>
  ),
};

export const TextInternalLink: Story = {
  args: {
    underline: 'always',
  },

  name: 'Text internal link',

  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <Link to="/help" variant="text" size="md">
        Help
      </Link>
    </MemoryRouter>
  ),
};

export const DifferentSizes: Story = {
  name: 'Different sizes',
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link to="/a" size="sm">
          Size sm
        </Link>
        <Link to="/b" size="md">
          Size md
        </Link>
        <Link to="/c" size="lg">
          Size lg
        </Link>
      </div>
    </MemoryRouter>
  ),
};

export const UnderlineVariants: Story = {
  name: 'Underline variants',
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link to="/u1" underline="always">
          Underline always
        </Link>
        <Link to="/u2" underline="hover">
          Underline hover
        </Link>
        <Link to="/u3" underline="never">
          Underline never
        </Link>
      </div>
    </MemoryRouter>
  ),
};

export const ActiveInternalLink: Story = {
  name: 'Active internal link',
  render: () => (
    <MemoryRouter initialEntries={['/active']}>
      <Link to="/active" activeClassName="is-active">
        Active page
      </Link>
    </MemoryRouter>
  ),
};

export const LinkInTextContext: Story = {
  args: {
    underline: 'never',
  },

  name: 'Link in text context',

  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <p style={{ maxWidth: 420, color: 'var(--text-color)' }}>
        This is regular text, and here is{' '}
        <Link to="/docs" variant="text" underline='hover'>
          a link inside the text
        </Link>{' '}
        that leads to the documentation.
      </p>
    </MemoryRouter>
  ),
};
