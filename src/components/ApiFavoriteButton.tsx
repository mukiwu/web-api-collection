import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { getAnonymousId } from '../utils/anonymousId';

type ApiFavoriteButtonProps = {
  apiId: string;
};

const ApiFavoriteButton: React.FC<ApiFavoriteButtonProps> = ({ apiId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const anonymousId = getAnonymousId();

  // 查詢收藏數
  const fetchCount = useCallback(async () => {
    const { count } = await supabase
      .from('api_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('api_id', apiId);
    setFavoriteCount(count || 0);
  }, [apiId]);

  // 檢查是否已收藏
  useEffect(() => {
    const checkFavorite = async () => {
      const { data } = await supabase
        .from('api_favorites')
        .select('id')
        .eq('api_id', apiId)
        .eq('anonymous_id', anonymousId)
      setIsFavorite(data && data.length > 0 || false);
    };
    checkFavorite();
    fetchCount();
  }, [apiId, anonymousId, fetchCount]);

  // 收藏
  const handleFavorite = async () => {
    setLoading(true);
    await supabase.from('api_favorites').insert([
      { api_id: apiId, anonymous_id: anonymousId }
    ]);
    setIsFavorite(true);
    await fetchCount();
    setLoading(false);
  };

  // 取消收藏
  const handleUnfavorite = async () => {
    setLoading(true);
    await supabase
      .from('api_favorites')
      .delete()
      .eq('api_id', apiId)
      .eq('anonymous_id', anonymousId);
    setIsFavorite(false);
    await fetchCount();
    setLoading(false);
  };

  return (
    <button
      className={`w-8 h-8 flex items-center justify-center rounded-[8px] hover:cursor-pointer ${isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}
      onClick={isFavorite ? handleUnfavorite : handleFavorite}
      disabled={loading}
      title={isFavorite ? '取消收藏' : '加入收藏'}
    >
      <i className={isFavorite ? 'ri-bookmark-fill' : 'ri-bookmark-line'}></i>
      <span className="ml-1 text-xs">{favoriteCount}</span>
    </button>
  );
};

export default ApiFavoriteButton;
