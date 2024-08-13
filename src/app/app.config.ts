import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptorsFromDi  } from '@angular/common/http';
import { JwtModule } from "@auth0/angular-jwt";
import { DatePipe } from '@angular/common';
import { TranslateModule, TranslateLoader  } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function tokenGetter() {
  return localStorage.getItem("token");
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(
      JwtModule.forRoot({
          config: {
              tokenGetter: tokenGetter,
              allowedDomains: ["localhost:3000"],
          },
      }),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
      })
    ),
    provideRouter(routes), 
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    DatePipe,
  ]
};
