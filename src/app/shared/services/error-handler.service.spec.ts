import { TestBed } from '@angular/core/testing';
import { ErrorHandlerService } from './error-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let snackBar: jest.Mocked<MatSnackBar>;

  const mockSnackBar = {
    open: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    });
    service = TestBed.inject(ErrorHandlerService);
    snackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleError', () => {
    it('should handle HttpErrorResponse 404', async () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404,
        statusText: 'Not Found',
      });

      try {
        await firstValueFrom(service.handleError(errorResponse));
      } catch (error) {
        expect(error).toContain('Not Found');
      }

      expect(snackBar.open).toHaveBeenCalledWith(
        expect.stringContaining('Not Found'),
        'Close',
        expect.any(Object),
      );
    });

    it('should handle HttpErrorResponse 403', async () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 403 error',
        status: 403,
        statusText: 'Forbidden',
      });

      try {
        await firstValueFrom(service.handleError(errorResponse));
      } catch (error) {
        expect(error).toContain('Access Denied');
      }

      expect(snackBar.open).toHaveBeenCalledWith(
        expect.stringContaining('Access Denied'),
        'Close',
        expect.any(Object),
      );
    });

    it('should handle HttpErrorResponse 500', async () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 500 error',
        status: 500,
        statusText: 'Internal Server Error',
      });

      try {
        await firstValueFrom(service.handleError(errorResponse));
      } catch (error) {
        expect(error).toContain('Internal Server Error');
      }

      expect(snackBar.open).toHaveBeenCalledWith(
        expect.stringContaining('Internal Server Error'),
        'Close',
        expect.any(Object),
      );
    });

    it('should handle unknown HttpErrorResponse', async () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test unknown error',
        status: 418,
        statusText: 'test unknown error text',
      });

      try {
        await firstValueFrom(service.handleError(errorResponse));
      } catch (error) {
        expect(error).toContain('Unknown Server Error');
      }

      expect(snackBar.open).toHaveBeenCalledWith(
        expect.stringContaining('Unknown Server Error'),
        'Close',
        expect.any(Object),
      );
    });

    it('should handle offline status', async () => {
      // Mock navigator.onLine
      const originalOnLine = navigator.onLine;
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        configurable: true,
      });

      const errorResponse = new HttpErrorResponse({
        error: 'test offline error',
        status: 0,
        statusText: 'Unknown Error',
      });

      try {
        await firstValueFrom(service.handleError(errorResponse));
      } catch (error) {
        expect(error).toBe('No Internet Connection');
      }

      expect(snackBar.open).toHaveBeenCalledWith(
        'No Internet Connection',
        'Close',
        expect.any(Object),
      );

      Object.defineProperty(navigator, 'onLine', {
        value: originalOnLine,
        configurable: true,
      });
    });

    it('should handle regular Error', async () => {
      const error = new Error('Regular error message');

      try {
        await firstValueFrom(service.handleError(error));
      } catch (error) {
        expect(error).toBe('Regular error message');
      }

      expect(snackBar.open).toHaveBeenCalledWith(
        'Regular error message',
        'Close',
        expect.any(Object),
      );
    });

    it('should handle Error without message', async () => {
      const error = new Error();

      try {
        await firstValueFrom(service.handleError(error));
      } catch (error) {
        expect(error).toBe('Error');
      }

      expect(snackBar.open).toHaveBeenCalledWith(
        'Error',
        'Close',
        expect.any(Object),
      );
    });
  });

  describe('snackBar configuration', () => {
    it('should call snackBar with correct configuration', () => {
      const error = new Error('Test error');
      service.handleError(error);

      expect(snackBar.open).toHaveBeenCalledWith(
        expect.any(String),
        'Close',
        {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        },
      );
    });
  });
});
