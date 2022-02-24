import { HttpClient } from '@angular/common/http';
import { InvokeFunctionExpr } from '@angular/compiler';
import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { KlijentService } from '../services/klijent.service';

@Component({
  selector: 'app-klijent-test-item',
  templateUrl: './klijent-test-item.component.html',
  styleUrls: ['./klijent-test-item.component.css']
})
export class KlijentTestItemComponent implements OnInit {
@Input() test;
@Input() terapeut;
@Output() uradjen: Subject<string>=new Subject<string>();
  constructor(private http : HttpClient, private klijentService : KlijentService) { }

  ngOnInit(): void {
  }
  onClickSubmit(){
    console.log(this.test.pitanja)
    let odgovori=[];
    this.test.pitanja.forEach((p)=>{
      odgovori.push({sadrzajOdgovora : p.izabranOdgovor, idPitanja : p.id, });
    })
    //console.log(odgovori)
      this.http.patch(`http://localhost:3000/testovi/radjenjeTesta/${this.test._id}/${this.klijentService.getKlijentID()}`,{
      odgovori : odgovori,
      test : this.test._id,
      klijent : this.klijentService.getKlijentID()
      }, { responseType: "text"})
      .subscribe((data)=> {
       // console.log(data);
        this.uradjen.next(this.test._id)
      });
      //console.log("id testa "+this.test._id,"klijent id "+this.klijentService.getKlijentID());

  }

}
