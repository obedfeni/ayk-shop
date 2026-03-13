'use client';
import { useState, useRef } from 'react';
import { Plus, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Card';
import { COLORS, BUSINESS, CATEGORIES } from '@/lib/constants';
import { useProducts, useCreateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useUpload } from '@/hooks/useUpload';
import toast from 'react-hot-toast';

export function ProductManager() {
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', stock: '', description: '', category: 'Jewelry', variants: '' });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, refetch } = useProducts();
  const products = data?.data ?? [];
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const upload = useUpload();

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, BUSINESS.maxImages);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const resetForm = () => { setForm({ name: '', price: '', stock: '', description: '', category: 'Jewelry', variants: '' }); setImages([]); setPreviews([]); setIsAdding(false); };

  const submit = async () => {
    if (!form.name || !form.price || !form.stock) { toast.error('Name, price, and stock are required'); return; }
    const toastId = toast.loading('Uploading images...');
    try {
      const urls: string[] = [];
      for (const img of images) {
        const url = await upload.upload(img, `${form.name}_${Date.now()}`);
        if (url) urls.push(url);
      }
      toast.loading('Saving product...', { id: toastId });
      const variants = form.variants.trim() ? form.variants.split(',').map((v) => { const [n, p] = v.split(':'); return { name: n?.trim(), price: Number(p) }; }).filter((v) => v.name && !isNaN(v.price)) : [];
      await createProduct.mutateAsync({ name: form.name, price: Number(form.price), stock: Number(form.stock), description: form.description, category: form.category, images: urls, variants });
      toast.success('Product added!', { id: toastId });
      resetForm();
    } catch { toast.error('Failed to save product', { id: toastId }); }
  };

  const del = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await toast.promise(deleteProduct.mutateAsync(id), { loading: 'Deleting...', success: 'Deleted!', error: 'Failed to delete' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold" style={{ color: COLORS.text }}>Products <span className="text-base font-normal text-ayk-text-muted ml-2">({products.length})</span></h2>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}><Plus className="w-4 h-4 mr-2" />Add Product</Button>
      </div>

      {/* Add product form */}
      {isAdding && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>New Product</h3>
            <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Input label="Product Name *" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Gold Ring Set" />
            <Input label="Price (GHS) *" type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="250" />
            <Input label="Stock Quantity *" type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} placeholder="10" />
            <div>
              <label className="block text-sm font-semibold text-ayk-text mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full rounded-xl border border-ayk-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ayk-primary/30">
                {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <Input label="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Beautiful handcrafted jewelry..." />
            </div>
            <div className="md:col-span-2">
              <Input label="Variants (optional) — format: Small:50, Large:75" value={form.variants} onChange={(e) => setForm((p) => ({ ...p, variants: e.target.value }))} placeholder="Small:200, Medium:250, Large:300" />
            </div>
          </div>

          {/* Image upload */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-ayk-text mb-2">Product Images (max {BUSINESS.maxImages})</label>
            <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleFiles} className="hidden" />
            <div className="flex gap-3 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-ayk-border">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => { const nf = images.filter((_, j) => j !== i); setImages(nf); setPreviews(nf.map((f) => URL.createObjectURL(f))); }} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"><X className="w-3 h-3 text-white" /></button>
                </div>
              ))}
              {previews.length < BUSINESS.maxImages && (
                <button onClick={() => fileRef.current?.click()} className="w-24 h-24 rounded-xl border-2 border-dashed border-ayk-border flex flex-col items-center justify-center gap-1 hover:border-ayk-primary hover:bg-amber-50 transition-all">
                  <ImageIcon className="w-5 h-5 text-ayk-text-muted" />
                  <span className="text-xs text-ayk-text-muted">Add Image</span>
                </button>
              )}
            </div>
            {upload.isUploading && <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-ayk-primary transition-all" style={{ width: `${upload.progress}%` }} /></div>}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={resetForm}>Cancel</Button>
            <Button onClick={submit} isLoading={createProduct.isPending || upload.isUploading}>Save Product</Button>
          </div>
        </Card>
      )}

      {/* Products grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <Card key={p.id} className="p-4 flex gap-4">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0 flex items-center justify-center">
              {p.image1 ? <img src={p.image1} alt={p.name} className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-gray-300" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate" style={{ color: COLORS.text }}>{p.name}</h4>
              <p className="text-sm" style={{ color: COLORS.textSoft }}>{p.category}</p>
              <p className="text-lg font-bold" style={{ color: COLORS.danger }}>{BUSINESS.currency} {p.price}</p>
              <div className="flex items-center justify-between mt-1">
                <Badge variant={p.stock > 0 ? 'success' : 'error'}>{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</Badge>
                <Button variant="danger" size="sm" onClick={() => del(p.id, p.name)}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {!products.length && !isAdding && (
        <div className="text-center py-16 text-ayk-text-muted"><div className="text-5xl mb-3">📦</div><p>No products yet. Add your first one!</p></div>
      )}
    </div>
  );
}
