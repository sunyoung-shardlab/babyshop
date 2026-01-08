import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';

const Products: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-20">
      {/* 헤더 */}
      <div className="bg-white p-6 border-b border-[#E7EBEF] sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-[#1C1C1C]">전체 상품</h1>
        <p className="text-sm text-[#8F90A6] mt-1">{MOCK_PRODUCTS.length}개의 상품</p>
      </div>

      {/* 상품 리스트 */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {MOCK_PRODUCTS.map(product => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="space-y-2 group"
            >
              {/* 상품 이미지 */}
              <div className="aspect-square rounded-lg overflow-hidden border border-[#E7EBEF] bg-white shadow-sm group-hover:shadow-md transition-shadow relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                />
                {/* 배지 */}
                {product.type === 'B' && (
                  <div className="absolute top-2 left-2 bg-[#FF5C02] text-white px-2 py-1 text-xs rounded font-bold">
                    핫딜
                  </div>
                )}
                {product.isHalal && (
                  <div className="absolute top-2 right-2 bg-[#E3FFF1] text-[#06C270] px-2 py-1 text-xs rounded font-bold">
                    할랄
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
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-[#8F90A6] line-through">
                      RM {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8F90A6]">{product.category}</p>
                {product.stock < 10 && (
                  <p className="text-xs text-[#FF8800] font-bold">
                    재고 {product.stock}개
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
