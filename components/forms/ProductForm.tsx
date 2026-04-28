'use client'

import Image from 'next/image'
import { useState, useTransition, useMemo } from 'react'
import { useForm, useFieldArray, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import {
  productSchema,
  ProductFormData,
} from '@/lib/validations/product.validation'
import { FormInput } from '@/components/ui/FormInput'
import { FormTextarea } from '@/components/ui/FormTextarea'
import { FormSelect } from '@/components/ui/FormSelect'
import { FormSwitch } from '@/components/ui/FormSwitch'
import { Button } from '@/components/ui/Button'
import { Info, ClipboardList, Layers, X } from 'lucide-react'
import { ImageUpload } from '../ui/ImageUpload'
import { cn } from '@/lib/utils'
import { Breadcrumb } from '../ui/Breadcrumb'

// Interface for the category data passed from the server
interface CategoryFromDB {
  name: string;
  parent?: string | null;
  ancestors?: string[];
  id?: string;
}

interface ProductFromDB extends Omit<ProductFormData, 'category'> {
  id?: string;
  category: CategoryFromDB;
}

export interface CategoryOption {
  _id: string
  name: string
  parent?: string | null
  ancestors?: string[] | null
}

interface ProductFormProps {
  initialData?: ProductFromDB;
  availableCategories: CategoryOption[];
}

export function ProductForm({
  initialData,
  availableCategories = [],
}: ProductFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<'basic' | 'variants' | 'specs'>(
    'basic'
  )

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
        name: '',
        description: '',
        longDescription: '',
        price: 0,
        originalPrice: null,
        category: { name: '', parent: null, ancestors: [] },
        stockCount: 0,
        variants: [],
        specifications: [],
        isNewArrival: false,
        isSale: false,
        isFeatured: false,
        brand: '',
      },
  })

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: 'variants',
  })

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({
    control,
    name: 'specifications',
  })

  const watchedImages = watch('variants').flatMap(
    (variant) => variant.images || []
  )
  const watchedPrice = watch('price')
  const watchedOriginalPrice = watch('originalPrice')
  const watchedCategory = watch('category')

  // Transform availableCategories into options for the Select component
  const categoryOptions = useMemo(() => {
    return availableCategories.map((cat) => ({
      value: cat._id,
      label: cat.name
    }))
  }, [availableCategories])

  const categoryBreadcrumbsOptions = useMemo(() => {
    const subs = watchedCategory?.ancestors?.map((cat) => ({
      href: cat,
      label: cat
    }))
    subs?.push({
      href: watchedCategory.name,
      label: watchedCategory.name
    })
    return subs ?? []
  }, [watchedCategory])

  const discountPercentage =
    watchedOriginalPrice && watchedOriginalPrice > watchedPrice
      ? Math.round(
        ((watchedOriginalPrice - watchedPrice) / watchedOriginalPrice) * 100
      )
      : 0

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    console.log('data from form::::', data)
    startTransition(async () => {
      try {
        const url = initialData?.id
          ? `/api/products/${initialData.id}`
          : '/api/products'

        const method = initialData?.id ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to save product')
        }

        const result = await response.json()
        console.log(":::::result from api::::\n", result.message)
        console.log("====result==== \n", result.product)
        router.push(`/admin/products/edit/${result.product.id}`)
        router.refresh()
      } catch (error) {
        console.error('Error saving product:', error)
      }
    })
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Info },
    { id: 'variants', label: 'Variants', icon: Layers },
    { id: 'specs', label: 'Specifications', icon: ClipboardList },
  ] as const

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            {initialData?.id ? 'Edit Product' : 'Create New Product'}
          </h1>
          <p className="text-warm-gray-dark mt-1">
            {initialData?.id
              ? 'Update your product information'
              : 'Add a new product to your catalog'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            disabled={!isDirty}
          >
            {initialData?.id ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-warm-gray">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative',
                activeTab === tab.id
                  ? 'text-gold'
                  : 'text-warm-gray-dark hover:text-charcoal'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Basic Details */}
              <div className="bg-white rounded-brand border border-warm-gray p-6 space-y-5">
                <h2 className="text-lg font-medium text-charcoal">
                  Product Details
                </h2>

                <FormInput
                  label="Product Name"
                  placeholder="Enter product name"
                  error={errors.name?.message}
                  {...register('name')}
                  optional={false}
                />

                <FormInput
                  label="Brand Name"
                  placeholder="Enter brand name"
                  error={errors.brand?.message}
                  {...register('brand')}
                />

                <FormTextarea
                  label="Short Description"
                  placeholder="Brief description for product cards"
                  rows={3}
                  maxLength={1000}
                  showCount
                  error={errors.description?.message}
                  {...register('description')}
                  optional={false}
                />

                <FormTextarea
                  label="Long Description"
                  placeholder="Detailed product description"
                  rows={6}
                  maxLength={1000}
                  showCount
                  hint="Supports markdown formatting"
                  error={errors.longDescription?.message}
                  {...register('longDescription')}
                  optional={true}
                />
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-brand border border-warm-gray p-6 space-y-5">
                <h2 className="text-lg font-medium text-charcoal">Pricing</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <FormInput
                        label="Price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        error={errors.price?.message}
                        required
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    )}
                  />

                  <Controller
                    name="originalPrice"
                    control={control}
                    render={({ field }) => (
                      <FormInput
                        label="Compare at Price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        hint="Original price before discount"
                        error={errors.originalPrice?.message}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                      />
                    )}
                  />
                </div>
                {discountPercentage > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-gold/10 rounded-lg">
                    <span className="text-sm font-medium text-charcoal">
                      {discountPercentage}% discount applied!
                    </span>
                  </div>
                )}
              </div>

              {/* Inventory */}
              <div className="bg-white rounded-radius-brand border border-warm-gray p-6 space-y-5">
                <h2 className="text-lg font-medium text-charcoal">Inventory</h2>
                <FormInput
                  label="Stock Quantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  error={errors.stockCount?.message}
                  {...register('stockCount', { valueAsNumber: true })}
                />
              </div>
            </div>
          )}

          {activeTab === 'variants' && (
            <div className="bg-white rounded-brand border border-warm-gray p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-charcoal">
                    Product Variants
                  </h2>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    appendVariant({
                      stock: 0,
                      price: 0,
                      originalPrice: null,
                      images: [],
                      sku: '',
                      attributes: {
                        color: '',
                        size: '',
                        material: '',
                      }
                    })
                  }
                >
                  Add Variant
                </Button>
              </div>

              {variantFields.length === 0 ? (
                <div className="text-center py-12 bg-linen rounded-lg">
                  <Layers className="w-6 h-6 text-warm-gray-dark mx-auto mb-4" />
                  <p className="text-charcoal font-medium">No variants added</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {variantFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 bg-linen rounded-lg space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-medium text-charcoal">
                          Variant {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="p-1 text-warm-gray-dark hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="bg-white rounded-brand border border-warm-gray p-6">
                        <Controller
                          name={`variants.${index}.images`}
                          control={control}
                          render={({ field }) => (
                            <ImageUpload
                              images={field.value}
                              onChange={field.onChange}
                              maxImages={8}
                              label="Product Images"
                              error={errors.variants?.[index]?.images?.message}
                              folder="lumina/products"
                            />
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormInput
                          label='stock'
                          placeholder='variant stock'
                          error={errors.variants?.[index]?.stock?.message}
                          {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                          optional={false}
                        />
                        <FormInput
                          label="price"
                          placeholder="variant price"
                          error={errors.variants?.[index]?.price?.message}
                          {...register(`variants.${index}.price`, { valueAsNumber: true })}
                          optional={false}
                        />

                        <Controller
                          name={`variants.${index}.originalPrice`}
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              value={field.value ?? ''}
                              label='O. price'
                              placeholder='variant original price'
                              error={errors.variants?.[index]?.originalPrice?.message}
                              onChange={(e) =>
                                field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                              }
                            />
                          )}
                        />

                        <FormInput
                          label="sku"
                          placeholder="Enter sku"
                          error={errors.variants?.[index]?.sku?.message}
                          {...register(`variants.${index}.sku`)}
                          optional={false}
                        />

                        <FormInput
                          label="size"
                          placeholder="variant size"
                          error={errors.variants?.[index]?.attributes?.size?.message}
                          {...register(`variants.${index}.attributes.size`)}
                          optional={false}
                        />

                        <FormInput
                          label="color"
                          placeholder="variant color"
                          error={errors.variants?.[index]?.attributes?.color?.message}
                          {...register(`variants.${index}.attributes.color`)}
                          optional={false}
                        />

                        <FormInput
                          label="material"
                          placeholder="variant material"
                          error={errors.variants?.[index]?.attributes?.material?.message}
                          {...register(`variants.${index}.attributes.material`)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="bg-white rounded-brand border border-warm-gray p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-charcoal">
                  Specifications
                </h2>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => appendSpec({ key: '', value: '' })}
                >
                  Add Specification
                </Button>
              </div>

              {specFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-start gap-3 p-3 bg-linen rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormInput
                      placeholder="Name (e.g., Weight)"
                      error={errors.specifications?.[index]?.key?.message}
                      {...register(`specifications.${index}.key`)}
                    />
                    <FormInput
                      placeholder="Value (e.g., 2.5 kg)"
                      error={errors.specifications?.[index]?.value?.message}
                      {...register(`specifications.${index}.value`)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpec(index)}
                    className="p-2 text-warm-gray-dark hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-brand border border-warm-gray p-6 space-y-5">
            <h2 className="text-lg font-medium text-charcoal">Status</h2>
            <Controller
              name="isFeatured"
              control={control}
              render={({ field }) => (
                <FormSwitch
                  label="Featured"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="isNewArrival"
              control={control}
              render={({ field }) => (
                <FormSwitch
                  label="New Arrival"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="isSale"
              control={control}
              render={({ field }) => (
                <FormSwitch
                  label="On Sale"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="bg-white rounded-brand border border-warm-gray p-6 space-y-5">
            <h2 className="text-lg font-medium text-charcoal">Organization</h2>

            <Controller
              name="category.name"
              control={control}
              render={() => {
                const currentName = watch('category.name');
                const matchingCategory = availableCategories.find(c => c.name === currentName);
                const currentId = matchingCategory?._id || '';

                return (
                  <FormSelect
                    label="Category"
                    options={categoryOptions}
                    placeholder="Select category"
                    error={errors.category?.name?.message}
                    value={currentId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedCategory = availableCategories.find(
                        (c) => c._id === selectedId
                      );

                      if (selectedCategory) {
                        setValue('category', {
                          name: selectedCategory.name,
                          parent: selectedCategory.parent || null,
                          ancestors: selectedCategory.ancestors || [],
                        }, { shouldDirty: true, shouldValidate: true });
                      } else {
                        setValue('category',
                          { name: '', parent: null, ancestors: [] },
                        );
                      }
                    }}
                  />
                )
              }}
            />
            {watchedCategory && watchedCategory.name && (
              <div className='w-auto h-auto flex flex-wrap'>
                <Breadcrumb items={categoryBreadcrumbsOptions} />
              </div>
            )}
          </div>

          {/* Preview Card */}
          {watchedImages.length > 0 && (
            // watchedImages.map((img, idx) => ())
            <div className="bg-white rounded-brand border border-warm-gray p-6 space-y-4">
              <h2 className="text-lg font-medium text-charcoal">Preview</h2>
              <div className='grid grid-cols-2 gap-1'>
                {
                  watchedImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-linen">
                      <Image
                        src={img}
                        alt={`Product preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                        fill
                      />
                      {watch('isNewArrival') && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-charcoal text-white text-xs font-medium rounded">
                          New
                        </span>
                      )}
                      {watch('isSale') && discountPercentage > 0 && (
                        <span className="absolute top-2 right-2 px-2 py-1 bg-gold text-white text-xs font-medium rounded">
                          -{discountPercentage}%
                        </span>
                      )}
                    </div>
                  ))
                }
              </div>
              <div>
                <p className="font-medium text-charcoal truncate">
                  {watch('name') || 'Product Name'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gold font-semibold">
                    ${watchedPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}