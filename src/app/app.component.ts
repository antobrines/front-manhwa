import { Component, inject } from '@angular/core';
import { HeaderComponent } from './templates/header/header.component';
import { FooterComponent } from './templates/footer/footer.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private authS = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  title = 'Manhwa';
  public showTemplate: boolean = false;
  private urls = ['/login', '/register'];
  private logoutSubscription: Subscription = new Subscription();
  private routerSubscriptions: Subscription = new Subscription();

  ngOnInit() {
    this.translate.setDefaultLang('fr');

    this.logoutSubscription.add(
      this.authS.logout$.subscribe(() => {
        this.handleLogout();
      })
    );

    this.routerSubscriptions.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.showTemplate = this.urls.includes(event.url) ? false : true;
        }
      })
    );
  }

  ngOnDestroy() {
    this.logoutSubscription.unsubscribe();
    this.routerSubscriptions.unsubscribe();
  }

  handleLogout() {
    this.showTemplate = false;
  }
}
