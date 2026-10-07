import { useState, useEffect, useCallback } from 'react';
import { photoService } from '../services/photoService';

/**
 * Normalizes photo image field (supports both .image and .imageUrl)
 */
function normalizePhoto(photo) {
  if (!photo) return null;
  return {
    ...photo,
    id: photo.id || photo._id,
    image: photo.image || photo.imageUrl || ''
  };
}

/**
 * Custom hook for fetching photography with category list from backend API
 * Does NOT fallback to static demo data so public UI accurately waits for real backend data.
 */
export function usePhotos(params = {}) {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryParam = params.category;
  const featuredParam = params.featured;
  const limitParam = params.limit;

  const loadPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = {};
      if (categoryParam) queryParams.category = categoryParam;
      if (featuredParam !== undefined) queryParams.featured = featuredParam;
      if (limitParam !== undefined) queryParams.limit = limitParam;

      const [photoData, catData] = await Promise.all([
        photoService.getPhotos(queryParams),
        photoService.getCategories().catch(() => [])
      ]);

      if (Array.isArray(photoData)) {
        const normalized = photoData.map(normalizePhoto).filter(Boolean);
        setPhotos(normalized);
        if (Array.isArray(catData) && catData.length > 0) {
          setCategories(catData);
        } else {
          setCategories(Array.from(new Set(normalized.map(p => p.category).filter(Boolean))));
        }
      } else {
        setPhotos([]);
        setCategories([]);
      }
      setError(null);
    } catch (err) {
      console.error('[Photos API Error]:', err.message);
      setPhotos([]);
      setCategories([]);
      setError(err.message || 'Failed to load photography items');
    } finally {
      setLoading(false);
    }
  }, [categoryParam, featuredParam, limitParam]);

  useEffect(() => {
    let isMounted = true;

    async function execute() {
      try {
        setLoading(true);
        setError(null);
        const queryParams = {};
        if (categoryParam) queryParams.category = categoryParam;
        if (featuredParam !== undefined) queryParams.featured = featuredParam;
        if (limitParam !== undefined) queryParams.limit = limitParam;

        const [photoData, catData] = await Promise.all([
          photoService.getPhotos(queryParams),
          photoService.getCategories().catch(() => [])
        ]);

        if (isMounted) {
          if (Array.isArray(photoData)) {
            const normalized = photoData.map(normalizePhoto).filter(Boolean);
            setPhotos(normalized);
            if (Array.isArray(catData) && catData.length > 0) {
              setCategories(catData);
            } else {
              setCategories(Array.from(new Set(normalized.map(p => p.category).filter(Boolean))));
            }
          } else {
            setPhotos([]);
            setCategories([]);
          }
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('[Photos API Error]:', err.message);
          setPhotos([]);
          setCategories([]);
          setError(err.message || 'Failed to load photography items');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    execute();

    return () => {
      isMounted = false;
    };
  }, [categoryParam, featuredParam, limitParam]);

  return { photos, categories, loading, error, refetch: loadPhotos };
}

export default usePhotos;
