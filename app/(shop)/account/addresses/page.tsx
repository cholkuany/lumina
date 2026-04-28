// app/account/addresses/page.tsx
'use client'

import { useState } from 'react'
import { Plus, MapPin } from 'lucide-react'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { AddressCard } from '@/components/account/AddressCard'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { Address } from '@/lib/types'

// Mock addresses
const initialAddresses: Address[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    street: '123 Main Street',
    apartment: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    phone: '(555) 123-4567',
    isDefault: true,
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    street: '456 Oak Avenue',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11201',
    country: 'United States',
    phone: '(555) 987-6543',
    isDefault: false,
  },
]

const countries = [
  { value: 'United States', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'United Kingdom', label: 'United Kingdom' },
]

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    isDefault: false,
  })

  const handleOpenForm = (address?: Address) => {
    if (address) {
      setEditingAddress(address)
      setFormData({
        firstName: address.firstName,
        lastName: address.lastName,
        street: address.street,
        apartment: address.apartment || '',
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone,
        isDefault: address.isDefault,
      })
    } else {
      setEditingAddress(null)
      setFormData({
        firstName: '',
        lastName: '',
        street: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        phone: '',
        isDefault: false,
      })
    }
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingAddress(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingAddress) {
      setAddresses(prev =>
        prev.map(addr =>
          addr.id === editingAddress.id
            ? { ...addr, ...formData }
            : formData.isDefault
              ? { ...addr, isDefault: false }
              : addr
        )
      )
    } else {
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
      }
      setAddresses(prev =>
        formData.isDefault
          ? [...prev.map(addr => ({ ...addr, isDefault: false })), newAddress]
          : [...prev, newAddress]
      )
    }

    handleCloseForm()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== id))
    }
  }

  return (
    <main className="pb-16">
      {/* Breadcrumb */}
      <div className="container-lumina py-4">
        <Breadcrumb
          items={[
            { label: 'My Account', href: '/account' },
            { label: 'Addresses' },
          ]}
        />
      </div>

      <div className="container-lumina">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <AccountSidebar />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-serif text-2xl lg:text-3xl text-charcoal">
                My Addresses
              </h1>
              <Button onClick={() => handleOpenForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </div>

            {/* Address Form Modal/Section */}
            {isFormOpen && (
              <div className="bg-linen rounded-brand p-6 mb-8">
                <h2 className="font-serif text-xl text-charcoal mb-6">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <Input
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                    <Input
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                    <div className="sm:col-span-2">
                      <Input
                        label="Street Address"
                        value={formData.street}
                        onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        label="Apartment, suite, etc. (optional)"
                        value={formData.apartment}
                        onChange={(e) => setFormData(prev => ({ ...prev, apartment: e.target.value }))}
                      />
                    </div>
                    <Input
                      label="City"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      required
                    />
                    <Input
                      label="State / Province"
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      required
                    />
                    <Input
                      label="ZIP / Postal Code"
                      value={formData.zipCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                      required
                    />
                    <Select
                      label="Country"
                      options={countries}
                      value={formData.country}
                      onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                    />
                    <div className="sm:col-span-2">
                      <Input
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <Checkbox
                    id="isDefault"
                    label="Set as default address"
                    checked={formData.isDefault}
                    onChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked }))}
                    className="mb-6"
                  />

                  <div className="flex gap-3">
                    <Button type="submit">
                      {editingAddress ? 'Save Changes' : 'Add Address'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleCloseForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Addresses Grid */}
            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={() => handleOpenForm(address)}
                    onDelete={() => handleDelete(address.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-linen rounded-brand">
                <MapPin className="w-16 h-16 text-warm-gray-dark mx-auto mb-4" />
                <h2 className="font-serif text-xl text-charcoal mb-2">
                  No addresses saved
                </h2>
                <p className="text-warm-gray-dark mb-6">
                  Add an address to make checkout faster.
                </p>
                <Button onClick={() => handleOpenForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Address
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}