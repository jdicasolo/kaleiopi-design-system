import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createDataTableColumns, DataTable, type DataTableQuery } from './DataTable';

interface University {
  id: string;
  name: string;
  domains: string[];
  users: number;
  courses: number;
}

const UNIVERSITIES: University[] = [
  { id: '1', name: 'Penn State University', domains: ['psu.edu'], users: 1840, courses: 14 },
  { id: '2', name: 'University of Michigan', domains: ['umich.edu', 'med.umich.edu'], users: 920, courses: 12 },
  { id: '3', name: 'University of Pittsburgh', domains: ['pitt.edu'], users: 410, courses: 11 },
  { id: '4', name: 'Ohio State University', domains: ['osu.edu'], users: 0, courses: 10 },
  { id: '5', name: 'Rutgers University', domains: ['rutgers.edu', 'scarletmail.rutgers.edu'], users: 77, courses: 9 },
];

const col = createDataTableColumns<University>();
const COLUMNS = col.columns([
  col.accessor('name', { header: 'University', sortFn: 'alphanumeric', cell: (info) => <span className="font-medium text-gray-900">{info.getValue()}</span> }),
  col.accessor((u) => u.domains.join(', '), { id: 'domains', header: 'Domains', enableSorting: false }),
  col.accessor('users', { header: 'Users', sortFn: 'basic' }),
  col.accessor('courses', { header: 'Courses', sortFn: 'basic' }),
]);

/** 120 fake courses, served a page at a time like the admin API. */
const ALL_COURSES = Array.from({ length: 120 }, (_, i) => ({
  id: String(i + 1),
  code: `CMPSC ${String(100 + i)}`,
  name: `Course ${i + 1}`,
  enrolled: (i * 37) % 200,
}));
type Course = (typeof ALL_COURSES)[number];
const courseCol = createDataTableColumns<Course>();
const COURSE_COLUMNS = courseCol.columns([
  courseCol.accessor('code', { header: 'Code' }),
  courseCol.accessor('name', { header: 'Name' }),
  courseCol.accessor('enrolled', { header: 'Enrolled' }),
]);

function queryCourses(q: DataTableQuery) {
  const term = q.globalFilter.toLowerCase();
  let rows = ALL_COURSES.filter((c) => !term || c.code.toLowerCase().includes(term) || c.name.toLowerCase().includes(term));
  const sort = q.sorting[0];
  if (sort) {
    const key = sort.id as keyof Course;
    rows = [...rows].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0) * (sort.desc ? -1 : 1));
  }
  return { items: rows.slice(q.pageIndex * q.pageSize, (q.pageIndex + 1) * q.pageSize), total: rows.length };
}

const meta = {
  title: 'Components/DataTable',
  component: DataTable<University>,
  args: { data: UNIVERSITIES, columns: COLUMNS, getRowId: (u: University) => u.id, searchPlaceholder: 'Search universities…', searchLabel: 'Search universities' },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DataTable<University>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Client mode: sorts and searches the rows it was given. */
export const Default: Story = {};

/** Click a header to sort; click again to flip. Unsortable columns have no button. */
export const Sorting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const names = () => canvas.getAllByRole('row').slice(1).map((r) => within(r).getAllByRole('cell')[0].textContent);
    await userEvent.click(canvas.getByRole('button', { name: 'Users' }));
    await expect(canvas.getByRole('columnheader', { name: 'Users' })).toHaveAttribute('aria-sort');
    const first = names();
    await userEvent.click(canvas.getByRole('button', { name: 'Users' }));
    await expect(names()).toEqual([...first].reverse());
    await expect(within(canvas.getByRole('columnheader', { name: 'Domains' })).queryByRole('button')).not.toBeInTheDocument();
  },
};

/** Search matches any searchable column, including joined values like domains. */
export const Search: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search universities' }), 'umich');
    await expect(canvas.getAllByRole('row')).toHaveLength(1 + 1);
    await userEvent.clear(canvas.getByRole('searchbox', { name: 'Search universities' }));
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search universities' }), 'nowhere');
    await expect(canvas.getByText('No results match “nowhere”.')).toBeInTheDocument();
  },
};

/** Server mode: the page re-queries on every change. Search waits for a pause before querying. */
export const ServerPaging: Story = {
  render: function Render() {
    const [query, setQuery] = useState<DataTableQuery>({ pageIndex: 0, pageSize: 25, sorting: [], globalFilter: '' });
    const page = useMemo(() => queryCourses(query), [query]);
    return (
      <DataTable
        data={page.items}
        columns={COURSE_COLUMNS}
        getRowId={(c) => c.id}
        searchLabel="Search courses"
        manual={{ ...query, total: page.total, onChange: setQuery }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/120 results · Page 1 of 5/)).toBeInTheDocument();
    await expect(canvas.getAllByRole('row')).toHaveLength(1 + 25);
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(canvas.getByText(/Page 2 of 5/)).toBeInTheDocument();
    await expect(canvas.getByText('CMPSC 125')).toBeInTheDocument();
    await userEvent.selectOptions(canvas.getByLabelText('Rows per page'), '50');
    await expect(canvas.getByText(/Page 1 of 3/)).toBeInTheDocument();
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search courses' }), 'Course 11');
    await waitFor(() => expect(canvas.getByText(/^11 results/)).toBeInTheDocument());
    await expect(canvas.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Next page' })).toBeDisabled();
  },
};

/** Skeleton rows while the first page loads. */
export const Loading: Story = { args: { data: [], loading: true } };

/** Loading that runs long says so (the timeout is shortened here). */
export const LoadingTimeout: Story = {
  args: { data: [], loading: true, loadingTimeoutMs: 50 },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(within(canvasElement).getByText(/Still loading/)).toBeInTheDocument());
  },
};

/** A failed load replaces the rows with an error and a retry button. */
export const Error: Story = {
  args: { data: [], error: 'The server took too long to respond.', onRetry: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('The server took too long to respond.');
    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }));
    await expect(args.onRetry).toHaveBeenCalledOnce();
  },
};

export const Empty: Story = { args: { data: [], emptyMessage: 'No universities yet. Add the first one above.' } };

/** Rows open on click, Enter or Space. */
export const ClickableRows: Story = {
  args: { onRowClick: fn(), rowLabel: (u: University) => `Open ${u.name}` },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('University of Pittsburgh'));
    await expect(args.onRowClick).toHaveBeenLastCalledWith(expect.objectContaining({ id: '3' }));
    canvas.getByRole('row', { name: 'Open Rutgers University' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onRowClick).toHaveBeenLastCalledWith(expect.objectContaining({ id: '5' }));
  },
};
