// sockjs-client referencia `global` (API de Node) que no existe en el navegador.
// Sin este polyfill el bundle de producción lanza "ReferenceError: global is not defined".
(window as any).global = window;

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
