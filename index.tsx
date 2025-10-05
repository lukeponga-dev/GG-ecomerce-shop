/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI, Type } from '@google/genai';
import { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  emoji?: string;
  themeColor?: string;
}

// =================================================================
// STOREFRONT COMPONENTS
// =================================================================

const Storefront = ({ products, isLoading, error, onSwitchToAdmin }) => {
  const [page, setPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigateTo = (pageName, productId = null) => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      setSelectedProduct(product);
    }
    setPage(pageName);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center text-gg-accent-purple text-2xl font-bold p-10">Entering the matrix...</div>;
    }
    if (error) {
      return <div className="text-center text-red-500 text-2xl font-bold p-10">{error}</div>;
    }

    switch (page) {
      case 'collection':
        return <CollectionPage products={products} onViewDetail={(id) => navigateTo('product-detail', id)} />;
      case 'product-detail':
        return <ProductDetailPage product={selectedProduct} onBack={() => navigateTo('collection')} />;
      case 'home':
      default:
        return <HomePage onViewCollection={() => navigateTo('collection')} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8 border-b border-gg-card pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gg-accent-orange tracking-wider cursor-pointer" onClick={() => navigateTo('home')}>
            <span className="text-gg-accent-purple">GG</span> COLLECTOR HUB
          </h1>
          <nav className="mt-4 sm:mt-0 space-x-4 text-sm font-medium">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="text-gray-400 font-medium hover:text-gg-accent-orange transition duration-200">Shop Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('collection'); }} className="text-gray-400 font-medium hover:text-gg-accent-orange transition duration-200">Products</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToAdmin(); }} className="text-gray-400 font-medium hover:text-gg-accent-orange transition duration-200">Admin Panel</a>
          </nav>
        </div>
      </header>
      <main>
        {renderContent()}
      </main>
      <footer className="mt-12 pt-6 border-t border-gg-card text-center text-gray-500 text-sm">
        <p>&copy; 2025 Collector Hub. Inspired by unique blotter art aesthetics.</p>
      </footer>
    </div>
  );
};

const HomePage = ({ onViewCollection }) => (
  <div id="home-view" className="p-6 bg-gg-card rounded-xl shadow-2xl shadow-gg-accent-orange/20">
    <h2 className="text-4xl font-extrabold text-gg-accent-orange mb-4">The Art of Perception</h2>
    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
      Welcome to the nexus of pattern, color, and design. Our collectible blotter art pieces are more than just paper; they are tangible representations of digital aesthetics, translating complex geometries and vibrant palettes into unique, limited-edition artifacts. Explore the gallery, dive into the philosophy behind the perforation, and secure your next masterpiece.
    </p>
    <button onClick={onViewCollection} className="bg-gg-accent-orange hover:bg-orange-600 text-gg-dark font-extrabold py-3 px-8 rounded-lg transition duration-300 shadow-xl shadow-gg-accent-orange/50 text-base">
      View the Collection Now →
    </button>
  </div>
);

