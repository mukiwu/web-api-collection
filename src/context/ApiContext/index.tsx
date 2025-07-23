import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { ApiContext } from './context';
import type { TagMetadata } from '../../types';

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [popularTags, setPopularTags] = useState<TagMetadata[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPopularTags = async () => {
      setIsLoadingTags(true);
      try {
        const { data, error } = await supabase
          .from('popular_tags')
          .select('*');
        
        if (error) throw error;
        
        setPopularTags(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '發生錯誤');
        setPopularTags([]);
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchPopularTags();
  }, []);

  return (
    <ApiContext.Provider value={{
      popularTags,
      isLoadingTags,
      error,
      search,
      setSearch,
    }}>
      {children}
    </ApiContext.Provider>
  );
}; 
