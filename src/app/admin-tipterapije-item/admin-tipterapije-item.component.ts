import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TipTerapijaService } from '../services/tipTerapija.service';
import { Terapija } from '../shared/terapija.model';
import { TipTerapija } from '../shared/tipTerapija.model'
import { UpozorenjeDialogComponent } from '../upozorenje-dialog/upozorenje-dialog.component';

@Component({
  selector: 'app-admin-tipterapije-item',
  templateUrl: './admin-tipterapije-item.component.html',
  styleUrls: ['./admin-tipterapije-item.component.css']
})
export class AdminTipterapijeItemComponent implements OnInit {
@Input() tip :TipTerapija;
@Output() obrisani : Subject<string>=new Subject<string>();
  constructor(private dialog : MatDialog,
    private http : HttpClient,
    private router : Router
  ) {}

ngOnInit(){
}


onClickIzbrisi(){
  let dialogRef = this.dialog.open(UpozorenjeDialogComponent, {
    data: {
      pitanje: `Da li ste sigurni da želite da obrišete terapiju ${this.tip.naziv} ?`,
      potvrdna: 'Obriši',
    },
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result == 'true') {
       this.http.delete(`http://localhost:3000/tipoviTerapija/${this.tip.id}`, {responseType: "text"}).subscribe(
        (data) => {
          if(data==="Tip terapije je uspesno obrisan")
          this.obrisani.next(this.tip.id);
          else this.obrisani.next(data);
        },
        (err) => {
         console.log(err)
        }
      );
    }
  });
}
onClickIzmeni(){
  this.router.navigate([ 'admin',this.tip.id, 'terapije']);

}
}