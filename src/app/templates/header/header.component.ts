import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  search = this.manhwaS.search;
  text: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authS: AuthService
  ) {}

  async ngOnInit() {}

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
