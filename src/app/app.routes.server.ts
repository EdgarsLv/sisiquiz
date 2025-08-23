import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'test-list',
    renderMode: RenderMode.Client,
  },
  {
    path: 'profile',
    renderMode: RenderMode.Client,
  },
  {
    path: 'iq-test',
    renderMode: RenderMode.Client,
  },
  {
    path: 'love-test',
    renderMode: RenderMode.Client,
  },
  {
    path: 'sociotype-test',
    renderMode: RenderMode.Client,
  },
  {
    path: 'result/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'results',
    renderMode: RenderMode.Client,
  },
  {
    path: 'statistics',
    renderMode: RenderMode.Client,
  },
  {
    path: 'love-statistics',
    renderMode: RenderMode.Client,
  },
  {
    path: 'sociotype-statistics',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
