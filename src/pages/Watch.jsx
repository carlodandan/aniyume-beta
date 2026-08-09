// src/pages/Watch.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Artplayer from 'artplayer';
import Hls from 'hls.js';

const Watch = () => {
  const { slug, ep } = useParams();
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  // Server selection
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedType, setSelectedType] = useState('sub');

  // Stream data (includes the original CDN URL with token, subtitles, etc.)
  const [streamData, setStreamData] = useState(null);
  const [streamLoading, setStreamLoading] = useState(false);
  const [streamError, setStreamError] = useState(null);

  // Fetch server list
  const { data, loading, error } = useFetch(`/api/servers/${slug}/${ep}`);

  // Pick first server of selected type
  useEffect(() => {
    if (data) {
      const servers = data[selectedType] || [];
      if (servers.length > 0) {
        setSelectedServer(servers[0]);
      }
    }
  }, [data, selectedType]);

  // Fetch stream metadata (subtitles, etc.) when server changes
  useEffect(() => {
    if (!selectedServer) return;

    try {
      // Extract access_id and v from the server's dataLink
      const urlObj = new URL(selectedServer.dataLink);
      const pathParts = urlObj.pathname.split('/');
      const access_id = pathParts[pathParts.length - 1];
      const v = urlObj.searchParams.get('v') || '2';

      setStreamLoading(true);
      setStreamError(null);
      setStreamData(null);

      fetch(`/api/stream/${access_id}?v=${v}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          setStreamData(data);
          setStreamLoading(false);
        })
        .catch(err => {
          setStreamError(err.message);
          setStreamLoading(false);
        });
    } catch (err) {
      setStreamError('Invalid server URL');
      setStreamLoading(false);
    }
  }, [selectedServer]);

  // Initialize player when stream URL is ready
  useEffect(() => {
    if (!streamData?.url || !containerRef.current) return;

    // Destroy old player
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    // ----- PROXY MANIFEST URL -----
    // Use the original stream URL (with token) and pass it to our proxy
    const proxyManifestUrl = `/api/proxy/manifest?url=${encodeURIComponent(streamData.url)}`;
    // ---------------------------------

    // Build subtitle tracks
    const tracks = (streamData.subtitles || []).map(sub => ({
      kind: 'subtitles',
      label: sub.language || 'Subtitle',
      language: sub.language?.split('(')[0]?.trim() || 'en',
      file: sub.url,   // if subtitles also have CORS issues, proxy them as well
      default: sub.default || false,
    }));

    const player = new Artplayer({
      container: containerRef.current,
      url: proxyManifestUrl,    // <-- use proxy manifest URL
      type: 'm3u8',
      autoplay: true,
      setting: true,
      pip: true,
      fullscreen: true,
      autoSize: true,
      tracks: tracks,
      customType: {
        m3u8: function (video, url) {
          const hls = new Hls({
            enableWorker: false,
            enableWebAssembly: false,
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          video._hls = hls;
        },
      },
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [streamData]); // only re-run when streamData changes

  // --- Rendering --- (unchanged)

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-[#0a0a0f]">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
            <p className="mt-4 text-zinc-500">Loading video servers...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Header />
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-[#0a0a0f]">
          <div className="max-w-md px-4 text-center">
            <div className="mb-4 text-6xl">😿</div>
            <h2 className="mb-2 text-xl font-bold text-white">Could not load video</h2>
            <p className="text-sm text-zinc-500">{error || 'No servers available'}</p>
            <Link
              to={`/anime/${slug}`}
              className="mt-4 inline-block rounded-lg bg-cyan-500 px-6 py-2 font-medium text-white transition-colors hover:bg-cyan-400"
            >
              Go back
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const subServers = data.sub || [];
  const dubServers = data.dub || [];
  const currentServers = selectedType === 'sub' ? subServers : dubServers;
  const currentServer = selectedServer || (currentServers.length > 0 ? currentServers[0] : null);

  const handleTypeChange = (type) => setSelectedType(type);
  const handleServerChange = (server) => setSelectedServer(server);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-4 text-sm">
          <Link
            to={`/anime/${slug}`}
            className="text-cyan-400 transition-colors hover:text-cyan-300"
          >
            ← Back to Anime
          </Link>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">Episode {ep}</span>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          <div ref={containerRef} className="h-full w-full" />
          {streamLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
                <p className="mt-2 text-sm text-zinc-400">Loading stream...</p>
              </div>
            </div>
          )}
          {streamError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="text-center text-red-400">
                <p className="text-sm">Failed to load stream</p>
                <p className="text-xs text-zinc-500">{streamError}</p>
              </div>
            </div>
          )}
          {!streamData && !streamLoading && !streamError && (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
              No video source available
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">Language:</span>
            <div className="flex rounded-lg bg-zinc-800/60 p-1">
              <button
                onClick={() => handleTypeChange('sub')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  selectedType === 'sub'
                    ? 'bg-cyan-500 text-white'
                    : 'text-zinc-400 hover:bg-zinc-700/50 hover:text-white'
                }`}
              >
                Sub
              </button>
              <button
                onClick={() => handleTypeChange('dub')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  selectedType === 'dub'
                    ? 'bg-cyan-500 text-white'
                    : 'text-zinc-400 hover:bg-zinc-700/50 hover:text-white'
                }`}
              >
                Dub
              </button>
            </div>
          </div>

          {currentServers.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-500">Server:</span>
              <select
                value={currentServer?.$id || ''}
                onChange={(e) => {
                  const server = currentServers.find((s) => s.$id === e.target.value);
                  if (server) handleServerChange(server);
                }}
                className="rounded-md border border-zinc-700 bg-zinc-800/60 px-3 py-1 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                {currentServers.map((server) => (
                  <option key={server.$id} value={server.$id}>
                    {server.serverName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {data.current && (
          <div className="mt-4">
            <h2 className="text-lg font-bold text-white">
              Episode {ep}: {data.current.title || `Episode ${ep}`}
            </h2>
            {data.current.title_japanese && (
              <p className="text-sm text-zinc-500">{data.current.title_japanese}</p>
            )}
            {streamData?.video_title && (
              <p className="text-xs text-zinc-600 mt-1">File: {streamData.video_title}</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Watch;