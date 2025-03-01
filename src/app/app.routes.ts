import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ForumComponent } from './pages/forum/forum.component';
import { RegisterComponent } from './pages/auth/register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home'
    },
    {
        path: 'description',
        component: AboutComponent,
        title: 'Description'
    },
    {
        path: 'contacto',
        component: ContactComponent,
        title: 'Contact'
    },
    {
        path: 'foro',
        component: ForumComponent,
        title: 'Forum'
    },
    {
        path: 'registro',
        component: RegisterComponent,
        title: 'Register'
    },
];
