// src/pages/Customers.jsx

import { useEffect, useState } from "react"
import axios from "axios"

const Customers = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/orders`, { withCredentials: true })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders with customer data:", err))
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
              <th className="py-2 px-4">Customer ID</th>
              <th className="py-2 px-4">Customer Name</th>
              <th className="py-2 px-4">Last Visit</th>
              <th className="py-2 px-4">Last Ordered Item</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.customerId} className="border-t">
                <td className="py-2 px-4 font-mono text-sm">{order.customerId}</td>
                <td className="py-2 px-4">{order.name}</td>
                <td className="py-2 px-4">{new Date(order.lastVisit).toLocaleDateString()}</td>
                <td className="py-2 px-4">{order.product || "No Orders Yet"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Customers
