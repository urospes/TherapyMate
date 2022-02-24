import { Injectable } from '@angular/core';
import { Role } from '../shared/role.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any=null;

  isAuthorized() {
    if(this.user==null)
   this.user=JSON.parse(localStorage.getItem('korisnik'))
      return !!this.user;
  }

  hasRole(role: Role) {

      let r : string=JSON.parse(localStorage.getItem('korisnik'))['tip'];
     if (r=='terapeut')
     this.user.role=Role.Terapeut;
     else if (r=='klijent')
     this.user.role=Role.Klijent;
     else
     this.user.role=Role.Admin;
    return this.isAuthorized() && this.user.role == role.toString();
  }

  login(role: Role) {
    this.user = { role: role };
  }

  logout() {
    this.user = null;
  }
}
