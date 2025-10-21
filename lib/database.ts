import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database query functions
export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function getProducts(options?: {
  categoryId?: string;
  featured?: boolean;
  limit?: number;
  orderBy?: 'price' | 'rating' | 'createdAt';
  order?: 'asc' | 'desc';
}) {
  const where: any = {};
  
  if (options?.categoryId) {
    where.categoryId = options.categoryId;
  }
  
  if (options?.featured !== undefined) {
    where.featured = options.featured;
  }

  const orderBy: any = {};
  if (options?.orderBy) {
    orderBy[options.orderBy] = options.order || 'desc';
  } else {
    orderBy.createdAt = 'desc';
  }

  return await prisma.product.findMany({
    where,
    include: {
      category: true
    },
    orderBy,
    take: options?.limit
  });
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true
    }
  });
}

export async function getCategoryBySlug(slug: string) {
  return await prisma.category.findUnique({
    where: { slug }
  });
}

export async function getProductsByCategory(categorySlug: string) {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return [];

  return await prisma.product.findMany({
    where: { categoryId: category.id },
    include: {
      category: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getFeaturedProducts(limit: number = 4) {
  return await getProducts({ featured: true, limit });
}

export async function getNewArrivals(limit: number = 4) {
  return await getProducts({ limit, orderBy: 'createdAt', order: 'desc' });
}

export async function getTopSelling(limit: number = 4) {
  return await getProducts({ limit, orderBy: 'rating', order: 'desc' });
}

export async function searchProducts(query: string) {
  return await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
        { category: { name: { contains: query } } }
      ]
    },
    include: {
      category: true
    },
    orderBy: { rating: 'desc' }
  });
}
