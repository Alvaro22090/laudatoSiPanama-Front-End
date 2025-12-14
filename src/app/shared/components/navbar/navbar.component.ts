import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
// Importamos tu componente LoginComponent (asegúrate de que sea Standalone o esté en el módulo)
import { LoginComponent } from "../../../pages/auth/login/login.component"; 

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

  constructor() {
    // Lógica visual del Navbar (Scroll)
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 20;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}