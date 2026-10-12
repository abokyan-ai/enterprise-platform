/**
 * @file main.ts
 * @module apps/studio
 *
 * Client bootstrap entry point for Angular Studio.
 * Bootstraps the standalone AppComponent with appConfig.
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config.js';
import { AppComponent } from './app/app.component.js';

bootstrapApplication(AppComponent, appConfig).catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error('Failed to bootstrap Angular Studio application:', err);
});
