import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  tableFeatures,
  useTable,
  type CellData,
  type ColumnDef,
  type Header,
  type RowData,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Alert } from './Alert';
import { Button } from './Button';
import { Input, Select } from './Input';
import { cx } from '../utils/cx';

const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, datetime: sortFn_datetime, basic: sortFn_basic },
  filterFns: { includesString: filterFn_includesString },
});

/** The TanStack feature set every DataTable uses. Build columns with `createDataTableColumns`. */
export type DataTableFeatures = typeof features;
export type DataTableColumn<T extends RowData> = ColumnDef<DataTableFeatures, T, CellData>;
export type DataTableSort = { id: string; desc: boolean };

/** Column helper typed for DataTable, e.g. `const col = createDataTableColumns<Row>()`. */
export function createDataTableColumns<T extends RowData>() {
  return createColumnHelper<DataTableFeatures, T>();
}

/** Everything a server-backed table needs to re-query: one object, replaced on every change. */
export interface DataTableQuery {
  pageIndex: number;
  pageSize: number;
  sorting: DataTableSort[];
  globalFilter: string;
}

export interface DataTableManual extends DataTableQuery {
  /** Total matching rows across all pages. */
  total: number;
  onChange: (query: DataTableQuery) => void;
}

export interface DataTableProps<T extends RowData> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  /** Show the search box above the table. */
  searchable?: boolean;
  searchPlaceholder?: string;
  searchLabel?: string;
  /**
   * Server mode: the page owns paging, sorting and search, re-queries on `onChange`,
   * and passes the current page as `data`. Omit for client mode (sort/filter in memory, no paging).
   */
  manual?: DataTableManual;
  /** Page size options for the pager (server mode). */
  pageSizeOptions?: number[];
  /** Shows skeleton rows. */
  loading?: boolean;
  /** After this long still loading, a "Still loading…" note appears. */
  loadingTimeoutMs?: number;
  /** Replaces the table body with an error. */
  error?: ReactNode;
  /** Adds a "Try again" button to the error. */
  onRetry?: () => void;
  emptyMessage?: ReactNode;
  /** Shown when a search matches nothing. */
  noMatchMessage?: (query: string) => ReactNode;
  /** Makes rows clickable and keyboard-activatable (Enter / Space). */
  onRowClick?: (row: T) => void;
  /** Accessible name for a clickable row, e.g. "Open Penn State". */
  rowLabel?: (row: T) => string;
  getRowClassName?: (row: T) => string | undefined;
  className?: string;
}

const SEARCH_DEBOUNCE_MS = 300;
const SKELETON_ROWS = 5;

function SortableHeader({ header }: { header: Header<DataTableFeatures, any, unknown> }) {
  const label = header.column.columnDef.header as ReactNode;
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
      <Icon aria-hidden="true" className={cx('w-3.5 h-3.5', !sorted && 'opacity-40')} />
    </button>
  );
}

/** Sortable, searchable table on TanStack Table. Client mode sorts and filters `data` in memory;
 * `manual` mode hands paging, sorting and search to the server. Handles loading, error, empty. */
