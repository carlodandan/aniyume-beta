export const getTitle = (titleObj) => {
  return titleObj?.user_preferred || titleObj?.english || titleObj?.romaji || 'Untitled';
};

export const getCover = (cover) => cover?.large || cover?.medium || '';

export const getBanner = (banner, cover) => banner || getCover(cover) || '';