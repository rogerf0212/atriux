import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


if(!navigator.geolocation) {
  alert('Navegador no soporta la Geolocation');
  throw new Error('navegador no soporta la geolocation')
}


platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));
