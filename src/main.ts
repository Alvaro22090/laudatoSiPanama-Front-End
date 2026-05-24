// sockjs-client referencia `global` (API de Node) que no existe en el navegador.
// Sin este polyfill el bundle de producción lanza "ReferenceError: global is not defined".
(window as any).global = window;

import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Registra los datos del locale 'es' para los pipes (date, decimal, currency).
// Sin esto, usar `| date:... :'es'` lanza NG02100.
registerLocaleData(localeEs, 'es');

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
