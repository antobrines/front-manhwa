import { Component } from '@angular/core';
import { HeaderComponent } from './templates/header/header.component';
import { FooterComponent } from './templates/footer/footer.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
    LoginComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'subarashii';
  public showTemplate: boolean = true;
  private urls = ['/login', '/register'];
  private logoutSubscription!: Subscription;

  constructor(private authS: AuthService, translate: TranslateService) {
    translate.setDefaultLang('fr');
    this.showTemplate = !this.urls.includes(location.pathname);
  }

  ngOnInit() {
    this.logoutSubscription = this.authS.logout$.subscribe(() => {
      this.handleLogout();
    });
  }

  ngOnDestroy() {
    if (this.logoutSubscription) {
      this.logoutSubscription.unsubscribe();
    }
  }

  handleLogout() {
    this.showTemplate = false;
  }
}
