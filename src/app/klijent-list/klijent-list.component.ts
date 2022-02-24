import { Component, OnInit } from '@angular/core';
import { TerapeutService } from '../services/terapeut.service';
import { Klijent } from '../shared/klijent.model';

@Component({
  selector: 'app-klijent-list',
  templateUrl: './klijent-list.component.html',
  styleUrls: ['./klijent-list.component.css']
})
export class KlijentListComponent implements OnInit {
klijenti : Klijent[]=[];
prazan : boolean=false;
isLoading:boolean=false;
error : string='';
success : string='';
  constructor(private terapeutService : TerapeutService) {

   }

  ngOnInit(): void {
    this.isLoading=true;
  this.terapeutService.fetchKlijenti().subscribe((data=>{
    //console.log(data)
    data.forEach((element, i) => {
      this.klijenti[i]=new Klijent(element._id,element.ime, element.prezime, '', [], [], element.email, '', element.telefon, element.slika);
    });
    if (this.klijenti.length==0)
    this.prazan=true;
    //console.log(this.klijenti)
    this.isLoading=false;
  }))

}
  obavestenje(o : string){
    if (o=="Uspesno")
    this.success=="Uspešno ste promenili broj seansi";
    else this.error=o;
  }
}
