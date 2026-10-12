import { createContext, useContext, useState, type ReactNode } from 'react';
import { Trash2 } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import { createDataTableColumns, DataTable, type DataTableManual } from './DataTable';
import { Select } from './Input';
import { Modal } from './Modal';
import { Tooltip } from './Tooltip';
import { cx } from '../utils/cx';

export type UserRole = 'student' | 'ta' | 'professor' | 'admin';
export type RoleOption = { value: UserRole; label: string };

/** Account status shown as a badge next to Active/Verified. */
export type UserStatus = 'invite_pending' | 'needs_replacement';

export interface KaleiopiUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  university?: string | null;
  promoCode?: string | null;
  role: UserRole;
  /** Disabled accounts can't sign in. */
  active: boolean;
  /** Email verified. */
  verified: boolean;
  /** Terms of Service version the user accepted, e.g. "2026-09-01-draft1". */
  tosVersion?: string | null;
  /** ISO date the Terms were accepted. */
  tosAcceptedAt?: string | null;
  /** Under 18 when they accepted the Terms. Shows a parental-consent badge in the Legal column. */
  isMinor?: boolean | null;
  /** A parent or guardian's consent is on file. Only shown for minors. */
  hasParentalConsent?: boolean | null;
  /** "Invite pending" for an admin who hasn't set a password yet; "needs_replacement" for an admin on a non-Kaleiopi email. */
  status?: UserStatus | null;
}

/** Progress of a resent verification email, per user id. */
export type ResendState = 'sending' | 'sent';

export interface UserTableProps {
  users: KaleiopiUser[];
  /** Options for the role dropdown, the same for every row. */
  roles?: RoleOption[];
  /** Per-row role options; overrides `roles`. With a single option the dropdown is read-only. */
  roleOptions?: (user: KaleiopiUser) => RoleOption[];
  /** The signed-in admin. Their own row can't change role or be deleted. */
  currentUserId?: string;
  /** Rows with a save in flight; their actions are disabled. */
  busyUserIds?: string[];
  onRoleChange: (user: KaleiopiUser, role: UserRole) => void;
  onActiveChange: (user: KaleiopiUser, active: boolean) => void;
  onVerifiedChange: (user: KaleiopiUser, verified: boolean) => void;
  /** Called after the admin confirms in the delete dialog. */
  onDelete: (user: KaleiopiUser) => void;
  /** Resend the verification email. When set, unverified rows get a Resend action. */
  onResendVerification?: (user: KaleiopiUser) => void;
  /** Resend progress by user id: "Sending…" while in flight, "Sent ✓" once delivered. */
  resendState?: Record<string, ResendState>;
  /** Resend an admin invite. When set, "invite pending" rows get a Resend invite action. */
  onResendInvite?: (user: KaleiopiUser) => void;
  /** Server mode: paging, sorting and search happen on the server. See DataTable. */
  manual?: DataTableManual;
  loading?: boolean;
  error?: ReactNode;
  onRetry?: () => void;
  /** Show the search box above the table. */
  searchable?: boolean;
  emptyMessage?: ReactNode;
  className?: string;
}

export const DEFAULT_ROLES: RoleOption[] = [
  { value: 'student', label: 'student' },
  { value: 'ta', label: 'TA' },
  { value: 'professor', label: 'professor' },
  { value: 'admin', label: 'admin' },
];

// Row actions come through context so the column definitions can stay static.
interface RowActions extends Pick<UserTableProps, 'onRoleChange' | 'onActiveChange' | 'onVerifiedChange' | 'onResendVerification' | 'onResendInvite'> {
  rolesFor: (user: KaleiopiUser) => RoleOption[];
  currentUserId?: string;
  busy: Set<string>;
  resendState: Record<string, ResendState>;
  requestDelete: (user: KaleiopiUser) => void;
}
const ActionsContext = createContext<RowActions | null>(null);

const linkButton = 'text-sm font-medium rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-kaleiopi-purple-400 disabled:opacity-50 disabled:cursor-not-allowed';
const empty = <span className="text-gray-400" aria-label="None">—</span>;

function formatDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString();
}

