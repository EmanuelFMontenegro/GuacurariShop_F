import { APP_INITIALIZER, ApplicationConfig, EnvironmentInjector } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { appInitializerFactory } from './core/initializers/app.initializer';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [   
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), 
    provideZoneChangeDetection({ eventCoalescing: true }),  
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [EnvironmentInjector],
      multi: true,
    },  
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      maxOpened: 1,
    }),
    provideCharts(withDefaultRegisterables()),
  ],
};

