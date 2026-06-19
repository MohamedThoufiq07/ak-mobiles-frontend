import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Reveal, RevealStagger, RevealItem } from '../components/ui/animations';
import { FiSearch } from 'react-icons/fi';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const { data } = await api.get(`/products?search=${encodeURIComponent(query)}`);
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <>
      <Helmet>
        <title>Search Results for "{query}" | AK Mobiles</title>
      </Helmet>

      <Reveal className="bg-slate-100 py-8 border-b border-slate-200">
        <div className="container mx-auto px-4 min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3 min-w-0">
            <FiSearch className="text-brand-orange shrink-0" /> <span className="truncate">Search Results</span>
          </h1>
          <p className="text-slate-500 mt-2 break-words">
            Showing results for <span className="font-bold text-brand-dark">"{query}"</span>
          </p>
        </div>
      </Reveal>

      <div className="container mx-auto px-4 py-12 min-h-[60vh]">
        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No products found</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              We couldn't find any products matching your search for "{query}". 
              Try checking your spelling or using more general terms.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-slate-500 mb-6 font-medium">Found {products.length} products</p>
            <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product) => (
                <RevealItem key={product._id} className="min-w-0">
                  <ProductCard product={product} />
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResultsPage;
