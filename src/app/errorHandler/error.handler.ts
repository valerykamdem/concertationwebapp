// error.handler.ts
import { Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {ApiResponse} from "../interfaces/api-response";

export class ErrorHandler {
  static handleError<T>(error: HttpErrorResponse): Observable<ApiResponse<T | null>> {

    // Cas spécifique pour l'erreur d'authentification Keycloak
    if (error.error?.code === 'Keycloak.AuthenticationFailed') {
      const keycloakError: ApiResponse<T | null> = {
        value: null,
        isSuccess: false,
        isFailure: true,
        error: {
          code: error.error.code,
          description: error.error.description || 'Échec de l\'authentification',
          type: error.error.type || 0
        }
      };

      console.error('Keycloak authentication error:', keycloakError);
      return of(keycloakError);
    }

    // Si l'erreur est une réponse 400 qui contient déjà une ApiResponse
    if (error.status === 400 && error.error) {
      console.error('API validation error:', error.error);
      return of(error.error as ApiResponse<T>);
    }

    // Pour les autres types d'erreurs (500, timeout, etc.)
    const errorResponse: ApiResponse<T | null> = {
      value: null,
      isSuccess: false,
      isFailure: true,
      error: {
        code: error.status.toString(),
        description: error.message || 'Une erreur est survenue',
        type: error.status
      }
    };

    console.error('API error:', errorResponse);
    return of(errorResponse);
  }
}
