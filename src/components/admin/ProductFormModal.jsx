import { useState } from 'react';
import { FiX, FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminApi from '../../utils/adminApi';
import { BRANDS, CATEGORIES } from '../../utils/constants';

const SPEC_FIELDS = [
  ['processor', 'Processor'], ['ram', 'RAM'], ['storage', 'Storage'],
  ['display', 'Display'], ['camera', 'Camera'], ['battery', 'Battery'],
  ['os', 'OS'], ['connectivity', 'Connectivity'], ['weight', 'Weight'], ['colors', 'Colors'],
];

const blankFromProduct = (p) => ({
  name: p?.name || '',
  brand: p?.brand || '',
  category: p?.category || 'Smartphones',
  description: p?.description || '',
  originalPrice: p?.originalPrice ?? '',
  offerPrice: p?.offerPrice ?? '',
  stock: p?.stock ?? '',
  isFeatured: p?.isFeatured || false,
  flashSale: p?.flashSale || false,
  highlights: (p?.highlights || []).join('\n'),
  specs: SPEC_FIELDS.reduce((acc, [k]) => ({ ...acc, [k]: p?.specifications?.[k] || '' }), {}),
  images: (p?.images || []).map((i) => i.url).length ? (p.images || []).map((i) => i.url) : [''],
});

const inputCls = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue';
const labelCls = 'block text-xs font-semibold text-slate-600 mb-1';

const ProductFormModal = ({ product, onClose, onSaved }) => {
  const isEdit = Boolean(product?._id);
  const [form, setForm] = useState(() => blankFromProduct(product));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setSpec = (key, value) => setForm((f) => ({ ...f, specs: { ...f.specs, [key]: value } }));
  const setImage = (idx, value) => setForm((f) => ({ ...f, images: f.images.map((u, i) => (i === idx ? value : u)) }));
  const addImage = () => setForm((f) => ({ ...f, images: [...f.images, ''] }));
  const removeImage = (idx) => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  // Upload a file to the backend, then drop the returned URL into the image list.
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await adminApi.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((f) => {
        const imgs = [...f.images];
        const emptyIdx = imgs.findIndex((u) => !u.trim());
        if (emptyIdx >= 0) imgs[emptyIdx] = data.url; // fill an empty slot first
        else imgs.push(data.url);
        return { ...f, images: imgs };
      });
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = ''; // allow re-selecting the same file
    }
  };

  const original = Number(form.originalPrice) || 0;
  const offer = Number(form.offerPrice) || 0;
  const discount = original > 0 && offer <= original ? Math.round(((original - offer) / original) * 100) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.brand.trim() || !form.category.trim()) {
      toast.error('Name, brand and category are required.');
      return;
    }
    if (original <= 0 || offer <= 0) {
      toast.error('Please enter valid prices.');
      return;
    }
    if (offer > original) {
      toast.error('Offer price cannot be higher than the original price.');
      return;
    }

    const images = form.images.map((u) => u.trim()).filter(Boolean).map((url) => ({ url, alt: form.name }));

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      originalPrice: original,
      offerPrice: offer,
      stock: Number(form.stock) || 0,
      discount,
      isFeatured: form.isFeatured,
      flashSale: form.flashSale,
      highlights: form.highlights.split('\n').map((h) => h.trim()).filter(Boolean),
      specifications: form.specs,
      images,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await adminApi.put(`/products/${product._id}`, payload);
        toast.success('Product updated');
      } else {
        await adminApi.post('/products', payload);
        toast.success('Product created');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
          <h2 className="text-lg font-bold text-slate-900">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><FiX /></button>
        </div>

        {/* Body */}
        <form id="product-form" onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5">
          {/* Basic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Product Name *</label>
              <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. iPhone 15 Pro Max" />
            </div>
            <div>
              <label className={labelCls}>Brand *</label>
              <input className={inputCls} list="brand-list" value={form.brand} onChange={(e) => set('brand', e.target.value)} placeholder="Brand" />
              <datalist id="brand-list">{BRANDS.map((b) => <option key={b} value={b} />)}</datalist>
            </div>
            <div>
              <label className={labelCls}>Category *</label>
              <input className={inputCls} list="cat-list" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Category" />
              <datalist id="cat-list">{CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea className={inputCls} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Short product description" />
            </div>
          </div>

          {/* Pricing & stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Original Price *</label>
              <input type="number" min="0" className={inputCls} value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Offer Price *</label>
              <input type="number" min="0" className={inputCls} value={form.offerPrice} onChange={(e) => set('offerPrice', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Discount</label>
              <input className={`${inputCls} bg-slate-100`} value={`${discount}%`} readOnly />
            </div>
            <div>
              <label className={labelCls}>Stock</label>
              <input type="number" min="0" className={inputCls} value={form.stock} onChange={(e) => set('stock', e.target.value)} />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4" />
              Featured product (shown on homepage)
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={form.flashSale} onChange={(e) => set('flashSale', e.target.checked)} className="w-4 h-4" />
              Include in Flash Sale ⚡
            </label>
          </div>

          {/* Images */}
          <div>
            <label className={labelCls}>Image URLs</label>
            <div className="space-y-2">
              {form.images.map((url, idx) => (
                <div key={idx} className="flex gap-2 min-w-0">
                  <input className={`${inputCls} min-w-0 flex-1`} value={url} onChange={(e) => setImage(idx, e.target.value)} placeholder="https://..." />
                  {url ? <img src={url} alt="" className="w-10 h-10 object-contain border border-slate-200 rounded shrink-0" onError={(e) => { e.target.style.visibility = 'hidden'; }} /> : null}
                  <button type="button" onClick={() => removeImage(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded shrink-0"><FiTrash2 /></button>
                </div>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <button type="button" onClick={addImage} className="inline-flex items-center gap-1 text-sm text-brand-blue font-medium hover:underline">
                <FiPlus size={14} /> Add image URL
              </button>
              <span className="text-slate-300">|</span>
              <label className={`inline-flex items-center gap-1.5 text-sm font-medium cursor-pointer ${uploading ? 'text-slate-400' : 'text-emerald-600 hover:underline'}`}>
                <FiUpload size={14} />
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Specifications */}
          <div>
            <label className={labelCls}>Specifications</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SPEC_FIELDS.map(([key, label]) => (
                <div key={key}>
                  <span className="text-[11px] text-slate-500">{label}</span>
                  <input className={inputCls} value={form.specs[key]} onChange={(e) => setSpec(key, e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <label className={labelCls}>Highlights (one per line)</label>
            <textarea className={inputCls} rows={3} value={form.highlights} onChange={(e) => set('highlights', e.target.value)} placeholder={'48MP camera\n5000 mAh battery'} />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-100 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
          <button form="product-form" type="submit" disabled={saving} className="px-5 py-2 text-sm font-bold text-white bg-brand-blue hover:bg-brand-blueHover rounded-lg disabled:opacity-60">
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;
