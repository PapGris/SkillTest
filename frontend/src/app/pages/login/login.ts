import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../core/auth/auth.service';
import { messageErreurApi } from '../../core/http-error.util';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Navbar],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly enCours = signal(false);
  protected readonly erreur = signal<string | null>(null);

  protected readonly formulaire = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required]],
  });

  soumettre(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }

    this.enCours.set(true);
    this.erreur.set(null);

    this.authService.connexion(this.formulaire.getRawValue()).subscribe({
      next: () => {
        this.router.navigateByUrl('/tableau-de-bord');
      },
      error: (err: HttpErrorResponse) => {
        this.enCours.set(false);
        this.erreur.set(err.status === 401 ? 'Email ou mot de passe incorrect' : messageErreurApi(err));
      },
    });
  }
}
