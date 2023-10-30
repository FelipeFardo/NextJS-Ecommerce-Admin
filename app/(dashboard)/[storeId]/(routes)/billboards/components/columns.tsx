//"use cliente";

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type BillboardCollumn = {
  id: string;
  label: string;
  createAt: string;
}


export const columns: ColumnDef<BillboardCollumn>[] = [
  {
    accessorKey: "label",
    header: "Label"
  },
  {
    accessorKey: "createAt",
    header: "Date"
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]