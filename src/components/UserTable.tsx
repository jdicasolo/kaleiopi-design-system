import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  tableFeatures,
  useTable,
  type Header,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import { Input, Select } from './Input';
import { Modal } from './Modal';
import { cx } from '../utils/cx';

export type UserRole = 'student' | 'ta' | 'professor' | 'admin';

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
}

/** Progress of a resent verification email, per user id. */
export type ResendState = 'sending' | 'sent';

export interface UserTableProps {
  users: KaleiopiUser[];
  /** Options for the role dropdown. */
  roles?: { value: UserRole; label: string }[];
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
  /** Show the search box above the table. */
  searchable?: boolean;
  emptyMessage?: ReactNode;
  className?: string;
}

export const DEFAULT_ROLES: NonNullable<UserTableProps['roles']> = [
  { value: 'student', label: 'student' },
  { value: 'ta', label: 'TA' },
  { value: 'professor', label: 'professor' },
  { value: 'admin', label: 'admin' },
];

const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, datetime: sortFn_datetime },
  filterFns: { includesString: filterFn_includesString },
});

// Row actions come through context so the column definitions can stay static.
interface RowActions extends Pick<UserTableProps, 'onRoleChange' | 'onActiveChange' | 'onVerifiedChange' | 'onResendVerification'> {
  roles: NonNullable<UserTableProps['roles']>;
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
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <div className="flex items-center gap-3">
        <Select
          controlSize="sm"
          className="w-auto min-w-28"
          value={user.role}
          disabled={isSelf || busy}
          title={isSelf ? "You can't change your own role" : undefined}
          aria-label={`Role for ${user.fullName}`}
          onChange={(e) => ctx.onRoleChange(user, e.target.value as UserRole)}
        >
          {ctx.roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </Select>
      </div>
      {/* Wraps so every action stays visible when the table is narrower than its content. */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <button type="button" disabled={busy} className={cx(linkButton, 'text-kaleiopi-purple-600 hover:text-kaleiopi-purple-800')} onClick={() => ctx.onActiveChange(user, !user.active)}>
          {user.active ? 'Disable' : 'Enable'}
        </button>
        <button type="button" disabled={busy} className={cx(linkButton, 'text-kaleiopi-purple-600 hover:text-kaleiopi-purple-800')} onClick={() => ctx.onVerifiedChange(user, !user.verified)}>
          {user.verified ? 'Unverify' : 'Verify'}
        </button>
        {!user.verified && ctx.onResendVerification && (
          <button type="button" disabled={busy || resend === 'sending'} className={cx(linkButton, 'text-kaleiopi-purple-600 hover:text-kaleiopi-purple-800')} onClick={() => ctx.onResendVerification!(user)}>
            {resend === 'sending' ? 'Sending…' : resend === 'sent' ? 'Sent ✓' : 'Resend'}
          </button>
        )}
        {!isSelf && (
          <button type="button" disabled={busy} className={cx(linkButton, 'text-red-600 hover:text-red-700')} onClick={() => ctx.requestDelete(user)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

const helper = createColumnHelper<typeof features, KaleiopiUser>();

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
        <Badge tone={row.original.verified ? 'success' : 'warning'}>{row.original.verified ? 'Verified' : 'Unverified'}</Badge>
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
            {row.original.tosAcceptedAt && <div className="text-xs text-gray-400">{formatDate(row.original.tosAcceptedAt)}</div>}
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

function SortableHeader({ header }: { header: Header<typeof features, KaleiopiUser, unknown> }) {
  const label = header.column.columnDef.header as string;
  if (!header.column.getCanSort()) return <>{label}</>;
  const sorted = header.column.getIsSorted();
  const Icon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown;
  return (
    <button
      type="button"
      onClick={header.column.getToggleSortingHandler()}
      className="inline-flex items-center gap-1 uppercase tracking-wide rounded hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-kaleiopi-purple-400"
    >
      {label}
      <Icon className={cx('w-3.5 h-3.5', !sorted && 'opacity-40')} />
    </button>
  );
}

/** Admin list of Kaleiopi accounts: sortable, searchable, with per-row role,
 * enable/disable, verify/unverify, resend verification (optional), and delete
 * (confirmed in a dialog). Minors show their parental-consent status. */
export function UserTable({
  users,
  roles = DEFAULT_ROLES,
  currentUserId,
  busyUserIds,
  onRoleChange,
  onActiveChange,
  onVerifiedChange,
  onDelete,
  onResendVerification,
  resendState = {},
  searchable = true,
  emptyMessage = 'No users yet.',
  className,
}: UserTableProps) {
  const [pendingDelete, setPendingDelete] = useState<KaleiopiUser | null>(null);
  const table = useTable({
    features,
    columns,
    data: users,
    getRowId: (u) => u.id,
    globalFilterFn: 'includesString',
    enableSortingRemoval: false,
    getColumnCanGlobalFilter: (column) => !['status', 'actions', 'legal'].includes(column.id),
  });
  const rows = table.getRowModel().rows;
  const search = (table.state.globalFilter as string | undefined) ?? '';

  const confirmDelete = () => {
    if (pendingDelete) onDelete(pendingDelete);
    setPendingDelete(null);
  };

  return (
    <ActionsContext.Provider value={{ onRoleChange, onActiveChange, onVerifiedChange, onResendVerification, resendState, roles, currentUserId, busy: new Set(busyUserIds), requestDelete: setPendingDelete }}>
      <div className={cx('flex flex-col gap-3', className)}>
        {searchable && (
          <div className="relative max-w-xs">
            <Search aria-hidden="true" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input controlSize="sm" className="pl-8" type="search" placeholder="Search name, email, school…" aria-label="Search users" value={search} onChange={(e) => table.setGlobalFilter(e.target.value)} />
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => {
                    const sorted = header.column.getIsSorted();
                    return (
                      <th key={header.id} scope="col" className="px-4 py-3 align-bottom" aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}>
                        <SortableHeader header={header} />
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className={cx('align-middle', !row.original.active && 'bg-gray-50/60')}>
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-gray-700">
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-500">
                    {search ? `No users match “${search}”.` : emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
