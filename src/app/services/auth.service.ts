import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseService } from './response.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private logoutSubject = new Subject<void>();
  logout$ = this.logoutSubject.asObservable();

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private responseS: ResponseService,
    private router: Router
  ) {}

  async login(data: any): Promise<boolean> {
    try {
      const request = this.http.post(
        environment.backUrl + 'users/login',
        data
      );
      const dataRequest: any = await firstValueFrom(request);
      localStorage.setItem('token', dataRequest.body);
      this.responseS.SuccessF(dataRequest);
      return true;
    } catch (error: any) {
      this.responseS.ErrorF(error.error);
      return false;
    }
  }

  async register(data: any): Promise<boolean> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    const request = this.http.post(environment.backUrl + 'users/register', data);
    try {
      const res = await firstValueFrom(request);
      this.responseS.SuccessF(res);
      return true;
    } catch (error: any) {
      this.responseS.ErrorF(error.error);
      return false;
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    const token = await this.jwtHelper.tokenGetter();
    if (token) return !this.jwtHelper.isTokenExpired(token);
    return false;
  }

  public logout() {
    localStorage.removeItem('token');
    this.logoutSubject.next();
    this.router.navigate(['login']);
  }

  public userConnected(): string {
    const token: any = localStorage.getItem('token');
    const decodedToken: any = jwtDecode(token, { header: true });
    return decodedToken;
  }
}
