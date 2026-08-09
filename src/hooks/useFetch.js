import { useState, useEffect, useRef } from 'react';

export const useFetch = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolvedEndpoint = (() => {
    if (!endpoint || /^https?:\/\//i.test(endpoint)) return endpoint;

    if (typeof window !== 'undefined' && import.meta.env.PROD) {
      return `${window.location.origin}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    }

    return endpoint;
  })();

  // Store options in a ref to avoid re-running effect on options change
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchOptions = {
          ...optionsRef.current,
          headers: {
            'ngrok-skip-browser-warning': 'true',
            ...(optionsRef.current.headers || {}),
          },
        };

        const res = await fetch(resolvedEndpoint, fetchOptions);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [resolvedEndpoint]); // <-- rerun when the resolved URL changes
  // options are handled via ref, not as a dependency

  return { data, loading, error };
};