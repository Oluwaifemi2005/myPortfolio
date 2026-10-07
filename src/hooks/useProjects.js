import { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/projectService';

/**
 * Normalizes project image field (supports both .image and .imageUrl)
 */
function normalizeProject(project) {
  if (!project) return null;
  return {
    ...project,
    id: project.id || project._id,
    image: project.image || project.imageUrl || ''
  };
}

/**
 * Custom hook for fetching software projects from backend API
 * Does NOT fallback to static demo data so public UI accurately waits for real backend data.
 */
export function useProjects(params = {}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const featuredParam = params.featured;
  const limitParam = params.limit;

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = {};
      if (featuredParam !== undefined) queryParams.featured = featuredParam;
      if (limitParam !== undefined) queryParams.limit = limitParam;

      const data = await projectService.getProjects(queryParams);

      if (Array.isArray(data)) {
        setProjects(data.map(normalizeProject).filter(Boolean));
      } else {
        setProjects([]);
      }
      setError(null);
    } catch (err) {
      console.error('[Projects API Error]:', err.message);
      setProjects([]);
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [featuredParam, limitParam]);

  useEffect(() => {
    let isMounted = true;

    async function execute() {
      try {
        setLoading(true);
        setError(null);
        const queryParams = {};
        if (featuredParam !== undefined) queryParams.featured = featuredParam;
        if (limitParam !== undefined) queryParams.limit = limitParam;

        const data = await projectService.getProjects(queryParams);
        if (isMounted) {
          if (Array.isArray(data)) {
            setProjects(data.map(normalizeProject).filter(Boolean));
          } else {
            setProjects([]);
          }
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('[Projects API Error]:', err.message);
          setProjects([]);
          setError(err.message || 'Failed to load projects');
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
  }, [featuredParam, limitParam]);

  return { projects, loading, error, refetch: loadProjects };
}

export default useProjects;
