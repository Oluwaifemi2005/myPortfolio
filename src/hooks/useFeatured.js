import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { photoService } from '../services/photoService';
import { softwareProjects as fallbackProjects } from '../data/softwareProjects';
import { photographyData as fallbackPhotos } from '../data/photographyData';

function normalizeItem(item) {
  return {
    ...item,
    id: item.id || item._id,
    image: item.image || item.imageUrl || ''
  };
}

/**
 * Custom hook for fetching homepage featured projects and latest shots
 */
export function useFeatured() {
  const [featuredProjects, setFeaturedProjects] = useState(() =>
    fallbackProjects.filter((p) => p.featured).slice(0, 3).map(normalizeItem)
  );
  const [latestShots, setLatestShots] = useState(() =>
    fallbackPhotos.filter((p) => p.featured).slice(0, 3).map(normalizeItem)
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFeatured() {
      try {
        setLoading(true);
        const [projectsData, photosData] = await Promise.all([
          projectService.getFeaturedProjects(3).catch(() => null),
          photoService.getFeaturedPhotos(3).catch(() => null)
        ]);

        if (isMounted) {
          if (projectsData && projectsData.length > 0) {
            setFeaturedProjects(projectsData.map(normalizeItem));
          }

          if (photosData && photosData.length > 0) {
            setLatestShots(photosData.map(normalizeItem));
          }

          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

  return { featuredProjects, latestShots, loading, error };
}

export default useFeatured;
