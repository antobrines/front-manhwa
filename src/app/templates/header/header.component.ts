import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  search: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authS: AuthService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.search = params['search'];
    });
  }

  async ngOnInit() {}

  onEnter() {
    this.router
      .navigate(['/'], { queryParams: { search: this.search } })
      .then(() => {
        window.location.reload();
      });
  }

  logout() {
    this.authS.logout();
  }
}
