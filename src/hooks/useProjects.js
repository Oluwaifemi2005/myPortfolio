import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { softwareProjects as fallbackProjects } from '../data/softwareProjects';

/**
 * Normalizes project image field (supports both .image and .imageUrl)
 */
function normalizeProject(project) {
  return {
    ...project,
    id: project.id || project._id,
    image: project.image || project.imageUrl || ''
  };
}

/**
 * Custom hook for fetching software projects with resilient fallback
 */
export function useProjects(params = {}) {
  const [projects, setProjects] = useState(() => fallbackProjects.map(normalizeProject));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        setLoading(true);
        const data = await projectService.getProjects(params);

        if (isMounted) {
          if (data && data.length > 0) {
            setProjects(data.map(normalizeProject));
            setIsLive(true);
          } else {
            // Keep fallback if database is empty
            setProjects(fallbackProjects.map(normalizeProject));
            setIsLive(false);
          }
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          // Graceful fallback to static data if backend is offline or unreachable
          console.info('[Projects] Using static fallback projects (backend offline or unseeded).');
          setProjects(fallbackProjects.map(normalizeProject));
          setError(err.message);
          setIsLive(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, [params.featured]);

  return { projects, loading, error, isLive };
}

export default useProjects;
