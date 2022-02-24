import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TerapeutService } from '../services/terapeut.service';
import { Klijent } from '../shared/klijent.model';
import { Terapija } from '../shared/terapija.model';

@Component({
  selector: 'app-klijent-item',
  templateUrl: './klijent-item.component.html',
  styleUrls: ['./klijent-item.component.css']
})
export class KlijentItemComponent implements OnInit {
@Input() klijent : Klijent;
terapije : {_id : string, naziv :string, odradjeno : number, ukupno : number }[]=[];
isLoading: boolean=false;
nevalidno : boolean=false;
result : Subject<string>=new Subject<string>();
// slika :boolean=false;
promena : string;
  constructor(private router : Router,
    private route : ActivatedRoute,
    private terapeutService : TerapeutService,
    private http : HttpClient) {

  }

  ngOnInit(): void {
    this.isLoading=true;
    // this.slika  = Math.random()*10>5;
    this.terapeutService.fetchTerapijeKlijent(this.klijent.getID()).subscribe(
      (data)=>{
      //console.log(data);
      ///console.log(this.klijent.getIme());
       this.terapije=data;
       this.isLoading=false;
      });

  }
  onClickPrikaziTestove(){
    ///console.log(this.klijent.getID())
        this.router.navigate( [`${this.klijent.getID()}/testovi`], { relativeTo : this.route});
  }
  onClickPovecaj(terapija : {_id : string,naziv :string, odradjeno : number, ukupno : number }){
    if(this.promena)
    {
      this.nevalidno=false;
      terapija.ukupno+=+this.promena;
      this.promenaSeansi(terapija);
    }
      else
      this.nevalidno=true;
  }
  onClickSmanji(terapija : {_id : string, naziv :string, odradjeno : number, ukupno : number }){
    if(this.promena)
    {
      this.nevalidno=false;
      terapija.ukupno-=+this.promena;
      this.promenaSeansi(terapija);
    }
      else
      this.nevalidno=true;
  }
  promenaSeansi(terapija :{_id : string, naziv :string, odradjeno : number, ukupno : number } ){
    let msg='';
    this.http.patch('http://localhost:3000/klijenti/promenaBrojaSeansi', {
      idKlijenta : this.klijent.getID(),
      idTerapije : terapija._id,
      noviBrojPotrebnih : terapija.ukupno
    }, {responseType : 'text'}).subscribe((data)=> {
      if (data=="Uspesno ste promeni klijentu broj potrebih seansi.")
      this.result.next("Uspesno");
      else
      this.result.next(data);
    });

  }
}
