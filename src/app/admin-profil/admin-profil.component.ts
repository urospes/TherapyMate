import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-profil',
  templateUrl: './admin-profil.component.html',
  styleUrls: ['./admin-profil.component.css']
})
export class AdminProfilComponent implements OnInit {
  isLoading: boolean = false;
  constructor( private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute) { }
    ime : string='';
    adresa : string='';
    telefon : string='';
    email : string='';
    opis : string='';

  ngOnInit(): void {
    this.http.get<any>( `http://localhost:3000/savetovaliste`)
    .subscribe((data)=> {
      this.ime=data.ime;
      this.adresa=data.adresa;
      this.telefon=data.telefon;
      this.email=data.email;
      this.opis=data.opis;
        }, (err)=>{
console.log(err)
        });
this.isLoading=false;
  }

  onKlijentiClicked() {
    this.router.navigate(['/admin/klijenti']);
  }

  onTerapijeClicked() {
    this.router.navigate(['/admin/terapije']);
  }

  onTerapeutiClicked() {
    this.router.navigate(['/admin/terapeuti']);
  }
  onIzmeniClick(){
    this.router.navigate(['/admin/savetovaliste']);
  }
  onRecenzijeClicked(){
    this.router.navigate(['/admin/recenzije']);
  }
}
