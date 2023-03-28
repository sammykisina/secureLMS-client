import React, { useState } from 'react';
import {
  // createColumnHelper,
  // flexRender,
  // getCoreRowModel,
  // useReactTable,
  Column,
  // Table,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  sortingFns,
  getSortedRowModel,
  FilterFn,
  SortingFn,
  ColumnDef,
  flexRender,
  FilterFns,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import { GlobalFilter } from '@/components';

const Table = ({
  data,
  columns,
  showFilters,
  tableHeight,
}: {
  data: any;
  columns: any;
  showFilters: boolean;
  tableHeight: string;
}) => {
  /**
   * component states
   */
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  /**
   * component functions
   */

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank,
    });
    return itemRank.passed;
  };

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,

    enableFilters: true,
    enableColumnFilters: true,
  });

  return (
    <section className='pb-2'>
      {showFilters && (
        <section
          className={`flex flex-col items-start justify-start  gap-3 px-2 xs:flex-col  sm:flex-col sm:items-start md:flex-col lg:flex-row lg:items-center `}
        >
          {/* global search section */}
          <GlobalFilter
            count={table.getPreGroupedRowModel().flatRows.length}
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            className='font-lg border-block border p-2 shadow'
          />

          {/* filter by section */}
          <div
            className={`flex w-fit flex-col items-center gap-1 duration-300 lg:flex-row`}
          ></div>
        </section>
      )}

      <section className='mt-4 flex w-auto flex-col overflow-y-scroll scrollbar-hide'>
        <div
          className={`w-full overflow-x-scroll rounded-t-[2rem]  border ${
            showFilters ? tableHeight : 'h-fit'
          }`}
        >
          <table className='mx-auto w-full min-w-full  max-w-4xl divide-y divide-textColor/40 overflow-hidden whitespace-nowrap  shadow-sm'>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className='group px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className='divide-gray divide-y duration-300'>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className='text-dark/80 w-[400px]  truncate whitespace-nowrap px-6 py-2 text-sm font-semibold hover:break-words'
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
};

export default Table;
