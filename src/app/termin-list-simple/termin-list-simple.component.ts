import { HttpClient } from '@angular/common/http';
import { ElementSchemaRegistry } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TerapeutService } from '../services/terapeut.service';
import { Termin } from '../shared/termin.model';

@Component({
  selector: 'app-termin-list-simple',
  templateUrl: './termin-list-simple.component.html',
  styleUrls: ['./termin-list-simple.component.css']
})
export class TerminListSimpleComponent implements OnInit {
  termini : {t :Termin, info :{klijent : string, terapija :string}}[]=[];
  info: {klijent :string, terapija : string}[]=[];
  constructor(private route : ActivatedRoute,
    private router : Router,
    private terapeutService : TerapeutService,
    private http : HttpClient) { }
  isLoading: boolean=false;
  slobodni : boolean=false;
  zauzeti : boolean=false;
  prethodni : boolean=false;
  prazan : boolean=false;
  error: string='';
  success:string='';
  ngOnInit(): void {
    this.isLoading=true;
    
    this.route.url.subscribe( (url)=> {
    if (this.router.url=='/terapeut/termini/slobodni')
    {
      
      this.slobodni=true;
      this.zauzeti=false;
      this.prethodni=false;
    }
      else
      
         if (this.router.url=='/terapeut/termini/zakazani')
      {
         this.zauzeti=true;
         this.slobodni=false;
         this.prethodni=false;
      }
      else {
        this.zauzeti=false;
        this.slobodni=false;
        this.prethodni=true;
      }
    //   this.http.get<any>(
    //     'http://localhost:3000/terapeuti/' +
    //       this.terapeutService.getTerapeutID() +
    //       '/terapije'
    //   ).subscribe((data)=>{
    //     console.log(data)
    //     data.terapije.forEach((ter)=>{
    //      this.terapije.push({ter.id, ter.tip.naziv});
    //     })
    //   })
    // }

      this.fetch().subscribe( (data)=> {
        //console.log(data)
        if (data.length==0)
        this.prazan=true;
        data.forEach((element, it) => {
          if (!element.slobodan)
       { 
        // console.log(element)
         let tt : Termin=new Termin(data[it].slobodan, data[it].potvrdjen, data[it].vreme, this.createDate(data[it].datum ), data[it].trajanje, data[it].terapija, data[it].klijent, data[it].terapeut, data[it]._id);
         this.info.push({klijent : element.klijent.ime+' '+element.klijent.prezime, terapija : element.terapija.tip.naziv.toString()});
         this.termini[it]={t : tt, info : this.info[it]};
         //console.log(this.termini[it])
         }
          else 
          {
           // console.log(element)
            let tt=new Termin(data[it].slobodan, data[it].potvrdjen, data[it].vreme, this.createDate(data[it].datum ), data[it].trajanje, '', data[it].klijent, data[it].terapeut, data[it]._id);
            this.info.push({klijent :'', terapija :''})
            this.termini[it]={t : tt, info : this.info[it]};
            //console.log(this.termini[it])
          }
          this.sort();
        this.isLoading=false;
      }
        );
        this.isLoading=false
    }, (err)=>{
      console.log(err)});
      }); 
    



}
createDate(datumIzBaze : string){
  let date=new Date(+datumIzBaze.substr(0,4),+datumIzBaze.substr(5,2)-1,+datumIzBaze.substr(8,2));
  return date;
}
  onClickOtkazi(){
    this.router.navigate([ '..'], {relativeTo: this.route});
  }


 fetch(){
  if(this.slobodni)
    return this.terapeutService.fetchSlobodniTermini();
  else  if (this.zauzeti)
    return this.terapeutService.fetchZakazaniTermini();
    else return this.terapeutService.fetchPrethodniTermini();
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
                 else return 0;
                }
           }
         }
       });
   }
   obrisaniTermin(id : string){
     if (id.length==24)
    {  
    let i=this.termini.findIndex((k)=>{return k.t.getId()==id})
     this.termini.splice(i, 1);
     if(this.termini.length==0)
     this.prazan=true;
     this.success="Uspešno ste obrisali termin";
     setTimeout(()=>{
       this.success=''}, 2000)
     
    }
    else 
    {
      this.error=id;
      setTimeout(()=>{
        this.error=''}, 2000)
      }
    }
    
  }
