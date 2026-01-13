import React, { useState, useEffect } from 'react';
import { supabase } from '../services/authService';

const Debug: React.FC = () => {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const testResults: any = {};

    // Test 1: Supabase 클라이언트 확인
    testResults.supabaseExists = !!supabase;
    console.log('🔍 Supabase client exists:', testResults.supabaseExists);

    if (!supabase) {
      setResults(testResults);
      setLoading(false);
      return;
    }

    // Test 2: 모든 제품 조회 (조건 없음)
    try {
      const { data: allData, error: allError } = await supabase
        .from('products')
        .select('*');
      testResults.allProducts = { data: allData, error: allError };
      console.log('🔍 All products:', { data: allData, error: allError });
    } catch (error) {
      testResults.allProducts = { error };
      console.error('❌ All products error:', error);
    }

    // Test 3: RLS 조건 포함 조회
    try {
      const { data: activeData, error: activeError } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .is('deleted_at', null);
      testResults.activeProducts = { data: activeData, error: activeError };
      console.log('🔍 Active products:', { data: activeData, error: activeError });
    } catch (error) {
      testResults.activeProducts = { error };
      console.error('❌ Active products error:', error);
    }

    // Test 4: 타임딜 제품
    try {
      const { data: timeDealData, error: timeDealError } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .not('sale_end_date', 'is', null)
        .is('deleted_at', null);
      testResults.timeDealProducts = { data: timeDealData, error: timeDealError };
      console.log('🔍 Time deal products:', { data: timeDealData, error: timeDealError });
    } catch (error) {
      testResults.timeDealProducts = { error };
      console.error('❌ Time deal products error:', error);
    }

    // Test 5: 일반 제품
    try {
      const { data: regularData, error: regularError } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .is('sale_end_date', null)
        .is('deleted_at', null);
      testResults.regularProducts = { data: regularData, error: regularError };
      console.log('🔍 Regular products:', { data: regularData, error: regularError });
    } catch (error) {
      testResults.regularProducts = { error };
      console.error('❌ Regular products error:', error);
    }

    setResults(testResults);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔍 Supabase Debug Page</h1>
        
        <button
          onClick={runTests}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg mb-6 hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? '테스트 중...' : '다시 테스트'}
        </button>

        <div className="space-y-4">
          {/* Environment Variables */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-2">0. Environment Variables</h2>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-semibold">VITE_SUPABASE_URL:</span>{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {import.meta.env.VITE_SUPABASE_URL || '❌ undefined'}
                </code>
              </p>
              <p>
                <span className="font-semibold">VITE_SUPABASE_ANON_KEY:</span>{' '}
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {import.meta.env.VITE_SUPABASE_ANON_KEY 
                    ? `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 30)}...` 
                    : '❌ undefined'}
                </code>
              </p>
            </div>
          </div>

          {/* Supabase Client */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-2">1. Supabase Client</h2>
            <p className={results.supabaseExists ? 'text-green-600' : 'text-red-600'}>
              {results.supabaseExists ? '✅ Initialized' : '❌ Not Initialized'}
            </p>
          </div>

          {/* All Products */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-2">2. All Products (no conditions)</h2>
            {results.allProducts ? (
              <>
                <p className="font-semibold">Data Count: {results.allProducts.data?.length || 0}</p>
                <p className={results.allProducts.error ? 'text-red-600' : 'text-green-600'}>
                  {results.allProducts.error ? `❌ Error: ${JSON.stringify(results.allProducts.error)}` : '✅ Success'}
                </p>
                <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-auto max-h-40">
                  {JSON.stringify(results.allProducts.data, null, 2)}
                </pre>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          {/* Active Products */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-2">3. Active Products (RLS conditions)</h2>
            {results.activeProducts ? (
              <>
                <p className="font-semibold">Data Count: {results.activeProducts.data?.length || 0}</p>
                <p className={results.activeProducts.error ? 'text-red-600' : 'text-green-600'}>
                  {results.activeProducts.error ? `❌ Error: ${JSON.stringify(results.activeProducts.error)}` : '✅ Success'}
                </p>
                <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-auto max-h-40">
                  {JSON.stringify(results.activeProducts.data, null, 2)}
                </pre>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          {/* Time Deal Products */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-2">4. Time Deal Products</h2>
            {results.timeDealProducts ? (
              <>
                <p className="font-semibold">Data Count: {results.timeDealProducts.data?.length || 0}</p>
                <p className={results.timeDealProducts.error ? 'text-red-600' : 'text-green-600'}>
                  {results.timeDealProducts.error ? `❌ Error: ${JSON.stringify(results.timeDealProducts.error)}` : '✅ Success'}
                </p>
                <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-auto max-h-40">
                  {JSON.stringify(results.timeDealProducts.data, null, 2)}
                </pre>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          {/* Regular Products */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-2">5. Regular Products</h2>
            {results.regularProducts ? (
              <>
                <p className="font-semibold">Data Count: {results.regularProducts.data?.length || 0}</p>
                <p className={results.regularProducts.error ? 'text-red-600' : 'text-green-600'}>
                  {results.regularProducts.error ? `❌ Error: ${JSON.stringify(results.regularProducts.error)}` : '✅ Success'}
                </p>
                <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-auto max-h-40">
                  {JSON.stringify(results.regularProducts.data, null, 2)}
                </pre>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debug;
