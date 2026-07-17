'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  productSchema,
  ProductFormData,
} from '@/lib/validations/product.validation/product.schema'

import { FormHeader } from './FormHeader'
import { FormTabs } from './FormTabs'
import { BasicFields } from './BasicFields'
import { Inventory } from './Inventory'
import { Variant } from './Variant'
import { Specifications } from './Specifications'
import { Status } from './Status'
import { Organization } from './Organization'
import { PreviewCard } from './PreviewCard'

import {
  CategoryOption,
  ProductFormTab,
  ProductFromDB,
} from './types'

interface ProductFormProps {
  initialData?: ProductFromDB
  availableCategories: CategoryOption[]
}

export function ProductForm({
  initialData,
  availableCategories = [],
}: ProductFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<ProductFormTab>('basic')

  const isEditMode = Boolean(initialData?.id)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
        name: '',
        description: '',
        longDescription: '',
        category: { name: '', parent: null, ancestors: [] },
        variants: [],
        specifications: [],
        isNewArrival: false,
        isSale: false,
        isFeatured: false,
        brand: '',
      },
  })

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = form

  const variantsArray = useFieldArray({
    control,
    name: 'variants',
  })

  const specsArray = useFieldArray({
    control,
    name: 'specifications',
  })

  const watchedVariants = watch('variants')
  const watchedImages = watchedVariants.flatMap((variant) => variant.images || [])

  // const watchedPrice = watch('price')
  // const watchedOriginalPrice = watch('originalPrice')
  const watchedCategory = watch('category')
  const watchedName = watch('name')
  const watchedIsNewArrival = watch('isNewArrival')
  const watchedIsSale = watch('isSale')

  // preview price
  const previewVariant =
    watchedVariants.find((variant) => variant.stock > 0) ||
    watchedVariants[0]

  const previewPrice = previewVariant?.price ?? 0
  const previewOriginalPrice = previewVariant?.originalPrice ?? null

  const previewDiscountPercentage =
    previewOriginalPrice && previewOriginalPrice > previewPrice
      ? Math.round(
        ((previewOriginalPrice - previewPrice) / previewOriginalPrice) * 100
      )
      : 0

  const totalStock = watchedVariants.reduce(
    (sum, variant) => sum + Number(variant.stock || 0),
    0
  )

  const categoryOptions = useMemo(() => {
    return availableCategories.map((cat) => ({
      value: cat._id,
      label: cat.name,
    }))
  }, [availableCategories])

  const categoryBreadcrumbsOptions = useMemo(() => {
    const ancestors =
      watchedCategory?.ancestors?.map((cat) => ({
        href: cat,
        label: cat,
      })) ?? []

    if (watchedCategory?.name) {
      ancestors.push({
        href: watchedCategory.name,
        label: watchedCategory.name,
      })
    }

    return ancestors
  }, [watchedCategory])

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    startTransition(async () => {
      try {
        const url = isEditMode
          ? `/api/products/${initialData!.id}`
          : '/api/products'

        const method = isEditMode ? 'PATCH' : 'POST'

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to save product')
        }

        const result = await response.json()

        router.push(`/admin/products/edit/${result.product.id}`)
        router.refresh()
      } catch (error) {
        console.error('Error saving product:', error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <FormHeader
        isEditMode={isEditMode}
        isPending={isPending}
        isDirty={isDirty}
        onCancel={() => router.back()}
      />

      <FormTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <BasicFields register={register} errors={errors} />

              {/* <Inventory register={register} errors={errors} /> */}
              <Inventory stockCount={totalStock} label="total stock" />
            </div>
          )}

          {activeTab === 'variants' && (
            <Variant
              control={control}
              register={register}
              errors={errors}
              fields={variantsArray.fields}
              append={variantsArray.append}
              remove={variantsArray.remove}
            />
          )}

          {activeTab === 'specs' && (
            <Specifications
              register={register}
              errors={errors}
              fields={specsArray.fields}
              append={specsArray.append}
              remove={specsArray.remove}
            />
          )}
        </div>

        <div className="space-y-6">
          <Status control={control} />

          <Organization
            control={control}
            watch={watch}
            setValue={setValue}
            errors={errors}
            availableCategories={availableCategories}
            categoryOptions={categoryOptions}
            breadcrumbs={categoryBreadcrumbsOptions}
          />

          <PreviewCard
            images={watchedImages}
            name={watchedName}
            price={previewPrice}
            isNewArrival={watchedIsNewArrival}
            isSale={watchedIsSale}
            discountPercentage={previewDiscountPercentage}
          />
        </div>
      </div>
    </form>
  )
}
