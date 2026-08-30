import { HttpErrorResponse } from '@angular/common/http';

/**
 * Extrait un message d'erreur lisible depuis une reponse HTTP d'erreur de l'API NestJS.
 * NestJS renvoie soit { message: string }, soit { message: string[] } (erreurs class-validator).
 */
export function messageErreurApi(erreur: HttpErrorResponse): string {
  const corps = erreur.error;

  if (corps && typeof corps === 'object' && 'message' in corps) {
    const message = (corps as { message: unknown }).message;
    if (Array.isArray(message)) {
      return message.join(', ');
    }
    if (typeof message === 'string') {
      return message;
    }
  }

  if (erreur.status === 0) {
    return 'Impossible de contacter le serveur. Verifiez votre connexion.';
  }

  return 'Une erreur est survenue. Veuillez reessayer.';
}
