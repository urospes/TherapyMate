import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Terapija } from '../shared/terapija.model';
import { TipTerapija } from '../shared/tipTerapija.model';

@Component({
  selector: 'app-admin-tipterapije-list',
  templateUrl: './admin-tipterapije-list.component.html',
  styleUrls: ['./admin-tipterapije-list.component.css']
})
export class AdminTipterapijeListComponent implements OnInit {
  isLoading: boolean = false;
  tipListLoading: boolean = false;
  tipovi: TipTerapija[]=[];
  success : string='';
  error : string='';

  constructor(
    private http: HttpClient,
    private router : Router,
    private route : ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.UcitajTipoveTerapija();
    
  }


  UcitajTipoveTerapija() {
    this.isLoading = true;
    this.http
      .get<{ _id: string; naziv: string; opis: string, terapije : Terapija[] }[]>(
        'http://localhost:3000/tipoviTerapija'
      )
      .subscribe(
        (responseData) => {
           responseData.forEach((responseEl) => {
            this.tipovi.push( new TipTerapija(
              responseEl._id,
              responseEl.opis,
              responseEl.naziv,
              responseEl.terapije
            ));
          });
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
        }
      );
  }
  obrisanaTerapija(id : string){
    if(id.length==24)
    {
    let i=this.tipovi.findIndex(t=>t.id==id);
    this.tipovi.splice(i,1);
    this.success="Uspešno ste izbrisali tip terapije"
    setTimeout(() => {
      this.success = '';
    }, 2000);
  }
  else {
    this.error=id;
    setTimeout(() => {
      this.error = '';
    }, 2000);
  }
  }
  onClickDodaj(){
  this.router.navigate([ 'new'],  {relativeTo: this.route});
  }
}
