export const API_PATHS = {
  searchOnYoutube: (query) =>
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${import.meta.env.VITE_REACT_APP_YOUTUBE_API_KEY}`,
  searchOnGoogle: (query) => `https://www.google.com/search?q=${query}`,
};
