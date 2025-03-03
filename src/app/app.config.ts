import { ApplicationConfig ,provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideCharts(withDefaultRegisterables()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideToastr({
      timeOut: 3000, 
      positionClass: 'toast-top-right', 
      preventDuplicates: true, 
      maxOpened: 1, 
    }),
    
  ]
};