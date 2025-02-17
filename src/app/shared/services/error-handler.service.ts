import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private snackBar: MatSnackBar) {}

  // Generic error handler method
  handleError(error: HttpErrorResponse | Error): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        errorMessage = 'No Internet Connection';
      } else {
        // Handle HTTP errors
        errorMessage = this.getServerErrorMessage(error);
      }
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)
      errorMessage = error.message || error.toString();
    }

    // Show error using MatSnackBar
    this.showError(errorMessage);

    // Return an observable with a user-facing error message
    return throwError(() => errorMessage);
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    console.log(error)
    switch (error.status) {
      case 404: {
        return `Not Found: ${error.message}`;
      }
      case 403: {
        return `Access Denied: ${error.message}`;
      }
      case 500: {
        return `Internal Server Error: ${error.message}`;
      }
      default: {
        return `Unknown Server Error: ${error.message}`;
      }
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }
}
