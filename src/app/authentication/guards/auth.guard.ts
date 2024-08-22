import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

// AuthGuard : Détermine si une route peut être activée en fonction de l'état de connexion de l'utilisateur
export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,  // La route actuellement activée
  state: RouterStateSnapshot       // L'état actuel du routeur (incluant l'URL)
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {

  const authService = inject(AuthService); // Injection du service d'authentification
  const router = inject(Router); // Injection du routeur pour gérer la navigation

  // Si l'utilisateur est connecté, on autorise l'accès à la route
  if (authService.isLoggedIn()) {
    return true;
  } else {
    // Sinon, on redirige vers la page de connexion
    return router.parseUrl('/login');
  }
};
