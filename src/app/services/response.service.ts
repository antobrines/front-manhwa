import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {
  constructor(private router: Router) {}

  ErrorF: any = (error: HttpErrorResponse) => {
    if (error.status == 0) {
      error.error.message = "Le serveur distant n'est pas joignable";
    }
    if (error.status == 404) {
      this.router.navigateByUrl('');
    }

    return false;
  };

  SuccessF: any = (res: any) => {
    
  };
}
