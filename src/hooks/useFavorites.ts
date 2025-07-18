
// Updated to use local storage instead of Supabase backend
import { useFavoritesLocal } from './useFavoritesLocal';

export const useFavorites = () => {
  return useFavoritesLocal();
};
