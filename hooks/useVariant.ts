'use client'

import { useState, useMemo } from 'react'
import type { ProductVariant, Attribute } from '@/lib/types'
import { normalizedValue } from '@/lib/utils'

const buildKey = (attrs: Attribute) =>
  Object.entries(attrs)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|")

const filterAttributes = (attrs: Attribute) => {
  const result: Attribute = {} as Attribute

  if (!attrs) return result

  for (const [key, value] of Object.entries(attrs)) {
    if (value !== undefined) {
      result[key] = value
    }
  }

  return result
}

export function useVariantSelector(variants: ProductVariant[]) {
  // look up map
  const { variantKeyMap, attributeValues } = useMemo(() => {

    const variantKeyMap = new Map<string, ProductVariant>()
    const attributeValues: Record<string, Set<string>> = {}

    for (const variant of variants) {
      const attrs = variant.attributes
      const filteredAttrs = filterAttributes(attrs ?? {})

      const key = buildKey(filteredAttrs)

      variantKeyMap.set(key, variant)

      for (const [attr, value] of Object.entries(attrs)) {

        if (!attributeValues[attr]) {
          attributeValues[attr] = new Set()
        }

        if (value) {
          attributeValues[attr].add(normalizedValue(value))
        }
      }
    }

    console.log('Attribute Values:', attributeValues)

    return { variantKeyMap, attributeValues }

  }, [variants])

  // initial variant (default)
  const initialVariant = useMemo(() => {
    return variants.find(v => v.stock > 0) ?? variants[0]
  }, [variants])

  const initSelected = filterAttributes(initialVariant?.attributes ?? {})
  const [selected, setSelected] = useState<Attribute>(initSelected)

  //current variant
  const currentVariant = useMemo(() => {
    const key = buildKey(selected)
    return variantKeyMap.get(key)
  }, [selected, variantKeyMap])

  // Check if an option is valid
  const isOptionAvailable = (attribute: string, value: string) => {
    const test = { ...selected, [attribute]: value }
    for (const variant of variants) {
      let matches = true
      for (const [attr, val] of Object.entries(test)) {
        if (variant.attributes?.[normalizedValue(attr)] !== normalizedValue(val ?? '')) {
          matches = false
          break
        }
      }

      if (matches && variant.stock > 0) {
        return true
      }
    }

    return false
  }

  // Change attribute
  const setAttribute = (attributes: Partial<Attribute>) => {
    const [attribute, value] = Object.entries(attributes)[0]
    setSelected(prev => {
      if (prev[attribute] === value) return prev

      const next: Attribute = {
        ...prev,
        [attribute]: value
      }

      // is this combination valid?
      const key = buildKey(next)

      if (variantKeyMap.has(key)) {
        return next
      }

      // fallback
      for (const variant of variants) {
        if (variant.attributes?.[attribute] === value) {
          return filterAttributes(variant.attributes ?? {})
        }

      }
      return prev
    })
  }

  // Attribute options
  const getOptions = (attribute: string) => {
    const values = attributeValues[attribute]
    if (!values) return []
    return Array.from(values).map(value => ({
      value,
      available: isOptionAvailable(attribute, value)
    }))
  }

  return {

    selectedVariants: selected,
    setAttribute,
    currentVariant,
    getOptions,
    attributes: Object.keys(attributeValues)

  }
}