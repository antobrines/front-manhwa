import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home.component';
import { ManhwaComponent } from './manhwa/manhwa.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {path: '', component: HomeComponent, canActivate: [authGuard]},
    {path: 'login', component: LoginComponent, canActivate: [authGuard]},
    {path: 'manhwa/:id', component: ManhwaComponent}
];
