import { BillboardCliente } from "./components/cliente";

const BillboardsPage = () => {
  return <div className="flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <BillboardCliente/>
    </div>
  </div>
}

export default BillboardsPage;