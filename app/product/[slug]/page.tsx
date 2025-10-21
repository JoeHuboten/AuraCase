import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/database';
import ProductPageClient from '@/components/ProductPageClient';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  // Get related products (same category)
  const relatedProducts = await getProducts({ 
    categoryId: product.categoryId,
    limit: 4 
  });

  return (
    <ProductPageClient 
      product={product} 
      relatedProducts={relatedProducts} 
    />
  );
}