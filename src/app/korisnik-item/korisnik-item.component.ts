import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { KorisnikLogovanjeService } from '../services/korisnikLogovanje.service';
import { Klijent } from '../shared/klijent.model';
import { LoggedKorisnik } from '../shared/logged-korisnik.model';
import { Terapeut } from '../shared/terapeut.model';
import { UpozorenjeDialogComponent } from '../upozorenje-dialog/upozorenje-dialog.component';

@Component({
  selector: 'app-korisnik-item',
  templateUrl: './korisnik-item.component.html',
  styleUrls: ['./korisnik-item.component.css']
})
export class KorisnikItemComponent implements OnInit {
ime : string='';
prezime : string='';
email : string='';
telefon : string='';
id : string='';
specijalizacija : string='';
opis : string='';
slika : string ='';
@Input() odobren : boolean;
@Output() korisnikDeleted : Subject<string>=new Subject<string>();
@Output() korisnikOdobren : Subject<string>=new Subject<string>();
@Input() terapeut : Terapeut=null;
@Input() klijent : Klijent=null;
  constructor(private logged : KorisnikLogovanjeService,
    private dialog : MatDialog,
    private http : HttpClient) { }

  ngOnInit(): void {
    if (this.klijent!=null){
      this.ime=this.klijent.getIme();
     this.prezime=this.klijent.getPrezime();
      this.email=this.klijent.getEmail();
      this.telefon=this.klijent.getTelefon();
      this.id=this.klijent.getID();
      //console.log(this.klijent.getSlika())
    }
    else {
      this.ime=this.terapeut.getIme();
      this.prezime=this.terapeut.getPrezime();
      this.email=this.terapeut.getEmail();
      this.telefon=this.terapeut.getTelefon();
      this.id=this.terapeut.getId();
      this.opis=this.terapeut.getOpis();
      this.specijalizacija=this.terapeut.getSpecijalizacija();
    }

  }
  onClickOdobri(){
   this.http.patch( `http://localhost:3000/korisnici/odobravanjeNaloga`, {
     id : this.id
   }, {responseType:'text'}).subscribe((data)=> {
    this.korisnikOdobren.next(this.id);
    this.odobren=true;
    if(this.klijent) this.klijent
  }, (err)=> {this.korisnikOdobren.next(err.error)}
  )
  }
  onClickObrisi(){
    let dialogRef=this.dialog.open(UpozorenjeDialogComponent, 
      { data : 
        { pitanje : `Da li ste sigurni da želite da obrišete korisnika ${this.ime} ${this.prezime}?`, 
        potvrdna : 'Obriši'}
      });
dialogRef.afterClosed().subscribe(result => {
  if( result=='true')
  {
    if (this.specijalizacija==''&& this.opis==''){
      this.http.delete(`http://localhost:3000/klijenti/${this.klijent.getID()}`, {responseType : 'text'}
      ).subscribe((data)=> {
        if (data)
        this.korisnikDeleted.next(this.id);
      }, (err)=> {this.korisnikDeleted.next(err.error)}
      )
    }
    else {
      this.http.delete(`http://localhost:3000/terapeuti/${this.terapeut.getId()}`, {responseType : 'text'}
      ).subscribe((data)=> {
        //console.log(data)
        if (data)
        this.korisnikDeleted.next(this.id);
        }, (err)=> {this.korisnikDeleted.next(err.error)}
      )
    }
  }
  // this.terapijaService.deleteTerapija(this.terapija.id).subscribe((data)=>{
  //   console.log(data)
  // }, (err)=> {
  //   window.location.reload();
  //   }
  // )
  // })
//})
});
}
}
