'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Box, Check, CircleDollarSign, Clipboard, PackagePlus, Plus, Truck, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/Button'
import type { AdminPurchase, PurchaseStats, PurchaseStatus } from '@/lib/purchase-types'
import type { TProduct } from '@/lib/types'
import { cn } from '@/lib/utils'
import { AdminPageLoadingState } from '@/components/ui/PageLoadingState'

const statusConfig: Record<PurchaseStatus, { label: string; className: string }> = {
  pending: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
  ordered: { label: 'Ordered', className: 'bg-primary-100 text-primary-700' },
  in_transit: { label: 'In transit', className: 'bg-amber-100 text-amber-700' },
  received: { label: 'Received', className: 'bg-success-100 text-success-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
}

async function getPurchases(): Promise<{ purchases: AdminPurchase[]; stats: PurchaseStats }> {
  const response = await fetch('/api/purchases')
  if (!response.ok) throw new Error('Unable to load purchase orders')
  return response.json()
}

export default function PurchasesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState<AdminPurchase | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const purchasesQuery = useQuery({ queryKey: ['purchases-dashboard'], queryFn: getPurchases })
  const productsQuery = useQuery<TProduct[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Unable to load products')
      return response.json()
    },
  })

  const action = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: string }) => {
      const response = await fetch('/api/purchases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Unable to update purchase order')
      return result
    },
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['purchases-dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['products'] }),
      ])
      setSelected(null)
      toast.success(variables.action === 'receive' ? 'Inventory received and stock updated' : 'Purchase order updated')
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const purchases = useMemo(() => {
    const query = search.trim().toLowerCase()
    return (purchasesQuery.data?.purchases || []).filter((purchase) => {
      const matchesStatus = !status || purchase.status === status
      const matchesSearch = !query || [purchase.purchaseNumber, purchase.supplier.name, purchase.supplier.email]
        .some((value) => value.toLowerCase().includes(query))
      return matchesStatus && matchesSearch
    })
  }, [purchasesQuery.data, search, status])

  const stats = purchasesQuery.data?.stats

  if (purchasesQuery.isLoading) return <AdminPageLoadingState />
  if (purchasesQuery.error) return <div className="py-16 text-center text-red-600">{purchasesQuery.error.message}</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Inventory procurement</p>
          <h1 className="text-2xl font-semibold text-text-primary">Purchase orders</h1>
          <p className="mt-1 max-w-2xl text-sm text-border-dark">
            Order stock from suppliers and receive it directly into the linked product variants.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" /> New purchase order
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Stat icon={<Clipboard className="h-5 w-5" />} label="Draft" value={stats?.pending || 0} />
        <Stat icon={<Box className="h-5 w-5 text-primary-600" />} label="Ordered" value={stats?.ordered || 0} iconClass="bg-primary-100" />
        <Stat icon={<Truck className="h-5 w-5 text-amber-600" />} label="In transit" value={stats?.in_transit || 0} iconClass="bg-amber-100" />
        <Stat icon={<Check className="h-5 w-5 text-success-600" />} label="Received" value={stats?.received || 0} iconClass="bg-success-100" />
        <Stat icon={<X className="h-5 w-5 text-red-600" />} label="Cancelled" value={stats?.cancelled || 0} iconClass="bg-red-100" />
        <Stat icon={<CircleDollarSign className="h-5 w-5 text-primary" />} label="Month spend" value={`$${(stats?.monthSpend || 0).toLocaleString()}`} iconClass="bg-primary/10" />
      </div>

      <div className="rounded-brand border border-border bg-white">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search PO or supplier…"
            className="h-10 flex-1 rounded-brand border border-border px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-brand border border-border bg-white px-3 text-sm outline-none focus:border-primary">
            <option value="">All statuses</option>
            {Object.entries(statusConfig).map(([value, config]) => <option key={value} value={value}>{config.label}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-200">
            <thead className="border-b border-border-light bg-surface/60 text-left text-xs uppercase tracking-wide text-border-dark">
              <tr><th className="px-4 py-3">Purchase order</th><th className="px-4 py-3">Supplier</th><th className="px-4 py-3">Units</th><th className="px-4 py-3">Expected</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {purchases.map((purchase) => (
                <tr key={purchase.id} onClick={() => setSelected(purchase)} className="cursor-pointer hover:bg-surface/40">
                  <td className="px-4 py-3"><p className="font-medium text-text-primary">{purchase.purchaseNumber}</p><p className="text-xs text-border-dark">{new Date(purchase.date).toLocaleDateString()}</p></td>
                  <td className="px-4 py-3"><p className="text-sm font-medium text-text-primary">{purchase.supplier.name}</p><p className="text-xs text-border-dark">{purchase.supplier.email}</p></td>
                  <td className="px-4 py-3 text-sm text-text-primary">{purchase.itemCount}</td>
                  <td className="px-4 py-3 text-sm text-text-primary">{new Date(purchase.expectedDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm font-medium text-text-primary">${purchase.total.toLocaleString()}</td>
                  <td className="px-4 py-3"><Status status={purchase.status} /></td>
                </tr>
              ))}
              {purchases.length === 0 && <tr><td colSpan={6} className="px-4 py-14 text-center text-sm text-border-dark">No purchase orders match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && <CreatePurchaseModal products={productsQuery.data || []} onClose={() => setShowCreate(false)} onCreated={async () => { setShowCreate(false); await queryClient.invalidateQueries({ queryKey: ['purchases-dashboard'] }) }} />}
      {selected && <PurchaseDrawer purchase={selected} busy={action.isPending} onClose={() => setSelected(null)} onAction={(name) => action.mutate({ id: selected.id, action: name })} />}
    </div>
  )
}

function Stat({ icon, label, value, iconClass = 'bg-gray-100' }: { icon: React.ReactNode; label: string; value: string | number; iconClass?: string }) {
  return <div className="flex items-center gap-3 rounded-brand border border-border bg-white p-4"><div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', iconClass)}>{icon}</div><div><p className="text-xl font-semibold text-text-primary">{value}</p><p className="text-xs text-border-dark">{label}</p></div></div>
}

function Status({ status }: { status: PurchaseStatus }) {
  const config = statusConfig[status]
  return <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', config.className)}>{config.label}</span>
}

function CreatePurchaseModal({ products, onClose, onCreated }: { products: TProduct[]; onClose: () => void; onCreated: () => Promise<void> }) {
  const [supplier, setSupplier] = useState({ name: '', email: '' })
  const [expectedDate, setExpectedDate] = useState('')
  const [notes, setNotes] = useState('')
  const [lines, setLines] = useState([{ product: '', variant: '', quantity: 1, cost: 0 }])
  const create = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/purchases', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ supplier, expectedDate, notes, total, items: lines }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Unable to create purchase order')
    },
    onSuccess: async () => { toast.success('Purchase order created'); await onCreated() },
    onError: (error: Error) => toast.error(error.message),
  })
  const total = lines.reduce((sum, line) => sum + Number(line.quantity) * Number(line.cost), 0)
  const valid = supplier.name && supplier.email && expectedDate && lines.every((line) => line.product && line.variant && line.quantity > 0 && line.cost >= 0)

  return <Modal title="New purchase order" onClose={onClose}>
    <div className="space-y-5 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Supplier name"><input value={supplier.name} onChange={(e) => setSupplier({ ...supplier, name: e.target.value })} className="form-control" /></Field>
        <Field label="Supplier email"><input type="email" value={supplier.email} onChange={(e) => setSupplier({ ...supplier, email: e.target.value })} className="form-control" /></Field>
        <Field label="Expected delivery"><input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} className="form-control" /></Field>
        <Field label="Notes"><input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Terms, reference, shipping…" className="form-control" /></Field>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold text-text-primary">Order lines</h3><Link href="/admin/products/new" className="text-xs font-medium text-primary hover:text-primary-dark">Create a new catalog product first →</Link></div>
        <div className="space-y-3">
          {lines.map((line, index) => {
            const product = products.find((item) => item.id === line.product)
            return <div key={index} className="grid gap-2 rounded-brand border border-border bg-surface/40 p-3 sm:grid-cols-12">
              <select value={line.product} onChange={(e) => setLines(lines.map((item, i) => i === index ? { ...item, product: e.target.value, variant: '' } : item))} className="form-control sm:col-span-4"><option value="">Select product</option>{products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
              <select value={line.variant} disabled={!product} onChange={(e) => setLines(lines.map((item, i) => i === index ? { ...item, variant: e.target.value } : item))} className="form-control sm:col-span-4"><option value="">Select variant</option>{product?.variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.sku} · {Object.values(variant.attributes).filter(Boolean).join(' / ')} · stock {variant.stock}</option>)}</select>
              <input aria-label="Quantity" type="number" min="1" value={line.quantity} onChange={(e) => setLines(lines.map((item, i) => i === index ? { ...item, quantity: Number(e.target.value) } : item))} className="form-control sm:col-span-1" />
              <input aria-label="Unit cost" type="number" min="0" step="0.01" value={line.cost} onChange={(e) => setLines(lines.map((item, i) => i === index ? { ...item, cost: Number(e.target.value) } : item))} className="form-control sm:col-span-2" />
              <button aria-label="Remove line" disabled={lines.length === 1} onClick={() => setLines(lines.filter((_, i) => i !== index))} className="flex items-center justify-center text-border-dark hover:text-red-500 disabled:opacity-30 sm:col-span-1"><X className="h-4 w-4" /></button>
            </div>
          })}
        </div>
        <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => setLines([...lines, { product: '', variant: '', quantity: 1, cost: 0 }])}><Plus className="mr-1 h-4 w-4" /> Add line</Button>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-4"><div><p className="text-xs text-border-dark">Purchase total</p><p className="text-xl font-semibold text-text-primary">${total.toLocaleString()}</p></div><Button disabled={!valid || create.isPending} isLoading={create.isPending} onClick={() => create.mutate()}>Create draft PO</Button></div>
    </div>
  </Modal>
}

