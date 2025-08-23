import { Routes } from '@angular/router';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { Home } from './pages/home/home';
import { authGuard } from './guards/auth.guard';
import { profileGuard } from './guards/profile.guard';
import { resultResolver } from './pages/result/result.resolver';
import { imageResolver } from './pages/result/image.resolver';
import { resultsResolver } from './pages/results/results.resolver';
import { statisticsResolver } from './pages/statistics/statistics.resolver';
import { guestGuard } from './guards/guest.guard';
import { mbtiResolver } from './pages/results/mbti.resolver';
import { loveResolver } from './pages/results/love.resolver';
import { loveStatisticsResolver } from './pages/love-statistics/love-statistics.resolver';
import { sociotypeStatisticsResolver } from './pages/sociotype-statistics/sociotype-statistics.resolver';
import { iqStatisticsResolver } from './pages/iq-statistics/iq-statistics.resolver';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: '', component: Home },
      {
        path: 'test-list',
        loadComponent: () => import('./pages/dashboard/dashboard').then((c) => c.Dashboard),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then((c) => c.Profile),
        canActivate: [authGuard],
      },
      {
        path: 'iq-test',
        loadComponent: () => import('./pages/iq-test/iq-test').then((c) => c.IqTest),
        canActivate: [authGuard, profileGuard],
      },
      {
        path: 'love-test',
        loadComponent: () => import('./pages/love-test/love-test').then((c) => c.LoveTest),
        canActivate: [authGuard, profileGuard],
      },
      {
        path: 'sociotype-test',
        loadComponent: () =>
          import('./pages/sociotype-test/sociotype-test').then((c) => c.SociotypeTest),
        canActivate: [authGuard, profileGuard],
      },
      {
        path: 'result/:id',
        loadComponent: () => import('./pages/result/result').then((c) => c.Result),
        resolve: { result: resultResolver, image: imageResolver },
      },
      {
        path: 'results',
        loadComponent: () => import('./pages/results/results').then((c) => c.Results),
        resolve: { data: resultsResolver, mbti: mbtiResolver, love: loveResolver },
        canActivate: [authGuard, profileGuard],
      },
      {
        path: 'statistics',
        loadComponent: () => import('./pages/statistics/statistics').then((c) => c.Statistics),
        canActivate: [authGuard, profileGuard],
        children: [
          {
            path: 'iq',
            loadComponent: () =>
              import('./pages/iq-statistics/iq-statistics').then((c) => c.IqStatistics),
            resolve: { data: iqStatisticsResolver },
          },
          {
            path: 'love',
            loadComponent: () =>
              import('./pages/love-statistics/love-statistics').then((c) => c.LoveStatistics),
            resolve: { data: loveStatisticsResolver },
          },
          {
            path: 'sociotype',
            loadComponent: () =>
              import('./pages/sociotype-statistics/sociotype-statistics').then(
                (c) => c.SociotypeStatistics
              ),
            resolve: { data: sociotypeStatisticsResolver },
          },
        ],
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then((c) => c.Login),
        canActivate: [guestGuard],
      },
      { path: '**', redirectTo: '/', pathMatch: 'full' },
    ],
  },
];