const CollectionPage = ({ products, onViewDetail }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-gg-accent-orange pl-3">Featured Collection: Collector's Cut</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <div key={product.id} className="bg-gg-card p-4 rounded-xl card-glow border-2" style={{ borderColor: product.themeColor || '#8B5CF6' }}>
          <div className="h-48 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: product.themeColor ? `${product.themeColor}50` : '#1F2937' }}>
            <span className="text-6xl font-black text-gray-900">{product.emoji || '✨'}</span>
          </div>
          <h3 className="text-xl font-semibold mb-1 truncate text-white">{product.name}</h3>
          <p className="text-gray-400 text-sm mb-3 h-10">{product.description.substring(0, 50)}...</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold" style={{ color: product.themeColor || '#F97316' }}>${Number(product.price).toFixed(2)}</span>
            <button onClick={() => onViewDetail(product.id)} className="view-detail-button bg-gg-highlight-blue hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProductDetailPage = ({ product, onBack }) => {
  if (!product) return <div>Product not found. <a href="#" onClick={onBack}>Go back</a>.</div>;
  return (
    <div>
      <button onClick={onBack} className="text-sm text-gray-400 hover:text-gg-accent-orange mb-4 inline-flex items-center transition duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Collection
      </button>
      <div className="bg-gg-card p-6 rounded-xl shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 p-6 rounded-xl shadow-inner border-4" style={{ backgroundColor: `${product.themeColor}50`, borderColor: product.themeColor }}>
            <div className="h-full min-h-[300px] flex items-center justify-center">
              <span className="text-9xl font-black text-gray-900 drop-shadow-lg">{product.emoji}</span>
            </div>
          </div>
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-extrabold text-white mt-1 mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-gg-accent-orange mb-6">${Number(product.price).toFixed(2)}</p>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Description:</h3>
            <p className="text-gray-300 leading-relaxed mb-8">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// =================================================================
// ADMIN PANEL COMPONENTS
// =================================================================

// Fix: Removed unused 'onAdd' prop from AdminPanel component props. The `onSave` handler manages both creating and updating.
const AdminPanel = ({ products, onSave, onDelete, onSwitchToStore }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleAddClick = () => {
    setCurrentProduct({ id: null, name: '', description: '', price: '', emoji: '', themeColor: '#8B5CF6' });
    setIsFormVisible(true);
  };

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setCurrentProduct(null);
  };

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-gg-card">
        <h1 className="text-3xl font-bold text-gg-accent-purple tracking-wider">Admin Panel</h1>
        <div>
          <button onClick={onSwitchToStore} className="bg-transparent text-gg-highlight-blue hover:bg-gg-highlight-blue hover:text-white font-bold py-2 px-4 rounded mr-4 transition">View Store</button>
          <button onClick={handleAddClick} className="bg-gg-accent-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Add Listing</button>
        </div>
      </header>
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-gg-card p-5 rounded-lg shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{product.name}</h3>
                <p className="text-gray-400 my-2 text-sm">{product.description}</p>
                <span className="text-lg font-semibold text-gg-accent-orange">${Number(product.price).toFixed(2)}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEditClick(product)} className="flex-1 bg-gg-highlight-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">Edit</button>
                <button onClick={() => onDelete(product.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
        {isFormVisible && (
          <ProductForm
            currentProduct={currentProduct}
            onSave={onSave}
            onCancel={handleCancel}
          />
        )}
      </main>
    </div>
  );
};

const ProductForm = ({ currentProduct, onSave, onCancel }) => {
  const [product, setProduct] = useState(currentProduct);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setProduct(currentProduct);
  }, [currentProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let productToSave = { ...product, price: Number(product.price) || 0 };
    if (!productToSave.description && productToSave.name) {
      try {
        setIsGenerating(true);
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Write a short, psychedelic-themed product description for: ${productToSave.name}`,
        });
        productToSave.description = response.text;
      } catch (error) {
        console.error("Error generating description:", error);
        productToSave.description = "Description not available.";
      } finally {
        setIsGenerating(false);
      }
    }
    onSave(productToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gg-card p-8 rounded-xl shadow-2xl w-full max-w-lg border border-gg-accent-purple">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-gg-accent-purple mb-6">{product.id ? 'Modify Listing' : 'New Listing'}</h2>
          <div className="space-y-4">
            <input type="text" name="name" value={product.name} onChange={handleChange} placeholder="Product Name" required className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-gg-highlight-blue focus:ring-gg-highlight-blue/50" />
            <textarea name="description" value={product.description} onChange={handleChange} rows={4} placeholder="Description (leave blank to auto-generate)" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-gg-highlight-blue focus:ring-gg-highlight-blue/50"></textarea>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price" required min="0" step="0.01" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-gg-highlight-blue focus:ring-gg-highlight-blue/50" />
              <input type="text" name="emoji" value={product.emoji} onChange={handleChange} placeholder="Emoji (e.g., ✨)" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-gg-highlight-blue focus:ring-gg-highlight-blue/50" />
              <input type="color" name="themeColor" value={product.themeColor} onChange={handleChange} className="w-full h-12 p-1 rounded-lg bg-gray-800 border border-gray-600 cursor-pointer" />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded">Cancel</button>
            <button type="submit" disabled={isGenerating} className="bg-gg-accent-purple hover:bg-purple-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50">
              {isGenerating ? 'Generating...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// =================================================================
// MAIN APP CONTROLLER
// =================================================================

function App() {
  const [view, setView] = useState('store'); // 'store' or 'admin'
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInitialProducts = useCallback(async () => {
    try {
      setError('');
      setIsLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Generate a list of 4 fictional psychedelic-themed blotter art products. For each, include a creative name, a short, evocative description, a price (as a number), a representative single emoji character, and a vibrant hex color code that matches the theme (e.g., '#F97316' for orange sunshine).",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                price: { type: Type.NUMBER },
                emoji: { type: Type.STRING },
                themeColor: { type: Type.STRING }
              },
              required: ["name", "description", "price", "emoji", "themeColor"],
            },
          },
        },
      });

      const initialProducts = JSON.parse(response.text).map((p, index) => ({
        ...p,
        id: Date.now() + index
      }));
      setProducts(initialProducts);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch initial listings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialProducts();
  }, [fetchInitialProducts]);

  const handleSave = (product: Product) => {
    if (product.id) {
      setProducts(products.map(p => p.id === product.id ? product : p));
    } else {
      setProducts([...products, { ...product, id: Date.now() }]);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  if (view === 'admin') {
    return <AdminPanel
      products={products}
      onSave={handleSave}
      onDelete={handleDelete}
      onSwitchToStore={() => setView('store')}
    />;
  }
  
  return <Storefront
    products={products}
    isLoading={isLoading}
    error={error}
    onSwitchToAdmin={() => setView('admin')}
  />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
