const Footer = () => {
  return (
    <footer className="mx-auto max-w-[1400px] mt-16 border-t border-zinc-900 px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-zinc-600">
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} aniyume — all rights reserved</p>
        <p className="text-zinc-700">
          Data provided by{' '}
          <a
            href="https://anilist.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-500 hover:text-cyan-400 transition-colors"
          >
            AniList
          </a>
        </p>
      </div>
      <p className="mt-2 text-zinc-700">Made with ❤️ for anime fans</p>
    </footer>
  );
};

export default Footer;