import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'profile',
    renderMode: RenderMode.Client,
  },
  {
    path: 'test',
    renderMode: RenderMode.Client,
  },
  {
    path: 'iq-test',
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
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
