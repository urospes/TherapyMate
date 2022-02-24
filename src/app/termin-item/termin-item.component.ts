import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TerapeutService } from '../services/terapeut.service';
import { Termin } from '../shared/termin.model';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { UpozorenjeDialogComponent } from '../upozorenje-dialog/upozorenje-dialog.component';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-termin-item',
  templateUrl: './termin-item.component.html',
  styleUrls: ['./termin-item.component.css']
})
export class TerminItemComponent implements OnInit {
  faCheck=faCheck;
  faTimes=faTimes;
@Input() termin : {t :Termin, info :{klijent : string, terapija : string}};
@Input() simple : boolean;
terapije : {id : string, tip : string}[]=[];
naslov : string='';
datum: string='';
isHovered : boolean;
showSpinner : boolean=false;
prikaz : boolean=true;
@Input() prethodni : boolean;
@Output() obrisani : Subject<string> =new Subject<string>();
date : Date=new Date();

  constructor(private terapeutService : TerapeutService,
    private router : Router,
    private route : ActivatedRoute,
    private dialog : MatDialog,
    private http : HttpClient) {
  }

  ngOnInit(): void {
    if (this.termin)
    {
    if(this.termin.t.getSlobodan())
      this.naslov="Slobodan termin"
      else if(!this.termin.t.getPotvrdjen())
      this.naslov="Termin za odobravanje"
      else
      this.naslov="Zakazan termin"

    this.setDatumIVreme();
    }
  }

  setDatumIVreme(){
    let date=this.termin.t.getDatum();
    let mesec=date.getMonth()+1;
    this.datum=`${date.getDate()}.${mesec}.${date.getFullYear()}.`;
  }
  onClickIzbrisi(){

    let dialogRef=this.dialog.open(UpozorenjeDialogComponent, 
      { data : 
        { pitanje : `Da li ste sigurni da želite da obrišete termin ?`, 
        potvrdna : 'Obriši'}
      });
dialogRef.afterClosed().subscribe(result => {
  if( result=='true')
  {
   this.terapeutService.deleteTermin(this.termin.t.getId()).subscribe(
    (data) => {
      //console.log(this.termin)
      this.obrisani.next(this.termin.t.getId());
    },
    (err) => {
    this.obrisani.next("Termin je u međuvremenu zakazan. Prvo morate da ga otkažete.")
      
    }
  );
   
  }
})

 

  }
  onClickOtkazi(){
    let dialogRef=this.dialog.open(UpozorenjeDialogComponent, 
      { data : 
        { pitanje : `Da li ste sigurni da želite da otkažete termin ?`, 
        potvrdna : 'Otkaži'}
      });
dialogRef.afterClosed().subscribe(result => {
  if( result=='true')
  {
    this.terapeutService.canceltermin(this.termin.t.getId()).subscribe(
    (data) => {
      this.obrisani.next(this.termin.t.getId());
      this.termin.t.changeSlobodan();
      this.termin.t.changePotvrdjen();
      this.naslov="Slobodan termin";
    },
    (err) => {
    this.obrisani.next(err.error);
      
    }
  );
   
  }
});
  }
  onClickPotvrdi(){

    this.terapeutService.confirmTermin(this.termin.t.getId()).subscribe(
      (data) => { 
        this.termin.t.changePotvrdjen()
        this.naslov="Zakazan termin";
        this.obrisani.next(this.termin.t.getId());
        //this.termin.t.changeSlobodan();
       // this.termin.info={klijent : '', terapija : ''};
      },
      (err) => {
        if (err.error=="Klijent je u medjuvremenu otkazao ovaj termin.")
        {
        this.obrisani.next("Klijent je u međuvremenu otkazao ovaj termin.");
        this.termin.t.changeSlobodan();
        this.naslov="Slobodan termin"
        this.termin.info={klijent : '', terapija : ''};
      }
        else this.obrisani.next(err.error)
        
      }
    );
  }
  onClickOdbij(){
    let dialogRef=this.dialog.open(UpozorenjeDialogComponent, 
      { data : 
        { pitanje : `Da li ste sigurni da želite da odbijete termin ?`, 
        potvrdna : 'Odbij'}
      });
dialogRef.afterClosed().subscribe(result => {
  if( result=='true')
  {
    this.terapeutService.canceltermin(this.termin.t.getId()).subscribe(
    (data) => {
      this.obrisani.next(this.termin.t.getId());
      this.termin.t.changeSlobodan();
      this.naslov="Slobodan termin";
      this.termin.info={klijent : '', terapija : ''};
    },
    (err) => {
      if (err.error=="Ovaj termin je u medjuvremenu otkazan.")
        {
        this.obrisani.next("Klijent je u međuvremenu otkazao ovaj termin.");
        this.termin.t.changeSlobodan();
        this.termin.info={klijent : '', terapija : ''};
      }
        else
      this.obrisani.next(err.error)
      
    }
  );
  }
});
  }
  onClickZavrsen(){
    this.terapeutService.zavrsiTermin(this.termin.t.getId());
    this.obrisani.next(this.termin.t.getId());
  }
  onClickPropusten(){
    this.terapeutService.deletePropusteniTermin(this.termin.t.getId()).subscribe((data)=>{
      //console.log(data);
    })
    this.obrisani.next(this.termin.t.getId());
  }


}
