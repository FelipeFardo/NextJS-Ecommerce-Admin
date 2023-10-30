import { format } from 'date-fns';

import prismadb from "@/lib/prismadb";
import { BillboardCliente } from "./components/cliente";
import { BillboardCollumn } from "./components/columns";

const BillboardsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createAt: 'desc'
    }
  });


  const formattedBillboards: BillboardCollumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createAt: format(item.createAt, "MMMM do, yyyy")
  }))


  return <div className="flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <BillboardCliente data={formattedBillboards} />
    </div>
  </div>
}

export default BillboardsPage;