function PurchaseDrawer({ purchase, busy, onClose, onAction }: { purchase: AdminPurchase; busy: boolean; onClose: () => void; onAction: (action: string) => void }) {
  const [confirmReceipt, setConfirmReceipt] = useState(false)
  return <><div className="fixed inset-0 z-40 bg-text-primary/40" onClick={onClose} /><aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-white shadow-xl">
    <div className="flex items-start justify-between border-b border-border p-5"><div><div className="flex items-center gap-2"><h2 className="text-lg font-semibold text-text-primary">{purchase.purchaseNumber}</h2><Status status={purchase.status} /></div><p className="mt-1 text-sm text-border-dark">{purchase.supplier.name} · expected {new Date(purchase.expectedDate).toLocaleDateString()}</p></div><button onClick={onClose}><X className="h-5 w-5 text-border-dark" /></button></div>
    <div className="flex-1 space-y-6 overflow-y-auto p-5">
      <div className="rounded-brand border border-primary-200 bg-primary-50 p-4 text-sm text-primary-800"><p className="font-semibold">Inventory connection</p><p className="mt-1">Receiving this PO adds each ordered quantity to its exact linked variant. This operation can only be applied once.</p></div>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-text-primary">Items ({purchase.itemCount} units)</h3>
        <div className="space-y-2">{purchase.items.map((item) => (
          <div key={item.id} className="flex gap-3 rounded-brand border border-border p-3">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
            ) : <div className="h-12 w-12 rounded-lg bg-surface" />}
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-text-primary">{item.name}</p><p className="text-xs text-border-dark">{item.sku} · {item.variantLabel || 'Default variant'}</p><p className="mt-1 text-xs text-text-primary">{item.quantity} × ${item.cost.toLocaleString()}</p></div>
            <p className="text-sm font-semibold text-text-primary">${(item.quantity * item.cost).toLocaleString()}</p>
          </div>
        ))}</div>
      </div>
      {purchase.notes && <div><h3 className="mb-2 text-sm font-semibold text-text-primary">Notes</h3><p className="rounded-brand bg-surface p-3 text-sm text-text-primary">{purchase.notes}</p></div>}
      <div className="flex justify-between border-t border-border pt-4"><span className="font-semibold text-text-primary">Total</span><span className="text-lg font-semibold text-text-primary">${purchase.total.toLocaleString()}</span></div>
    </div>
    <div className="flex flex-wrap justify-end gap-2 border-t border-border bg-surface p-4">
      {confirmReceipt && <div className="mb-2 w-full rounded-brand border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"><p className="font-semibold">Post {purchase.itemCount} units to inventory?</p><p className="mt-1">This permanently increments the linked product variants and cannot be received twice.</p><div className="mt-3 flex justify-end gap-2"><Button size="sm" variant="ghost" onClick={() => setConfirmReceipt(false)}>Go back</Button><Button size="sm" disabled={busy} isLoading={busy} onClick={() => onAction('receive')}>Confirm receipt</Button></div></div>}
      {purchase.status === 'pending' && <Button disabled={busy} onClick={() => onAction('order')}>Place order</Button>}
      {purchase.status === 'ordered' && <Button disabled={busy} variant="secondary" onClick={() => onAction('ship')}>Mark in transit</Button>}
      {!confirmReceipt && (purchase.status === 'ordered' || purchase.status === 'in_transit') && <Button disabled={busy} onClick={() => setConfirmReceipt(true)}><PackagePlus className="mr-2 h-4 w-4" /> Receive into inventory</Button>}
      {!['received', 'cancelled'].includes(purchase.status) && <Button disabled={busy} variant="danger" onClick={() => onAction('cancel')}>Cancel PO</Button>}
      {purchase.inventoryAppliedAt && <p className="w-full text-right text-xs text-success-700">Inventory posted {new Date(purchase.inventoryAppliedAt).toLocaleString()}</p>}
    </div>
  </aside></>
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <><div className="fixed inset-0 z-40 bg-text-primary/40" onClick={onClose} /><div role="dialog" aria-modal="true" className="fixed inset-x-4 top-1/2 z-50 max-h-[90vh] -translate-y-1/2 overflow-y-auto rounded-brand bg-white shadow-xl sm:left-1/2 sm:right-auto sm:w-full sm:max-w-3xl sm:-translate-x-1/2"><div className="sticky top-0 flex items-center justify-between border-b border-border bg-white p-5"><h2 className="text-lg font-semibold text-text-primary">{title}</h2><button onClick={onClose}><X className="h-5 w-5" /></button></div>{children}</div></>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-text-primary">{label}<span className="mt-2 block">{children}</span></label>
}