function RowActionsCell({ user }: { user: KaleiopiUser }) {
  const ctx = useContext(ActionsContext)!;
  const isSelf = user.id === ctx.currentUserId;
  const busy = ctx.busy.has(user.id);
  const resend = ctx.resendState[user.id];
  const options = ctx.rolesFor(user);
  const invitePending = user.status === 'invite_pending';
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <div className="flex items-center gap-3">
        <Select
          controlSize="sm"
          className="w-auto min-w-28"
          value={user.role}
          disabled={isSelf || busy || options.length <= 1}
          title={isSelf ? "You can't change your own role" : options.length <= 1 ? 'This role can’t be changed here' : undefined}
          aria-label={`Role for ${user.fullName}`}
          onChange={(e) => ctx.onRoleChange(user, e.target.value as UserRole)}
        >
          {options.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </Select>
      </div>
      {/* Wraps so every action stays visible when the table is narrower than its content. */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <button type="button" disabled={busy} className={cx(linkButton, 'text-kaleiopi-purple-600 hover:text-kaleiopi-purple-800')} onClick={() => ctx.onActiveChange(user, !user.active)}>
          {user.active ? 'Disable' : 'Enable'}
        </button>
        {!invitePending && (
          <button type="button" disabled={busy} className={cx(linkButton, 'text-kaleiopi-purple-600 hover:text-kaleiopi-purple-800')} onClick={() => ctx.onVerifiedChange(user, !user.verified)}>
            {user.verified ? 'Unverify' : 'Verify'}
          </button>
        )}
        {invitePending && ctx.onResendInvite && (
          <button type="button" disabled={busy} className={cx(linkButton, 'text-kaleiopi-purple-600 hover:text-kaleiopi-purple-800')} onClick={() => ctx.onResendInvite!(user)}>
            Resend invite
          </button>
        )}
        {!invitePending && !user.verified && ctx.onResendVerification && (
          <button type="button" disabled={busy || resend === 'sending'} className={cx(linkButton, 'text-kaleiopi-purple-600 hover:text-kaleiopi-purple-800')} onClick={() => ctx.onResendVerification!(user)}>
            {resend === 'sending' ? 'Sending…' : resend === 'sent' ? 'Sent ✓' : 'Resend'}
          </button>
        )}
        {!isSelf && (
          <Tooltip content="Delete account">
            <button
              type="button"
              disabled={busy}
              aria-label={`Delete ${user.fullName}`}
              className={cx(linkButton, 'inline-flex p-1 -m-1 text-red-600 hover:text-red-700')}
              onClick={() => ctx.requestDelete(user)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

const helper = createDataTableColumns<KaleiopiUser>();

const columns = helper.columns([
  // "Name @username", so search matches either and sorting goes by name.
  helper.accessor((u) => `${u.fullName} @${u.username}`, {
    id: 'user',
    header: 'User',
    sortFn: 'alphanumeric',
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="font-medium text-gray-900">{row.original.fullName}</div>
        <div className="text-xs text-gray-500">@{row.original.username}</div>
      </div>
    ),
  }),
  helper.accessor('email', { header: 'Email', sortFn: 'alphanumeric' }),
  helper.accessor((u) => u.university ?? '', { id: 'university', header: 'University', sortFn: 'alphanumeric', cell: (info) => info.getValue() || empty }),
  helper.accessor((u) => u.promoCode ?? '', {
    id: 'promoCode',
    header: 'Promo code',
    enableSorting: false,
    cell: (info) => (info.getValue() ? <span className="font-mono text-xs uppercase">{info.getValue()}</span> : empty),
  }),
  helper.display({
    id: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1.5">
        <Badge tone={row.original.active ? 'success' : 'neutral'}>{row.original.active ? 'Active' : 'Disabled'}</Badge>
        {row.original.status === 'invite_pending' ? (
          <Badge tone="warning">Invite pending</Badge>
        ) : (
          <Badge tone={row.original.verified ? 'success' : 'warning'}>{row.original.verified ? 'Verified' : 'Unverified'}</Badge>
        )}
        {row.original.status === 'needs_replacement' && <Badge tone="danger">Replace with @kaleiopi.app admin</Badge>}
      </div>
    ),
  }),
  helper.accessor((u) => (u.tosAcceptedAt ? new Date(u.tosAcceptedAt) : undefined), {
    id: 'legal',
    header: 'Legal',
    sortFn: 'datetime',
    sortUndefined: 'last',
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <div className="flex flex-col gap-1.5 items-start">
        {row.original.tosVersion ? (
          <div className="text-gray-600">
            <div>ToS v{row.original.tosVersion}</div>
            {row.original.tosAcceptedAt && <div className="text-xs text-gray-500">{formatDate(row.original.tosAcceptedAt)}</div>}
          </div>
        ) : (
          <span className="text-amber-700">Not accepted</span>
        )}
        {row.original.isMinor && (
          <Badge tone={row.original.hasParentalConsent ? 'success' : 'danger'}>
            {row.original.hasParentalConsent ? 'Parent consent on file' : 'Minor — no parent consent'}
          </Badge>
        )}
      </div>
    ),
  }),
  helper.display({ id: 'actions', header: 'Actions', cell: ({ row }) => <RowActionsCell user={row.original} /> }),
]);

/** Admin list of Kaleiopi accounts on DataTable: sortable, searchable (or server-paged), with per-row
 * role, enable/disable, verify/unverify, resend verification or invite (optional), and delete
 * (confirmed in a dialog). Minors show their parental-consent status. */
export function UserTable({
  users,
  roles = DEFAULT_ROLES,
  roleOptions,
  currentUserId,
  busyUserIds,
  onRoleChange,
  onActiveChange,
  onVerifiedChange,
  onDelete,
  onResendVerification,
  resendState = {},
  onResendInvite,
  manual,
  loading,
  error,
  onRetry,
  searchable = true,
  emptyMessage = 'No users yet.',
  className,
}: UserTableProps) {
  const [pendingDelete, setPendingDelete] = useState<KaleiopiUser | null>(null);

  const confirmDelete = () => {
    if (pendingDelete) onDelete(pendingDelete);
    setPendingDelete(null);
  };

  return (
    <ActionsContext.Provider
      value={{
        onRoleChange, onActiveChange, onVerifiedChange, onResendVerification, onResendInvite, resendState,
        rolesFor: roleOptions ?? (() => roles), currentUserId, busy: new Set(busyUserIds), requestDelete: setPendingDelete,
      }}
    >
      <DataTable
        data={users}
        columns={columns}
        getRowId={(u) => u.id}
        searchable={searchable}
        searchPlaceholder="Search name, email, school…"
        searchLabel="Search users"
        manual={manual}
        loading={loading}
        error={error}
        onRetry={onRetry}
        emptyMessage={emptyMessage}
        noMatchMessage={(q) => `No users match “${q}”.`}
        getRowClassName={(u) => (u.active ? undefined : 'bg-gray-50/60')}
        className={className}
      />
      <Modal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title={`Delete ${pendingDelete?.fullName ?? 'user'}?`}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete account</Button>
          </>
        }
      >
        This permanently deletes the account for <strong>{pendingDelete?.email}</strong>. It can't be undone.
      </Modal>
    </ActionsContext.Provider>
  );
}
