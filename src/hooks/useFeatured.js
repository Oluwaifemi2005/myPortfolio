import { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/projectService';
import { photoService } from '../services/photoService';

function normalizeItem(item) {
  if (!item) return null;
  return {
    ...item,
    id: item.id || item._id,
    image: item.image || item.imageUrl || ''
  };
}

/**
 * Custom hook for fetching homepage featured projects and latest shots from backend API
 * Does NOT fallback to static demo data so public UI accurately waits for real backend data.
 */
export function useFeatured() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [latestShots, setLatestShots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFeatured = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectsResult, photosResult] = await Promise.allSettled([
        projectService.getFeaturedProjects(3),
        photoService.getFeaturedPhotos(3)
      ]);

      let anyError = null;

      if (projectsResult.status === 'fulfilled' && Array.isArray(projectsResult.value)) {
        setFeaturedProjects(projectsResult.value.map(normalizeItem).filter(Boolean));
      } else {
        setFeaturedProjects([]);
        if (projectsResult.status === 'rejected') {
          anyError = projectsResult.reason?.message || 'Failed to load featured projects';
        }
      }

      if (photosResult.status === 'fulfilled' && Array.isArray(photosResult.value)) {
        setLatestShots(photosResult.value.map(normalizeItem).filter(Boolean));
      } else {
        setLatestShots([]);
        if (photosResult.status === 'rejected') {
          anyError = anyError || photosResult.reason?.message || 'Failed to load latest photos';
        }
      }

      if (projectsResult.status === 'rejected' && photosResult.status === 'rejected') {
        setError(anyError || 'Failed to load featured portfolio content');
      } else {
        // If at least one succeeded, we don't block the entire page with a fatal error
        setError(null);
      }
    } catch (err) {
      console.error('[Featured API Error]:', err.message);
      setError(err.message || 'Failed to load featured content');
      setFeaturedProjects([]);
      setLatestShots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function execute() {
      try {
        setLoading(true);
        setError(null);

        const [projectsResult, photosResult] = await Promise.allSettled([
          projectService.getFeaturedProjects(3),
          photoService.getFeaturedPhotos(3)
        ]);

        if (isMounted) {
          let anyError = null;

          if (projectsResult.status === 'fulfilled' && Array.isArray(projectsResult.value)) {
            setFeaturedProjects(projectsResult.value.map(normalizeItem).filter(Boolean));
          } else {
            setFeaturedProjects([]);
            if (projectsResult.status === 'rejected') {
              anyError = projectsResult.reason?.message || 'Failed to load featured projects';
            }
          }

          if (photosResult.status === 'fulfilled' && Array.isArray(photosResult.value)) {
            setLatestShots(photosResult.value.map(normalizeItem).filter(Boolean));
          } else {
            setLatestShots([]);
            if (photosResult.status === 'rejected') {
              anyError = anyError || photosResult.reason?.message || 'Failed to load latest photos';
            }
          }

          if (projectsResult.status === 'rejected' && photosResult.status === 'rejected') {
            setError(anyError || 'Failed to load featured portfolio content');
          } else {
            setError(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('[Featured API Error]:', err.message);
          setError(err.message || 'Failed to load featured content');
          setFeaturedProjects([]);
          setLatestShots([]);
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
  }, []);

  return { featuredProjects, latestShots, loading, error, refetch: loadFeatured };
}

export default useFeatured;
