'use client';
import { useState } from 'react';
import { Search, Phone, Check, X, Package, RefreshCw, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Card';
import { COLORS, BUSINESS } from '@/lib/constants';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import toast from 'react-hot-toast';
import type { Order } from '@/types';

const STATUS_VARIANT: Record<string, 'warning' | 'info' | 'success' | 'error'> = {
  Pending: 'warning', Approved: 'info', Completed: 'success', Cancelled: 'error',
};

export function OrderManager() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { data, refetch, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const orders: Order[] = data?.data ?? [];

  const filtered = orders.filter((o) => {
    if (!o.id) return false;
    if (filter !== 'all' && o.status?.toLowerCase() !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.customerName?.toLowerCase().includes(q) ||
        o.phone?.includes(q) ||
        o.reference?.toLowerCase().includes(q) ||
        o.location?.toLowerCase().includes(q) ||
        o.items?.[0]?.productName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const update = async (id: number, status: string) => {
    if (!id || isNaN(id)) {
      toast.error('Cannot update order — invalid ID');
      return;
    }
    await toast.promise(updateStatus.mutateAsync({ id, status }), {
      loading: 'Updating...',
      success: `Marked as ${status}`,
      error: 'Failed to update',
    });
  };

  const whatsappMessage = (order: Order) => {
    const product = order.items?.[0]?.productName || 'your item';
    const msg = encodeURIComponent(
      `Hello ${order.customerName},\n\nWe have received your order for *${product}* (Ref: ${order.reference}).\n\nPlease make payment of *GHS ${order.amount}* via Mobile Money to:\n📱 *${BUSINESS.momo}*\n\nUse your reference number as the payment reference.\n\nThank you for shopping with ${BUSINESS.name}! 🛍️`
    );
    const phone = order.phone.replace(/^0/, '233');
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const smsMessage = (order: Order) => {
    const product = order.items?.[0]?.productName || 'your item';
    const msg = encodeURIComponent(
      `Hi ${order.customerName}, we received your order for ${product} (Ref: ${order.reference}). Pay GHS ${order.amount} to MoMo ${BUSINESS.momo}. Thank you! - ${BUSINESS.shortName}`
    );
    window.open(`sms:${order.phone}?body=${msg}`, '_blank');
  };

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'Pending').length,
    approved: orders.filter((o) => o.status === 'Approved').length,
    completed: orders.filter((o) => o.status === 'Completed').length,
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-serif font-bold" style={{ color: COLORS.text }}>
          Orders <span className="text-base font-normal text-ayk-text-muted ml-2">({orders.length})</span>
        </h2>
        <Button variant="secondary" size="sm" onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-sm">
          <Input placeholder="Search by name, phone, product, reference..." value={search}
            onChange={(e) => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending', 'approved', 'completed', 'cancelled'] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all border ${filter === s ? 'border-ayk-primary bg-amber-50 text-ayk-primary' : 'border-ayk-border hover:border-ayk-primary/50 text-ayk-text-soft'}`}>
              {s}{counts[s as keyof typeof counts] !== undefined && (
                <span className="ml-1 text-xs opacity-70">({counts[s as keyof typeof counts]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-ayk-text-muted">
            <div className="text-5xl mb-3">📋</div><p>No orders found</p>
          </div>
        ) : (
          filtered.map((o) => (
            <Card key={o.id} className="p-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold" style={{ color: COLORS.text }}>
                      {o.items?.[0]?.productName || '—'}
                    </h4>
                    <Badge variant={STATUS_VARIANT[o.status] ?? 'primary'}>{o.status}</Badge>
                  </div>
                  {o.items?.[0]?.variant && o.items[0].variant !== 'Standard' && (
                    <p className="text-xs text-ayk-text-muted">
                      {o.items[0].variant} × {o.items[0].quantity}
                    </p>
                  )}
                  <p className="text-sm" style={{ color: COLORS.textSoft }}>
                    <span className="font-medium">{o.customerName}</span> · {o.phone} · {o.location}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.textMuted }}>
                    {new Date(o.timestamp).toLocaleString('en-GH')} ·{' '}
                    <span className="font-mono">{o.reference}</span>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-xl font-bold font-serif" style={{ color: COLORS.danger }}>
                    {BUSINESS.currency} {Number(o.amount).toLocaleString()}
                  </p>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {o.status === 'Pending' && (
                      <>
                        <Button size="sm" onClick={() => update(o.id, 'Approved')}>
                          <Check className="w-3 h-3 mr-1" />Approve
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => update(o.id, 'Cancelled')}>
                          <X className="w-3 h-3 mr-1" />Cancel
                        </Button>
                      </>
                    )}
                    {o.status === 'Approved' && (
                      <Button size="sm" onClick={() => update(o.id, 'Completed')}>
                        <Package className="w-3 h-3 mr-1" />Complete
                      </Button>
                    )}
                    {/* WhatsApp — sends payment message */}
                    <button onClick={() => whatsappMessage(o)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: '#25D366' }}>
                      <MessageCircle className="w-3 h-3" />WhatsApp
                    </button>
                    {/* SMS */}
                    <button onClick={() => smsMessage(o)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all hover:bg-gray-50"
                      style={{ color: COLORS.text, borderColor: COLORS.border }}>
                      <Phone className="w-3 h-3" />SMS
                    </button>
                    {/* Call */}
                    <a href={`tel:${o.phone}`}>
                      <Button size="sm" variant="secondary">
                        <Phone className="w-3 h-3" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
