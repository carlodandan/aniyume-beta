// src/pages/Home.jsx
import { useFetch } from '../hooks/useFetch';
import { Hero } from '../components/Hero';
import { TopSection } from '../components/TopSection';
import { ScrollSection } from '../components/ScrollSection';
import { GridSection } from '../components/GridSection';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const { data, loading, error } = useFetch('/api/home');
  // Fetch top daily for hero slideshow
  const { data: topData, loading: topLoading, error: topError } = useFetch('/api/top?period=today');

  // ── Loading state ──
  if (loading || topLoading) {
    return (
      <>
        <Header />
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-[#0a0a0f]">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            <p className="mt-4 text-zinc-500">Loading anime...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ── Error state ──
  if (error || topError || !data) {
    return (
      <>
        <Header />
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-[#0a0a0f]">
          <div className="text-center max-w-md px-4">
            <div className="text-6xl mb-4">😿</div>
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-zinc-500 text-sm">{error || topError || 'No data available'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-cyan-500 px-6 py-2 font-medium text-white hover:bg-cyan-400 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ── Build hero slides from top daily data ──
  const heroSlides = topData?.data?.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 antialiased selection:bg-cyan-500/30">
      <Header />

      {/* Hero slideshow using Top 10 Daily */}
      <Hero anime={heroSlides} />

      {/* Main layout container */}
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main content sections */}
          <div className="space-y-10 lg:col-span-3">
            {data.latest_aired?.length > 0 && (
              <ScrollSection
                title="Latest Aired"
                data={data.latest_aired.slice(0, 12)}
                seeAll
              />
            )}

            {data.trending?.length > 0 && (
              <ScrollSection
                title="Trending Now"
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
                title="Upcoming Releases"
                data={data.upcoming.filter(item => item.can_watch === false).slice(0, 8)}
                seeAll
              />
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-1 border-t border-zinc-800/60 pt-8 lg:border-t-0 lg:pt-0 lg:pl-4">
            <div className="sticky top-6">
              <TopSection compact />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;