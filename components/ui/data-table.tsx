"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AccessorKeyColumnDef,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Header,
  Row,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, Filter as FilterIcon, Filter as FilterIconFilled, X } from "lucide-react"
import * as React from "react"
import { useState } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumn?: string
  filterPlaceholder?: string
}

// Helper for numeric filter operators
const NUMERIC_OPERATORS = [
  { label: "=", value: "eq" },
  { label: ">", value: "gt" },
  { label: "<", value: "lt" },
  { label: ">=", value: "gte" },
  { label: "<=", value: "lte" },
  { label: "!=", value: "neq" },
]

function applyNumericFilter(operator: string, cellValue: any, filterValue: any) {
  const num = Number(cellValue)
  const filterNum = Number(filterValue)
  switch (operator) {
    case "eq": return num === filterNum
    case "gt": return num > filterNum
    case "lt": return num < filterNum
    case "gte": return num >= filterNum
    case "lte": return num <= filterNum
    case "neq": return num !== filterNum
    default: return true
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder = "Filter...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  // Track numeric filter operators per column
  const [numericOperators, setNumericOperators] = React.useState<Record<string, string>>({})
  const [filterDropdownOpen, setFilterDropdownOpen] = useState<string | null>(null)

  // Patch columns to add filterFn for numeric columns
  const patchedColumns = columns.map(col => {
    const accessorKey = (col as AccessorKeyColumnDef<TData, TValue>).accessorKey as keyof TData

    if (col.enableColumnFilter && accessorKey && typeof data[0]?.[accessorKey] === "number") {
      return {
        ...col,
        filterFn: (row: Row<TData>, columnId: string, filterValue: any) => {
          const operator = numericOperators[columnId] || "eq"
          if (accessorKey === "winrate") {
            const filterNum = Number(filterValue) / 100
            return applyNumericFilter(operator, row.getValue(columnId), filterNum)
          }
          return applyNumericFilter(operator, row.getValue(columnId), filterValue)
        },
      }
    }
    return col
  })

  const table = useReactTable({
    data,
    columns: patchedColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const renderSortableHeader = (header: Header<TData, unknown>, filterActive: boolean, onFilterClick: () => void) => {
    const column = header.column
    const isSorted = column.getIsSorted()
    const isFiltered = filterActive
    const canSort = column.getCanSort()
    const canFilter = column.getCanFilter()
    const dropdownKey = header.id
    return (
      <div className="flex items-center gap-1 group">
        <button
          type="button"
          className="flex items-center gap-1 focus:outline-none bg-transparent border-0 p-0 m-0"
          style={{ cursor: canSort ? "pointer" : "default" }}
          onClick={() => {
            if (!canSort) return;
            if (!isSorted) {
              column.toggleSorting(false); // sort asc
            } else if (isSorted === "asc") {
              column.toggleSorting(true); // sort desc
            } else {
              column.clearSorting();
            }
          }}
        >
          <span>{column.columnDef.header?.toString() || column.id}</span>
          {canSort && (
            <span
              className={
                isSorted
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100 transition-opacity"
              }
            >
              {isSorted === "desc" ? (
                <ArrowDown className="ml-1 h-4 w-4" />
              ) : isSorted === "asc" ? (
                <ArrowUp className="ml-1 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-1 h-4 w-4" />
              )}
            </span>
          )}
        </button>

        {canFilter && (
        <DropdownMenu open={filterDropdownOpen === dropdownKey} onOpenChange={open => setFilterDropdownOpen(open ? dropdownKey : null)}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`ml-1 p-0 h-5 w-5 ${
                isFiltered ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"
              }`}
              tabIndex={-1}
              onClick={e => { e.stopPropagation(); }}
            >
              {isFiltered ? (
                <FilterIconFilled className="h-4 w-4 fill-current" />
              ) : (
                <FilterIcon className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-2 w-56">
            <ColumnFilterDropdown
              header={header}
              numericOperators={numericOperators}
              setNumericOperators={setNumericOperators}
              data={data}
              closeDropdown={() => setFilterDropdownOpen(null)}
            />
          </DropdownMenuContent>
        </DropdownMenu>)}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 gap-2">
        {filterColumn && (
          <Input
            placeholder={filterPlaceholder}
            value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        <div className="flex items-center gap-2">
          {table.getState().sorting.length > 0 && (
            <Button
              variant="outline"
              onClick={() => table.resetSorting()}
            >
              <X className="size-4" />
              Reset sorting
            </Button>
          )}
          {table.getState().columnFilters.length > 0 && (
            <Button
              variant="outline"
              onClick={() => table.resetColumnFilters()}
              className="flex items-center gap-2"
            >
              <X className="size-4" />
              Clear filters
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value: boolean) => column.toggleVisibility(!!value)}
                onSelect={e => e.preventDefault()}
              >
                {column.columnDef.header?.toString() || column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        </div>

      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="group">
                    {header.isPlaceholder
                      ? null
                      : renderSortableHeader(
                          header,
                          !!header.column.getFilterValue(),
                          () => {}
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

interface ColumnFilterDropdownProps {
  header: any
  numericOperators: Record<string, string>
  setNumericOperators: React.Dispatch<React.SetStateAction<Record<string, string>>>
  data: any[]
  closeDropdown: () => void
}

function ColumnFilterDropdown({ header, numericOperators, setNumericOperators, data, closeDropdown }: ColumnFilterDropdownProps) {
  const isNumeric = typeof data[0]?.[header.column.id as string] === "number"
  const [localValue, setLocalValue] = useState(header.column.getFilterValue() ?? "")

  // For numeric columns, also track local operator
  const [localOperator, setLocalOperator] = useState(numericOperators[header.column.id as string] || "eq")

  const applyFilter = () => {
    if (isNumeric) {
      setNumericOperators(op => ({ ...op, [header.column.id as string]: localOperator }))
    }
    header.column.setFilterValue(localValue)
    closeDropdown()
  }

  const resetFilter = () => {
    setLocalValue("")
    if (isNumeric) {
      setLocalOperator("eq")
      setNumericOperators(op => ({ ...op, [header.column.id as string]: "eq" }))
    }
    header.column.setFilterValue("")
    closeDropdown()
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold text-sm text-muted-foreground">
        {header.column.columnDef.header ?? header.column.id}
      </div>
      {isNumeric ? (
        <div className="flex gap-2 items-center">
          <Select
            value={localOperator}
            onValueChange={setLocalOperator}
            >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NUMERIC_OPERATORS.map(op => (
                <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Filter value"
            value={localValue as string}
            onChange={e => setLocalValue(e.target.value)}
            type="number"
          />
        </div>
      ) : (
        <Input
          placeholder={`Filter...`}
          value={localValue as string}
          onChange={e => setLocalValue(e.target.value)}
          type="text"
        />
      )}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={resetFilter} className="flex-1">
          Reset
        </Button>
        <Button size="sm" onClick={applyFilter} className="flex-1">
          Apply
        </Button>
      </div>
    </div>
  )
} 