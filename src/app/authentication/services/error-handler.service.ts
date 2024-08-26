import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {

  constructor() {}

  // Méthode pour gérer les erreurs HTTP
  handleError(error: HttpErrorResponse) {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
        // Erreur côté client ou réseau
        errorMessage = `Erreur côté client : ${error.error.message}`;
      } else {
        // Erreur côté serveur
        if (error.status === 404) {
          // Gestion spécifique du code de statut 404
          errorMessage = `Erreur : L'utilisateur avec cet email n'existe pas.`;
        } else if (error.status === 409) {
          // Gestion spécifique du code de statut 409
          errorMessage = `Erreur : Cet utilisateur existe déjà.`;
        } else if (error.error && typeof error.error === 'string') {
          // Si le backend renvoie une erreur sous forme de chaîne de caractères
          errorMessage = `Erreur côté serveur : ${error.error}`;
        } else if (error.error && error.error.message) {
          // Si le backend renvoie une erreur structurée avec un message
          errorMessage = `Erreur côté serveur : ${error.error.message}`;
        } else {
          // Autres types d'erreurs
          errorMessage = `Erreur côté serveur : Code de statut ${error.status}, Message : ${error.message}`;
        }
    }

    // Retourner une observable d'erreur
    return throwError(() => new Error(errorMessage));
  }

  // Méthode pour obtenir le message d'erreur
  getErrorMessage(error: any): string {
    if (error instanceof ErrorEvent) {
      return `Erreur : ${error.message}`;
    } else if (error && error.message) {
      return error.message;
    } else {
      return 'Une erreur inconnue s\'est produite.';
    }
  }
}
