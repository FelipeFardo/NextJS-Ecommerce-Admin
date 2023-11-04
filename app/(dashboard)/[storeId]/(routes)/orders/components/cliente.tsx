"use client"

import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"

import { OrderColumn, columns } from "./columns"
interface OrderClienteProps {
  data: OrderColumn[];
}

export const OrderCliente: React.FC<OrderClienteProps> = ({
  data
}) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for you store"
      />
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  )
}