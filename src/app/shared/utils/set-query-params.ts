import { assertInjector } from 'ngxtension/assert-injector';
import { inject, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * TODO - injectQueryParams set query idea
 * @param injector
 */
export const injectSetQuery = (injector?: Injector) => {
  return assertInjector(injectSetQuery, injector, () => {
    const route = inject(ActivatedRoute);
    const router = inject(Router);


    function setQueryParam(key: string, value: string | null): void {
      const queryParams = {...route.snapshot.queryParams};

      if (value === null || value === undefined || value === '') {
        delete queryParams[key];
      } else {
        queryParams[key] = value;
      }

      router.navigate([], {
        relativeTo: route,
        queryParams: queryParams,
      });
    }

    return { setQueryParam };

  })
}
