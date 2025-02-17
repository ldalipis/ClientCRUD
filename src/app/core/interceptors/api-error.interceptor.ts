import { HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpInterceptorFn, HttpEvent } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';

export const apiErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const errorHandler = inject(ErrorHandlerService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error && error.error.type === 'ApiException') {
        console.error('API Exception:', error.error);
      } else {
        console.error('HTTP Error:', error);
      }
      errorHandler.handleError(error);
      return throwError(() => error);
    }),
  );
};
