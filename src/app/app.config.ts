import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';

// TODO - move to shared module
export const picsumPhotosLoader = (config: ImageLoaderConfig): string => {
  console.log('config', config);
  const baseUrl = config.src.substring(0, config.src.lastIndexOf('/'));
  console.log('baseUrl', baseUrl);
  const finalUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
  console.log('finalUrl', finalUrl);

  // Zwracamy URL z nową szerokością i wysokością (zakładamy kwadratowe obrazy)
  return `${finalUrl}/${config.width}/${config.width}`;
};

export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection(), provideRouter(routes), provideHttpClient(), {
    provide: IMAGE_LOADER,
    useValue: picsumPhotosLoader,
  },]
};
