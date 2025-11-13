'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiX } from 'react-icons/fi';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    oldPrice: '',
    discount: '',
    image: '',
    images: '',
    categoryId: '',
    colors: '',
    sizes: '',
    rating: '0',
    reviews: '0',
    inStock: true,
    featured: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        console.error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Product</h1>
          <p className="text-text-secondary mt-2">Create a new product for your catalog</p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-text-secondary hover:text-white transition"
        >
          <FiX size={24} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-background-secondary rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="product-slug"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Old Price
              </label>
              <input
                type="number"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleChange}
                step="0.01"
                className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Image URL *
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Additional Images
              </label>
              <input
                type="text"
                name="images"
                value={formData.images}
                onChange={handleChange}
                className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Comma-separated image URLs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Colors
              </label>
              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Black, White, Blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Sizes
              </label>
              <input
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
                className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Small, Medium, Large"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Rating
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="0.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Reviews Count
              </label>
              <input
                type="number"
                name="reviews"
                value={formData.reviews}
                onChange={handleChange}
                min="0"
                className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="0"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="w-4 h-4 text-accent bg-background border-gray-700 rounded focus:ring-accent"
              />
              <span className="ml-2 text-white">In Stock</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-accent bg-background border-gray-700 rounded focus:ring-accent"
              />
              <span className="ml-2 text-white">Featured Product</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-light transition flex items-center gap-2 disabled:opacity-50"
          >
            <FiSave size={20} />
            {isLoading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
