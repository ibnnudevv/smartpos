"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AddForm } from "../_forms/add";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cabang } from "@prisma/client";
import axios from "axios";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pageSize, setPageSize] = useState(10); // Default 10 data per halaman

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: false,
  });

  const [listCabang, setListCabang] = useState<Cabang[]>([]);
  const fetchCabang = async () => {
    const response = await axios.get("/api/cabang?isActive=true");
    setListCabang(response.data.data);
  };
  useEffect(() => {
    fetchCabang();
  }, []);

  return (
    <>
      <div className="flex items-center py-4 space-x-4 justify-between">
        <div className="flex items-center gap-2">
          <Select
            onValueChange={(value) => {
              table
                .getColumn("cabang")
                ?.setFilterValue(value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Semua Cabang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"all"}>Semua Cabang</SelectItem>
              {listCabang.map((cabang) => (
                <SelectItem key={cabang.id} value={cabang.nama.toString()}>
                  {cabang.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Cari berdasarkan nama..."
            value={
              (table.getColumn("barang")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("barang")?.setFilterValue(event.target.value)
            }
          />
        </div>
        <AddForm />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={row.index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-4 py-4">
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            const newSize = Number(value);
            setPageSize(newSize);
            setPagination((prev) => ({ ...prev, pageSize: newSize }));
            table.setPageSize(newSize);
          }}
        >
          <SelectTrigger className="w-fit">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 25, 50, 100].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          {/* Tombol Previous */}
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            size={"icon"}
          >
            <ChevronLeft />
          </Button>

          {/* Paginasi Dinamis (Digabung) */}
          {(() => {
            const pageCount = table.getPageCount();
            const visiblePages = 3;
            const pageIndex = table.getState().pagination.pageIndex;

            if (pageCount <= visiblePages) {
              return Array.from({ length: pageCount }).map((_, index) => (
                <Button
                  key={index}
                  variant={pageIndex === index ? "default" : "outline"}
                  size={"icon"}
                  onClick={() => table.setPageIndex(index)}
                >
                  {index + 1}
                </Button>
              ));
            }

            const pages = [];
            const startPage = Math.max(
              0,
              pageIndex - Math.floor(visiblePages / 2)
            );
            const endPage = Math.min(
              pageCount - 1,
              startPage + visiblePages - 1
            );

            if (startPage > 0) {
              pages.push(
                <Button
                  key={0}
                  variant={pageIndex === 0 ? "default" : "outline"}
                  size={"icon"}
                  onClick={() => table.setPageIndex(0)}
                >
                  1
                </Button>
              );
              if (startPage > 1) {
                pages.push(
                  <span key="start-dots" className="mx-1">
                    ...
                  </span>
                );
              }
            }

            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <Button
                  key={i}
                  variant={pageIndex === i ? "default" : "outline"}
                  size={"icon"}
                  onClick={() => table.setPageIndex(i)}
                >
                  {i + 1}
                </Button>
              );
            }

            if (endPage < pageCount - 1) {
              if (endPage < pageCount - 2) {
                pages.push(
                  <span key="end-dots" className="mx-1">
                    ...
                  </span>
                );
              }
              pages.push(
                <Button
                  key={pageCount - 1}
                  variant={pageIndex === pageCount - 1 ? "default" : "outline"}
                  size={"icon"}
                  onClick={() => table.setPageIndex(pageCount - 1)}
                >
                  {pageCount}
                </Button>
              );
            }

            return pages;
          })()}

          {/* Tombol Next */}
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            size={"icon"}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </>
  );
}
