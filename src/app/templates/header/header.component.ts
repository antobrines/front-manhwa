import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ManhwaService } from '../../services/manhwa.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private manhwaS = inject(ManhwaService);
  private authS = inject(AuthService);
  private router = inject(Router);

  search = this.manhwaS.search;
  canSearch: boolean = true;
  text: string = '';

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.canSearch = ['/'].includes(event.url) ? true : false;
        this.text = '';
      }
    });
  }

  onEnter() {
    if (this.text === '') {
      this.manhwaS.resetManhwas();
      this.manhwaS.getManhwas().subscribe();
    } else {
      this.search.set(this.text);
      this.manhwaS.getManhwas(true).subscribe();
    }
  }

  logout() {
    this.authS.logout();
  }
}
