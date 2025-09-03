import {
  ApplicationConfig,
  inject,
  PLATFORM_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { WINDOW, windowProvider } from './providers/window';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AuthService } from './services/auth.service';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}',
        },
      },
    },
  },
});

export function provideAuthInitializer() {
  return provideEnvironmentInitializer(() => {
    const authService = inject(AuthService);
    return authService.initAuth();
  });
}

export function translatorInitializer(translate: TranslateService, platformId: any): () => void {
  return () => {
    const defaultLang = 'lv';
    if (!isPlatformBrowser(platformId)) {
      const browserLang = translate.getBrowserLang();
      const usedLanguage = browserLang?.match(/en|lv/) ? browserLang : defaultLang;

      translate.use(usedLanguage);
    } else {
      const storedLang = localStorage.getItem('sisi-locale');

      translate.setFallbackLang(defaultLang);
      if (storedLang) {
        translate.use(storedLang);
      } else {
        const browserLang = translate.getBrowserLang();
        const usedLanguage = browserLang?.match(/en|lv/) ? browserLang : defaultLang;

        translate.use(usedLanguage);
        localStorage.setItem('sisi-locale', usedLanguage);
      }
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideTranslateService({
      // lang: 'lv',
      // fallbackLang: 'lv',
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
      }),
    }),

    provideRouter(
      routes,
      withViewTransitions(),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
    provideCharts(withDefaultRegisterables()),
    provideAnimationsAsync(),
    provideAuthInitializer(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
    provideClientHydration(withEventReplay()),
    provideAppInitializer(() => {
      const initializerFn = translatorInitializer(inject(TranslateService), inject(PLATFORM_ID));
      return initializerFn();
    }),
    {
      provide: WINDOW,
      useFactory: (document: Document) => windowProvider(document),
      deps: [DOCUMENT],
    },
  ],
};