export function DataTable<T extends RowData>({
  data,
  columns,
  getRowId,
  searchable = true,
  searchPlaceholder = 'Search…',
  searchLabel = 'Search',
  manual,
  pageSizeOptions = [25, 50, 100],
  loading = false,
  loadingTimeoutMs = 10_000,
  error,
  onRetry,
  emptyMessage = 'Nothing here yet.',
  noMatchMessage = (q) => `No results match “${q}”.`,
  onRowClick,
  rowLabel,
  getRowClassName,
  className,
}: DataTableProps<T>) {
  // Client mode keeps sorting and search here; manual mode mirrors the page's query.
  const [clientSorting, setClientSorting] = useState<SortingState>([]);
  const [clientFilter, setClientFilter] = useState('');
  const sorting = manual ? manual.sorting : clientSorting;
  const globalFilter = manual ? manual.globalFilter : clientFilter;

  // The search box updates instantly; in manual mode the query is sent after a pause.
  const [searchText, setSearchText] = useState(globalFilter);
  const manualRef = useRef(manual);
  manualRef.current = manual;
  useEffect(() => {
    if (!manual) return;
    if (searchText === manual.globalFilter) return;
    const timer = setTimeout(() => {
      const m = manualRef.current!;
      m.onChange({ pageIndex: 0, pageSize: m.pageSize, sorting: m.sorting, globalFilter: searchText });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchText]);

  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!loading) return setSlow(false);
    const timer = setTimeout(() => setSlow(true), loadingTimeoutMs);
    return () => clearTimeout(timer);
  }, [loading, loadingTimeoutMs]);

  const table = useTable({
    features,
    columns,
    data,
    getRowId,
    globalFilterFn: 'includesString',
    enableSortingRemoval: false,
    manualSorting: Boolean(manual),
    manualFiltering: Boolean(manual),
    state: { sorting, globalFilter },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      if (manual) manual.onChange({ pageIndex: 0, pageSize: manual.pageSize, sorting: next, globalFilter: manual.globalFilter });
      else setClientSorting(next);
    },
    onGlobalFilterChange: (updater) => {
      const next = typeof updater === 'function' ? updater(globalFilter) : updater;
      if (!manual) setClientFilter(next ?? '');
    },
  });

  const rows = table.getRowModel().rows;
  const pageCount = manual ? Math.max(1, Math.ceil(manual.total / manual.pageSize)) : 1;
  const goTo = (pageIndex: number) => manual?.onChange({ pageIndex, pageSize: manual.pageSize, sorting: manual.sorting, globalFilter: manual.globalFilter });

  const onSearch = (value: string) => {
    setSearchText(value);
    if (!manual) table.setGlobalFilter(value);
  };

  const colSpan = columns.length;
  let body: ReactNode;
  if (error) {
    body = (
      <tr>
        <td colSpan={colSpan} className="p-4">
          <Alert
            tone="error"
            title="Couldn't load this table"
            action={onRetry && <Button size="sm" variant="secondary" pill onClick={onRetry}>Try again</Button>}
          >
            {error}
          </Alert>
        </td>
      </tr>
    );
  } else if (loading) {
    body = Array.from({ length: SKELETON_ROWS }, (_, i) => (
      <tr key={`skeleton-${i}`} aria-hidden="true">
        {columns.map((_, j) => (
          <td key={j} className="px-4 py-3">
            <div className="h-4 rounded bg-gray-100 animate-pulse" />
          </td>
        ))}
      </tr>
    ));
  } else if (rows.length === 0) {
    body = (
      <tr>
        <td colSpan={colSpan} className="px-4 py-10 text-center text-gray-500">
          {globalFilter ? noMatchMessage(globalFilter) : emptyMessage}
        </td>
      </tr>
    );
  } else {
    body = rows.map((row) => {
      const clickable = Boolean(onRowClick);
      return (
        <tr
          key={row.id}
          className={cx(
            'align-middle',
            clickable && 'cursor-pointer hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-kaleiopi-purple-400',
            getRowClassName?.(row.original),
          )}
          tabIndex={clickable ? 0 : undefined}
          aria-label={clickable ? rowLabel?.(row.original) : undefined}
          onClick={clickable ? () => onRowClick!(row.original) : undefined}
          onKeyDown={
            clickable
              ? (e) => {
                  if (e.target !== e.currentTarget) return; // let buttons inside the row handle their own keys
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onRowClick!(row.original);
                  }
                }
              : undefined
          }
        >
          {row.getAllCells().map((cell) => (
            <td key={cell.id} className="px-4 py-3 text-gray-700">
              <table.FlexRender cell={cell} />
            </td>
          ))}
        </tr>
      );
    });
  }

  return (
    <div className={cx('flex flex-col gap-3', className)}>
      {searchable && (
        <div className="relative max-w-xs">
          <Search aria-hidden="true" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input controlSize="sm" className="pl-8" type="search" placeholder={searchPlaceholder} aria-label={searchLabel} value={searchText} onChange={(e) => onSearch(e.target.value)} />
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto" aria-busy={loading || undefined}>
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
          <tbody className="divide-y divide-gray-100">{body}</tbody>
        </table>
      </div>
      {loading && slow && (
        <p role="status" className="text-sm text-gray-500">Still loading… this is taking longer than usual.</p>
      )}
      {manual && !error && (
        <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
          <span>
            {manual.total === 1 ? '1 result' : `${manual.total.toLocaleString()} results`} · Page {Math.min(manual.pageIndex + 1, pageCount)} of {pageCount}
          </span>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 whitespace-nowrap">
              Rows per page
              <Select
                controlSize="sm"
                className="w-auto"
                value={manual.pageSize}
                onChange={(e) => manual.onChange({ pageIndex: 0, pageSize: Number(e.target.value), sorting: manual.sorting, globalFilter: manual.globalFilter })}
              >
                {pageSizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
              </Select>
            </label>
            <Button size="sm" variant="secondary" aria-label="Previous page" disabled={loading || manual.pageIndex <= 0} onClick={() => goTo(manual.pageIndex - 1)}>
              <ChevronLeft aria-hidden="true" className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" aria-label="Next page" disabled={loading || manual.pageIndex + 1 >= pageCount} onClick={() => goTo(manual.pageIndex + 1)}>
              <ChevronRight aria-hidden="true" className="w-4 h-4" />
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
