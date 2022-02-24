import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Recenzija } from '../shared/recenzija.model';
import { UpozorenjeDialogComponent } from '../upozorenje-dialog/upozorenje-dialog.component';

@Component({
  selector: 'app-admin-recenzija-item',
  templateUrl: './admin-recenzija-item.component.html',
  styleUrls: ['./admin-recenzija-item.component.css'],
})
export class AdminRecenzijaItemComponent implements OnInit {
  @Input() terapeut;
  slika : boolean = Math.random()*10>5;
  recenzije: Recenzija[] = [];
  email : string[]=[];
  @Output() obrisana : Subject<string>=new Subject<string>();
  constructor(private http: HttpClient,
    private dialog : MatDialog) {}

  ngOnInit(): void {
    if (this.terapeut) {
     // console.log(this.terapeut)
      this.http.get<any>(`http://localhost:3000/recenzije/${this.terapeut.getId()}`).subscribe(
        (data) => {
         // console.log(data);
          data.forEach((responseEl) => {
            this.recenzije.push(
              new Recenzija(
                responseEl._id,
                responseEl.ocena,
                responseEl.komentar,
                responseEl.terapeut,
                responseEl.klijent
              )
            );
            this.email.push(responseEl.klijent.email)
          });

        },
        (err) => {
          console.log(err);
        }
      );
      //Da li fetch imena klijenata?
    }
  }
  onClickIzbrisi(id : string){
    let dialogRef=this.dialog.open(UpozorenjeDialogComponent, 
      { data : 
        { pitanje : `Da li ste sigurni da želite da obrišete ovu recenziju?`, 
        potvrdna : 'Obriši'}
      });
dialogRef.afterClosed().subscribe(result => {
  if( result=='true')
  this.http.delete(`http://localhost:3000/recenzije/${id}`, {responseType:'text'}).subscribe((data)=>{
    //console.log(data)
    this.obrisana.next("Uspešno obrisana recenzija");
    let i=this.recenzije.findIndex(r=>r.getId()==id);
    //console.log(i)
    this.terapeut.ocena*=this.recenzije.length;
    this.terapeut.ocena-=this.recenzije[i].getOcena();
    this.recenzije.splice(i,1);
    //console.log(this.terapeut)
    if(this.recenzije.length>0)
    this.terapeut.ocena/=this.recenzije.length;
    this.terapeut.ocena;
    //console.log(this.terapeut.getOcena())
    
  }, (err)=> {
   console.log(err)
   this.obrisana.next(err);
    }
  )

})
//window.location.reload();
}
}


