import { useState, useEffect } from 'react';
import { photoService } from '../services/photoService';
import { photographyData as fallbackPhotos } from '../data/photographyData';

/**
 * Normalizes photo image field (supports both .image and .imageUrl)
 */
function normalizePhoto(photo) {
  return {
    ...photo,
    id: photo.id || photo._id,
    image: photo.image || photo.imageUrl || ''
  };
}

/**
 * Custom hook for fetching photography with category list and resilient fallback
 */
export function usePhotos(params = {}) {
  const [photos, setPhotos] = useState(() => fallbackPhotos.map(normalizePhoto));
  const [categories, setCategories] = useState(() => {
    return Array.from(new Set(fallbackPhotos.map((p) => p.category)));
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPhotos() {
      try {
        setLoading(true);
        const [photoData, catData] = await Promise.all([
          photoService.getPhotos(params),
          photoService.getCategories().catch(() => [])
        ]);

        if (isMounted) {
          if (photoData && photoData.length > 0) {
            setPhotos(photoData.map(normalizePhoto));
            setIsLive(true);
          } else {
            setPhotos(fallbackPhotos.map(normalizePhoto));
            setIsLive(false);
          }

          if (catData && catData.length > 0) {
            setCategories(catData);
          }

          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.info('[Photos] Using static fallback photography (backend offline or unseeded).');
          setPhotos(fallbackPhotos.map(normalizePhoto));
          setError(err.message);
          setIsLive(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPhotos();

    return () => {
      isMounted = false;
    };
  }, [params.category, params.featured]);

  return { photos, categories, loading, error, isLive };
}

export default usePhotos;
