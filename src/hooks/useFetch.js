import { useState, useEffect, useRef } from 'react';

export const useFetch = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        const res = await fetch(endpoint, fetchOptions);
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
  }, [endpoint]); // <-- only re-run when endpoint changes
  // options are handled via ref, not as a dependency

  return { data, loading, error };
};