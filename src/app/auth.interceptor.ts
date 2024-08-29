import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtHelper = inject(JwtHelperService);

  const idToken = jwtHelper.tokenGetter();
  if (idToken instanceof Promise) {
    return from(idToken).pipe(
      switchMap((token) => {
        const cloned = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + token),
        });
        return next(cloned);
      })
    );
  } else if (idToken) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + idToken),
    });
    return next(cloned);
  }
  return next(req);
};
