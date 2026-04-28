import { ProductForm } from '@/components/forms/ProductForm'
import { getLeafCategories } from '@/lib/queries/get.leaf.categories';

export default async function NewProductPage() {
  const flatCategories = await getLeafCategories()

  console.log("flat categories", flatCategories)
  console.log('flatCategories[0].ancestors[0]', flatCategories[0].ancestors[0])
  return (
    <ProductForm
      availableCategories={flatCategories}
    />
  );
}