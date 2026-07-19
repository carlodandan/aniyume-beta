import { useFetch } from '../hooks/useFetch';
import { Hero } from '../components/Hero';
import { TopSection } from '../components/TopSection';
import { ScrollSection } from '../components/ScrollSection';
import { GridSection } from '../components/GridSection';

const Home = () => {
  const { data, loading, error } = useFetch('/api/home');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          <p className="mt-4 text-zinc-500">Loading anime...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">😿</div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-zinc-500 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-cyan-500 px-6 py-2 font-medium text-white hover:bg-cyan-400 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <p className="text-zinc-500">No data available</p>
      </div>
    );
  }

  const featured = data.trending?.[0] || data.latest_aired?.[0] || data.new_on_site?.[0] || null;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Hero anime={featured} />

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 px-4 py-4 md:px-8 lg:grid-cols-3 lg:gap-8 lg:py-6">
        {/* Left column – 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {data.latest_aired?.length > 0 && (
            <ScrollSection
              title="Latest Aired"
              data={data.latest_aired.slice(0, 12)}
              seeAll
            />
          )}

          {data.trending?.length > 0 && (
            <ScrollSection
              title="Trending"
              data={data.trending.slice(0, 12)}
              seeAll
            />
          )}

          {data.new_on_site?.length > 0 && (
            <GridSection
              title="New on Site"
              data={data.new_on_site}
              seeAll
            />
          )}

          {data.upcoming?.length > 0 && (
            <GridSection
              title="Upcoming"
              data={data.upcoming.filter(item => item.can_watch === false).slice(0, 8)}
              seeAll
            />
          )}
        </div>

        {/* Right column – 1/3 (sidebar) */}
        <div className="lg:col-span-1">
          <TopSection compact />
        </div>
      </div>

      <footer className="mt-8 border-t border-zinc-800/50 px-4 py-6 text-center text-xs text-zinc-600 md:px-8 lg:px-12">
        <p>© 2026 aniyume — all rights reserved</p>
        <p className="mt-1 text-zinc-700">Data provided by AniList</p>
      </footer>
    </div>
  );
};

export default Home;