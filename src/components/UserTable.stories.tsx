import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { UserTable, type KaleiopiUser } from './UserTable';

const TOS = '2026-09-01-draft1';

const USERS: KaleiopiUser[] = [
  { id: '1', fullName: 'Kaleiopi Admin', username: 'admin', email: 'admin@kaleiopi.app', role: 'admin', active: true, verified: true, tosVersion: TOS, tosAcceptedAt: '2026-09-26T12:00:00Z' },
  { id: '2', fullName: 'Lindsay F', username: 'lrf113', email: 'lrf113@psu.edu', university: 'Penn State University', role: 'student', active: true, verified: true, tosVersion: TOS, tosAcceptedAt: '2026-10-11T12:00:00Z' },
  { id: '3', fullName: 'Lindsay D', username: 'lindsay', email: 'lindsay@psu.edu', university: 'Penn State University', role: 'student', active: true, verified: true, tosVersion: TOS, tosAcceptedAt: '2026-10-10T12:00:00Z' },
  { id: '4', fullName: 'Linz4es', username: 'linz4es', email: 'linz4es@psu.edu', university: 'Penn State University', role: 'student', active: true, verified: true, tosVersion: TOS, tosAcceptedAt: '2026-10-10T12:00:00Z' },
  { id: '5', fullName: 'Linzers', username: 'LRDrdd', email: 'LRDrdd@psu.edu', university: 'Penn State University', role: 'student', active: true, verified: true, tosVersion: TOS, tosAcceptedAt: '2026-10-10T12:00:00Z' },
  { id: '6', fullName: 'LinzPSU', username: 'lrd114', email: 'lrd114@psu.edu', university: 'Penn State University', role: 'student', active: true, verified: true, tosVersion: TOS, tosAcceptedAt: '2026-10-10T12:00:00Z' },
];

const MIXED: KaleiopiUser[] = [
  ...USERS.slice(0, 2),
  { id: '7', fullName: 'Dana Whitfield', username: 'dwhitfield', email: 'dwhitfield@psu.edu', university: 'Penn State University', role: 'professor', active: true, verified: true, tosVersion: TOS, tosAcceptedAt: '2026-09-30T12:00:00Z' },
  { id: '8', fullName: 'Marcus Chen', username: 'mchen', email: 'mchen@psu.edu', university: 'Penn State University', promoCode: 'NITTANY25', role: 'ta', active: true, verified: false, tosVersion: TOS, tosAcceptedAt: '2026-10-02T12:00:00Z' },
  { id: '9', fullName: 'Sam Rivera', username: 'srivera', email: 'srivera@pitt.edu', university: 'University of Pittsburgh', promoCode: 'PANTHER', role: 'student', active: false, verified: true, tosVersion: TOS, tosAcceptedAt: '2026-09-28T12:00:00Z' },
  { id: '10', fullName: 'Priya Shah', username: 'pshah', email: 'pshah@psu.edu', university: 'Penn State University', role: 'student', active: true, verified: false },
];

/** Applies each action to local state, as the admin page would after its API call succeeds. */
function useMockUsers(initial: KaleiopiUser[]) {
  const [users, setUsers] = useState(initial);
  const update = (id: string, patch: Partial<KaleiopiUser>) => setUsers((all) => all.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  return {
    users,
    onRoleChange: (u: KaleiopiUser, role: KaleiopiUser['role']) => update(u.id, { role }),
    onActiveChange: (u: KaleiopiUser, active: boolean) => update(u.id, { active }),
    onVerifiedChange: (u: KaleiopiUser, verified: boolean) => update(u.id, { verified }),
    onDelete: (u: KaleiopiUser) => setUsers((all) => all.filter((x) => x.id !== u.id)),
  };
}

const meta = {
  title: 'Components/UserTable',
  component: UserTable,
  args: { users: USERS, currentUserId: '1', onRoleChange: fn(), onActiveChange: fn(), onVerifiedChange: fn(), onDelete: fn() },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof UserTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The admin users page from the reference screenshot. The signed-in admin's own row can't change role or be deleted. */
export const Default: Story = {};

/** Every action works against local state: change roles, disable, verify, delete. */
export const Interactive: Story = {
  args: { users: MIXED },
  render: function Render(args) {
    const mock = useMockUsers(args.users);
    return <UserTable {...args} {...mock} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);

    await userEvent.selectOptions(canvas.getByLabelText('Role for Lindsay F'), 'ta');
    await expect(canvas.getByLabelText('Role for Lindsay F')).toHaveValue('ta');

    const samRow = canvas.getByText('Sam Rivera').closest('tr')!;
    await userEvent.click(within(samRow).getByRole('button', { name: 'Enable' }));
    await expect(within(samRow).getByText('Active')).toBeInTheDocument();

    const priyaRow = canvas.getByText('Priya Shah').closest('tr')!;
    await userEvent.click(within(priyaRow).getByRole('button', { name: 'Verify' }));
    await expect(within(priyaRow).getByText('Verified')).toBeInTheDocument();

    await userEvent.click(within(priyaRow).getByRole('button', { name: 'Delete' }));
    await userEvent.click(page.getByRole('button', { name: 'Delete account' }));
    await expect(canvas.queryByText('Priya Shah')).not.toBeInTheDocument();
  },
};

/** Disabled, unverified, promo-code, and never-accepted-terms users. */
export const MixedStates: Story = { args: { users: MIXED } };

/** Delete asks first; cancelling leaves the user alone. */
export const DeleteNeedsConfirmation: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(within(canvas.getByText('Lindsay D').closest('tr')!).getByRole('button', { name: 'Delete' }));
    const dialog = within(document.body).getByRole('dialog', { name: 'Delete Lindsay D?' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await expect(args.onDelete).not.toHaveBeenCalled();
  },
};

/** Search matches name, username, email, university, and promo code. */
export const Search: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search users' }), 'lrd');
    await expect(canvas.getAllByRole('row')).toHaveLength(1 + 2); // header + Linzers, LinzPSU
  },
};

/** Rows with a save in flight have their actions disabled. */
export const Saving: Story = { args: { busyUserIds: ['2'] } };

export const Empty: Story = { args: { users: [] } };
