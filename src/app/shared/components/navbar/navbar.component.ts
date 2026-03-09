import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginComponent } from '../../../pages/auth/login/login.component';
import { AuthService } from '../../../core/services/auth.service';
import { ROLES } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LoginComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isScrolled = false;
  isMenuOpen = false;

  protected readonly authService = inject(AuthService);
  protected readonly ROLES       = ROLES;

  constructor() {
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 20;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
