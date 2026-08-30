import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../core/auth/auth.service';
import { messageErreurApi } from '../../core/http-error.util';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, Navbar],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly enCours = signal(false);
  protected readonly erreur = signal<string | null>(null);

  protected readonly formulaire = this.fb.nonNullable.group({
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]],
  });

  soumettre(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }
    this.enCours.set(true);
    this.erreur.set(null);
    this.authService.inscription(this.formulaire.getRawValue()).subscribe({
      next: () => {
        this.router.navigateByUrl('/tableau-de-bord');
      },
      error: (err: HttpErrorResponse) => {
        this.enCours.set(false);
        this.erreur.set(
          err.status === 409 ? 'Un compte existe deja avec cet email' : messageErreurApi(err),
        );
      },
    });
  }
}
