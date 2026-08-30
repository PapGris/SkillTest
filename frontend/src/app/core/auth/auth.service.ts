import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../config';
import type {
  ConnexionPayload,
  InscriptionPayload,
  ReponseAuth,
  RoleUtilisateur,
  Utilisateur,
} from './models';

const CLE_TOKEN = 'skilltest_token';
const CLE_USER = 'skilltest_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  readonly token = signal<string | null>(this.lireStockage(CLE_TOKEN));
  readonly currentUser = signal<Utilisateur | null>(this.lireUserStockage());
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor(private readonly httpClient: HttpClient) {}

  inscription(payload: InscriptionPayload): Observable<ReponseAuth> {
    return this.httpClient
      .post<ReponseAuth>(`${API_URL}/auth/register`, payload)
      .pipe(tap((reponse) => this.enregistrerSession(reponse)));
  }

  connexion(payload: ConnexionPayload): Observable<ReponseAuth> {
    return this.httpClient
      .post<ReponseAuth>(`${API_URL}/auth/login`, payload)
      .pipe(tap((reponse) => this.enregistrerSession(reponse)));
  }

  deconnexion(): void {
    this.token.set(null);
    this.currentUser.set(null);
    try {
      localStorage.removeItem(CLE_TOKEN);
      localStorage.removeItem(CLE_USER);
    } catch {
      // localStorage indisponible (navigation privee stricte, etc.) : pas bloquant
    }
  }

  hasRole(...roles: RoleUtilisateur[]): boolean {
    const utilisateur = this.currentUser();
    return !!utilisateur && roles.includes(utilisateur.role);
  }

  private enregistrerSession(reponse: ReponseAuth): void {
    this.token.set(reponse.accessToken);
    this.currentUser.set(reponse.user);
    try {
      localStorage.setItem(CLE_TOKEN, reponse.accessToken);
      localStorage.setItem(CLE_USER, JSON.stringify(reponse.user));
    } catch {
      // pas bloquant si le stockage n'est pas disponible
    }
  }

  private lireStockage(cle: string): string | null {
    try {
      return localStorage.getItem(cle);
    } catch {
      return null;
    }
  }

  private lireUserStockage(): Utilisateur | null {
    try {
      const brut = localStorage.getItem(CLE_USER);
      return brut ? (JSON.parse(brut) as Utilisateur) : null;
    } catch {
      return null;
    }
  }
}
