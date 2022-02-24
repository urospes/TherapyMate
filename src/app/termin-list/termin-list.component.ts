
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { KorisnikLogovanjeService } from '../services/korisnikLogovanje.service';
import { TerapeutService } from '../services/terapeut.service';
import { Termin } from '../shared/termin.model';

@Component({
  selector: 'app-termin-list',
  templateUrl: './termin-list.component.html',
  styleUrls: ['./termin-list.component.css']
})

export class TerminListComponent implements OnInit {
  termini : {t :Termin, info :{klijent : string, terapija :string}}[]=[];
  prazan : boolean=false;
  //terapije : Terapija[];
  //klijenti : Klijent[];
  matrix: {t :Termin, info :{klijent : string, terapija :string}}[][];//=[[new Termin(false, false, '', null, '','','', '', '')],[new Termin(false, false, '', null, '','','', '', '')],[new Termin(false, false, '', null, '','','', '', '')]];
isLoading : boolean = true;
obavestenja : string[]=[];
info: {klijent :string, terapija : string}[]=[];
error : string='';
success : string='';

  constructor(private terapeutService : TerapeutService,
    private route : ActivatedRoute,
    private router : Router,
    private korisnikLogovanjeService : KorisnikLogovanjeService) {

   }

  ngOnInit(): void {

    this.isLoading=true;

    this.korisnikLogovanjeService.loggedKorisnik
    .pipe (
      take(1)
      ). subscribe(
    (korisnik) => {
      if (korisnik) {
          this.terapeutService.fetchTerapeut().subscribe( (data)=> {
            this.obavestenja=data.obavestenja;
          }, error=>{
            if(error.error){
              this.error = error.error;
            } else {
              this.error = 'Doslo je do greske. Probajte da se ulogujete ponovo.'
            }
          })
        }
    }
    );
    this.terapeutService.fetchTermini()
    .pipe(
      map((data)=> {

        data.forEach((element, it) => {
          if (!element.slobodan)
       {
         let tt : Termin=new Termin(data[it].slobodan, data[it].potvrdjen, data[it].vreme, this.createDate(data[it].datum ), data[it].trajanje, data[it].terapija, data[it].klijent, data[it].terapeut, data[it]._id);
         this.info.push({klijent : element.klijent.ime+' '+element.klijent.prezime, terapija : element.terapija.tip.naziv.toString()});
         this.termini[it]={t : tt, info : this.info[it]};
         }
          else
          {
            let tt : Termin =new Termin(data[it].slobodan, data[it].potvrdjen, data[it].vreme, this.createDate(data[it].datum ), data[it].trajanje, '', '', data[it].terapeut, data[it]._id);
            this.info.push({klijent :'', terapija :''})
            this.termini[it]={t : tt, info : this.info[it]};
          }

      });
})).subscribe( (data)=> {
  if(this.termini.length==0)
  this.prazan=true;
  else
  {
  this.prazan=false;
    this.sort();
    //console.log(this.termini)
    this.matrix=new Array();
    for(let p=0; p<this.termini.length; p++)
      this.matrix[p]=new Array<any>();
    this.createMatrix();
    //console.log(this.matrix)
  }
    this.isLoading=false;
      });
   // });

  }
  createDate(datumIzBaze : string){
    let date=new Date(+datumIzBaze.substr(0,4),+datumIzBaze.substr(5,2)-1,+datumIzBaze.substr(8,2));
    return date;
  }

sort(){
 this.termini.sort((t,  k)=>{
    let g1=t.t.getDatum().getUTCFullYear();
    let g2=k.t.getDatum().getUTCFullYear();
    if(g1<g2) return -1;
    else if( g1>g2) return 1;
    else {
      g1=t.t.getDatum().getUTCMonth();
      g2=k.t.getDatum().getUTCMonth();
      if(g1<g2) return -1;
        else if( g1>g2) return 1;
        else {
          g1=t.t.getDatum().getUTCDate();
          g2=k.t.getDatum().getUTCDate();
          if(g1<g2) return -1;
          else if( g1>g2) return 1;
          else {
              if (t.t.getVreme()<k.t.getVreme())
              return -1;
              else return 1;
             }
        }
      }
    });
}
  createMatrix(){
    let count=0;
    let j=0;
    let i=0;
    this.matrix[0][0]={t : new Termin(this.termini[i].t.getSlobodan(), this.termini[i].t.getPotvrdjen(), this.termini[i].t.getVreme(), this.termini[i].t.getDatum(), this.termini[i].t.geTrajanje(), this.termini[i].t.geTerapija(), this.termini[i].t.getKlijent(), this.termini[i].t.geTerapeut(), this.termini[i].t.getId()), info :this.termini[i].info};
    i++;
    while(i<this.termini.length)
    {
      if (this.termini[i].t.getDatum().getDate()==this.termini[i-1].t.getDatum().getDate()&&
      this.termini[i].t.getDatum().getMonth()==this.termini[i-1].t.getDatum().getMonth()
      )
      {
        j++;
      }
        else
       {
         j=0;
         count++;
        }

        this.matrix[count][j]={t : new Termin(this.termini[i].t.getSlobodan(), this.termini[i].t.getPotvrdjen(), this.termini[i].t.getVreme(), this.termini[i].t.getDatum(), this.termini[i].t.geTrajanje(), this.termini[i].t.geTerapija(), this.termini[i].t.getKlijent(), this.termini[i].t.geTerapeut(), this.termini[i].t.getId()), info :this.termini[i].info};


       i++;
    }
  }

  onClickNov(){
    this.router.navigate([ 'new'], {relativeTo: this.route});
  }
  onClickOtkazi(){
    this.router.navigate([ 'zakazani'], {relativeTo: this.route});
  }
  onClickObrisi(){
    this.router.navigate([ 'slobodni'], {relativeTo: this.route});
  }
  onClickStari(){
    this.router.navigate([ 'prethodni'], {relativeTo: this.route});
  }
  onClickObrisiObavestenje(o : string){
    this.terapeutService.obrisiObavestenje(o).subscribe((data)=> {
    let i=this.obavestenja.findIndex((ob)=>ob==o);
    this.obavestenja.splice(i, 1);
    });

  }
  obrisaniTermin(id : string){
    if (id.length==24){
    let i=this.termini.findIndex((ter)=>ter.t.getId()==id);
    this.termini=this.termini.splice(i,1);
    }
    else {
      this.error=id;
      setTimeout(()=> {
        this.error='';
      }, 3000)
    }
  }
}
