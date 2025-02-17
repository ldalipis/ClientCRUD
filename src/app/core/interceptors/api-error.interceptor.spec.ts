import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { apiErrorInterceptor } from './api-error.interceptor';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';

describe('apiErrorInterceptor', () => {
  let errorHandlerService: jest.Mocked<ErrorHandlerService>;
  let httpHandler: jest.Mocked<HttpHandler>;

  beforeEach(() => {
    errorHandlerService = {
      handleError: jest.fn(),
    } as unknown as jest.Mocked<ErrorHandlerService>;

    httpHandler = {
      handle: jest.fn(),
    } as unknown as jest.Mocked<HttpHandler>;

    TestBed.configureTestingModule({
      providers: [
        { provide: ErrorHandlerService, useValue: errorHandlerService },
      ],
    });
  });

  it('should pass through successful requests', (done) => {
    const request = new HttpRequest('GET', '/api/test');
    const response = new HttpResponse({ status: 200, body: { data: 'test' } });

    httpHandler.handle.mockReturnValue(of(response));

    TestBed.runInInjectionContext(() => {
      const interceptor = apiErrorInterceptor(request, httpHandler.handle);

      interceptor.subscribe({
        next: (event: HttpEvent<unknown>) => {
          expect(event).toBe(response);
        },
        complete: () => {
          expect(errorHandlerService.handleError).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });

  it('should handle API exceptions', (done) => {
    const request = new HttpRequest('GET', '/api/test');
    const apiError = new HttpErrorResponse({
      error: { type: 'ApiException', message: 'API Error' },
      status: 400,
    });

    httpHandler.handle.mockReturnValue(throwError(() => apiError));

    TestBed.runInInjectionContext(() => {
      const interceptor = apiErrorInterceptor(request, httpHandler.handle);

      interceptor.subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error).toBe(apiError);
          expect(errorHandlerService.handleError).toHaveBeenCalledWith(apiError);
          done();
        },
      });
    });
  });

  it('should handle general HTTP errors', (done) => {
    const request = new HttpRequest('GET', '/api/test');
    const httpError = new HttpErrorResponse({
      error: 'Generic Error',
      status: 500,
    });

    httpHandler.handle.mockReturnValue(throwError(() => httpError));

    TestBed.runInInjectionContext(() => {
      const interceptor = apiErrorInterceptor(request, httpHandler.handle);

      interceptor.subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error).toBe(httpError);
          expect(errorHandlerService.handleError).toHaveBeenCalledWith(httpError);
          done();
        },
      });
    });
  });
});
