import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        recipe: 'recipe.html',
        favorites: 'favorites.html',
        profile: 'profile.html',
      },
    },
  },
});
