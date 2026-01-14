import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { getAllProducts } from '../services/productService';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error('제품 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-20">
      {/* 헤더 */}
      <div className="bg-white p-6 border-b border-[#E7EBEF] sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-[#1C1C1C]">전체 상품</h1>
        <p className="text-sm text-[#8F90A6] mt-1">{products.length}개의 상품</p>
      </div>

      {/* 상품 리스트 */}
      <div className="p-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="space-y-2">
                <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map(product => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="space-y-2 group"
              >
                {/* 상품 이미지 */}
                <div className="aspect-square rounded-lg overflow-hidden border border-[#E7EBEF] bg-white shadow-sm group-hover:shadow-md transition-shadow relative">
                  <img
                    src={product.thumbnail_url}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                  />
                  {/* 할랄 인증 아이콘 (쇼핑 탭) */}
                  {product.tags?.includes('할랄 인증') && (
                    <div className="absolute top-2 right-2">
                      <img src="https://cnumxvxxyxexzzyeinjr.supabase.co/storage/v1/object/public/product-images/halal-icon.png" alt="할랄 인증" className="w-7 h-7" />
                    </div>
                  )}
                </div>

                {/* 상품 정보 */}
                <div className="space-y-1">
                  <h3 className="font-medium text-sm line-clamp-2 h-10 text-[#1C1C1C]">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[#FF5C02] font-bold text-base">
                      RM {product.price.toFixed(2)}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-xs text-[#8F90A6] line-through">
                        RM {product.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  {/* 핫딜 태그 (가격 하단) */}
                  {product.sale_end_date && (
                    <div className="inline-block bg-[#FFE5E5] text-[#FF5C02] px-2 py-0.5 text-xs rounded font-bold">
                      핫딜
                    </div>
                  )}
                  
                  <p className="text-xs text-[#8F90A6]">{product.category}</p>
                  {product.stock_quantity < 10 && (
                    <p className="text-xs text-[#FF8800] font-bold">
                      재고 {product.stock_quantity}개
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
