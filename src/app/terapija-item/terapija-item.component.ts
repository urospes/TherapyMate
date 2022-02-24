import { Component, OnInit, Input, Output } from '@angular/core';
import { Terapija } from '../shared/terapija.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TipTerapijaService } from '../services/tipTerapija.service';
import { TerapeutService } from '../services/terapeut.service';
import { MatDialog } from '@angular/material/dialog';
import { UpozorenjeDialogComponent } from '../upozorenje-dialog/upozorenje-dialog.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-terapija-item',
  templateUrl: './terapija-item.component.html',
  styleUrls: ['./terapija-item.component.css']
})
export class TerapijaItemComponent implements OnInit {
  @Input () terapija : Terapija;
  @Output() erorMess : Subject<string> = new Subject<string>();
  @Output() obrisana : Subject<{id :string, mess :string}>=new Subject<{id :string, mess :string}>();
  isHovered: boolean=false;
  nesto : any;
  constructor(  private route: ActivatedRoute,
                private router: Router, private terapijaService : TipTerapijaService,
                private terapeutService : TerapeutService,
                private dialog : MatDialog) { 

    }

  ngOnInit(): void {
   // console.log(this.terapija)
  }
  onClickAzuriraj(){
    this.router.navigate([ this.terapija.id, 'edit'], {relativeTo: this.route});
  }
  onClickIzbrisi(){
    let dialogRef=this.dialog.open(UpozorenjeDialogComponent, 
          { data : 
            { pitanje : `Da li ste sigurni da želite da obrišete terapiju ${this.terapija.tip}?`, 
            potvrdna : 'Obriši'}
          });
    dialogRef.afterClosed().subscribe(result => {
      if( result=='true')
      {
      this.terapijaService.deleteTerapija(this.terapija.id).subscribe((data)=>{
       this.obrisana.next({id :this.terapija.id, mess :data} );
      //console.log(data)
      }, (err)=> {
        this.obrisana.next({id :this.terapija.id, mess :err.error} );
        }
      );
      }
    });
    //})
    
  }
}
