'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/queryClient';
import type { Order } from '@/types';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders');
      return data as { success: boolean; data: Order[] };
    },
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (payload: {
      customerName: string; phone: string; location: string;
      items: Array<{ productId: number; productName: string; variant: string; quantity: number; unitPrice: number; image: string; }>;
    }) => {
      const { data } = await api.post('/orders', payload);
      return data;
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data } = await api.patch(`/orders/${id}`, { status });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
}
