import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginComponent } from "../../../pages/auth/login/login.component";
import { LoginServiceService, User } from '../../../core/services/login-service.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, LoginComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  isMenuOpen = false;
  isLoggedIn: boolean = false;
  currentUser: User | null = null;
  loginService = inject(LoginServiceService)

  constructor() {
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 20;
      this.isMenuOpen = false;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit(): void {
    this.loginService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !user;
    });
    
  }

}
