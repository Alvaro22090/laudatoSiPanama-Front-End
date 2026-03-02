import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Home'
  },
  {
    path: 'description',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'Description'
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contacto'
  },
  {
    path: 'foro',
    loadComponent: () => import('./pages/forum/forum.component').then(m => m.ForumComponent),
    title: 'Foro'
  },
  {
    path: 'foro/:id',
    loadComponent: () => import('./pages/forum/topic/topic.component').then(m => m.TopicComponent),
    title: 'Publicación'
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent),
    title: 'Registro'
  },
  {
    path: 'usuario',
    loadComponent: () => import('./pages/auth/user/user.component').then(m => m.UserComponent),
    canActivate: [authGuard],
    title: 'Mi Perfil'
  },
  {
    path: 'registro-topico',
    loadComponent: () => import('./pages/forum/create-topic/create-topic.component').then(m => m.CreateTopicComponent),
    canActivate: [authGuard],
    title: 'Crear Tópico'
  },
  {
    path: 'politica-privacidad',
    loadComponent: () => import('./pages/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
    title: 'Política de Privacidad'
  },
  {
    path: 'terminos-condiciones',
    loadComponent: () => import('./pages/terms-and-conditions/terms-and-conditions.component').then(m => m.TermsAndConditionsComponent),
    title: 'Términos y Condiciones'
  }
];
