import { ProductForm } from '@/components/forms/product/ProductForm'
import { getLeafCategories } from '@/lib/queries/get.leaf.categories';

export default async function NewProductPage() {
  const flatCategories = await getLeafCategories()

  return (
    <ProductForm
      availableCategories={flatCategories}
    />
  );
}
