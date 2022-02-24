import { Route } from '@angular/compiler/src/core';
import { Injectable, ɵConsole } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from './shared/role.model';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private router: Router,
    private authService: AuthService
) { }

canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isAuthorized()) {
        this.router.navigate(['/prijavljivanje']);
        return false;
    }

    const roles = route.data.roles as Role[];
    if (roles.length>0 && (roles.find((r)=> this.authService.hasRole(r))==undefined)) {
        this.router.navigate(['/home']);
        return false;
    }
    return true;
}

canLoad(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isAuthorized()) {
        return false;
    }
    route.data.subscribe(data => {
        const roles = route.data && route.data.roles as Role[];
        if (roles.length>0 && (roles.find((r)=> this.authService.hasRole(r))==undefined)){
            return false;
        }
    
        return true;
    });
    
}
}
