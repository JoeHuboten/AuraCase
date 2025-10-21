'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiX, FiPackage, FiTruck, FiCheck, FiClock, FiXCircle } from 'react-icons/fi';
import Image from 'next/image';

interface Order {
  id: string;
  userId: string;
  total: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  status: string;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
  items: {
    id: string;
    quantity: number;
    price: number;
    color: string | null;
    size: string | null;
    product: {
      id: string;
      name: string;
      image: string;
      slug: string;
    };
  }[];
}

const statusColors = {
  PENDING: 'bg-yellow-500/20 text-yellow-500',
  PROCESSING: 'bg-blue-500/20 text-blue-500',
  SHIPPED: 'bg-purple-500/20 text-purple-500',
  DELIVERED: 'bg-green-500/20 text-green-500',
  CANCELLED: 'bg-red-500/20 text-red-500',
};

const statusIcons = {
  PENDING: FiClock,
  PROCESSING: FiPackage,
  SHIPPED: FiTruck,
  DELIVERED: FiCheck,
  CANCELLED: FiXCircle,
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string, notes?: string) => {
    try {
      const response = await fetch(`/api/admin/orders/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId, 
          status: newStatus,
          notes,
        }),
      });

      if (response.ok) {
        await fetchOrders();
        if (selectedOrder?.id === orderId) {
          const updatedOrder = orders.find(o => o.id === orderId);
          if (updatedOrder) setSelectedOrder(updatedOrder);
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleUpdateOrder = async (orderId: string, updates: any) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Orders</h1>
        <p className="text-text-secondary mt-2">Manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background-secondary border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-background-secondary border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-background-secondary rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredOrders.map((order) => {
                const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
                return (
                  <tr key={order.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-white">
                        #{order.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {order.user.name || 'Guest'}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {order.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-white">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-white">
                        ${order.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-2 text-xs leading-5 font-semibold rounded-full ${
                          statusColors[order.status as keyof typeof statusColors]
                        }`}
                      >
                        {StatusIcon && <StatusIcon size={14} />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-text-secondary">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="text-accent hover:text-accent/80"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background-secondary rounded-lg border border-gray-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-background-secondary">
              <h2 className="text-xl font-bold text-white">
                Order #{selectedOrder.id.slice(0, 8)}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-secondary hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Customer Information</h3>
                <div className="bg-background p-4 rounded-lg space-y-2">
                  <p className="text-white">{selectedOrder.user.name || 'Guest'}</p>
                  <p className="text-text-secondary">{selectedOrder.user.email}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-background p-4 rounded-lg"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.product.name}</p>
                        <p className="text-text-secondary text-sm">
                          Quantity: {item.quantity}
                          {item.color && ` • Color: ${item.color}`}
                          {item.size && ` • Size: ${item.size}`}
                        </p>
                      </div>
                      <p className="text-white font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Order Summary</h3>
                <div className="bg-background p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount:</span>
                      <span>-${selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-text-secondary">
                    <span>Delivery Fee:</span>
                    <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-semibold text-lg pt-2 border-t border-gray-700">
                    <span>Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Order Status</h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    const notes = prompt('Add a note (optional):');
                    handleUpdateStatus(selectedOrder.id, e.target.value, notes || undefined);
                  }}
                  className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Tracking Number */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Tracking Number</h3>
                <input
                  type="text"
                  defaultValue={selectedOrder.trackingNumber || ''}
                  onBlur={(e) => handleUpdateOrder(selectedOrder.id, { trackingNumber: e.target.value })}
                  placeholder="Enter tracking number"
                  className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
                />
              </div>

              {/* Courier Service */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Courier Service</h3>
                <select
                  defaultValue={(selectedOrder as any).courierService || ''}
                  onChange={(e) => handleUpdateOrder(selectedOrder.id, { courierService: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="">Select courier</option>
                  <option value="Speedy">Speedy</option>
                  <option value="Econt">Econt</option>
                  <option value="Bulgarian Posts">Bulgarian Posts</option>
                  <option value="DHL">DHL</option>
                  <option value="FedEx">FedEx</option>
                </select>
              </div>

              {/* Estimated Delivery */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Estimated Delivery Date</h3>
                <input
                  type="datetime-local"
                  defaultValue={(selectedOrder as any).estimatedDelivery ? new Date((selectedOrder as any).estimatedDelivery).toISOString().slice(0, 16) : ''}
                  onBlur={(e) => handleUpdateOrder(selectedOrder.id, { estimatedDelivery: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

