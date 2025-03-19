import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoginServiceService, User } from '../../core/services/login-service.service';
import { RouterLink } from '@angular/router';
import { ForumService, Topicos } from '../../core/services/forum.service';

@Component({
  selector: 'app-forum',
  imports: [CommonModule, RouterLink],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css'
})
export class ForumComponent implements OnInit{
  isLoggedIn: boolean = false;
  currentUser: User | null = null;
  topics: Topicos[] = [];
  categoria: string = "sostenibilidad";

  loginService = inject(LoginServiceService);
  forumService = inject(ForumService);

  ngOnInit(): void {
    this.loginService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !user;
    });
    this.forumService.getTopicos().then((topicos: Topicos[])=>{
      this.topics = topicos;
    });
  }
}