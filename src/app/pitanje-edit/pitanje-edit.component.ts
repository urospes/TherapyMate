import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PitanjeService } from '../services/pitanje.service';
import { Pitanje, PitanjeSaPonudjenimOdgovorima, TekstualnoPitanje } from '../shared/pitanje.model';
import {Location} from '@angular/common'
import { TerapeutService } from '../services/terapeut.service';
import { TestService } from '../services/test.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pitanje-edit',
  templateUrl: './pitanje-edit.component.html',
  styleUrls: ['./pitanje-edit.component.css']
})
export class PitanjeEditComponent implements OnInit {
 pitanje : Pitanje;
 @Input() tip : string='';
@Input() id : string;
pitanja : Pitanje[]=[];
@Output() pitanjeChanged =new Subject<Pitanje[]>();
ponudjeni : string[]=[];
editPitanje : FormGroup;
  constructor(private PitanjeService : PitanjeService,
    private router : Router,
    private route : ActivatedRoute,
    private location : Location,
    private terapeutService : TerapeutService,
    private testService : TestService) { 
this.pitanje=this.PitanjeService.getTrenutnoPitanje();
    }

  ngOnInit(): void {
      this.editPitanje= new FormGroup({
        'tekst' : new FormControl(''),
        'tekst2' : new FormControl(''),
        'ponudjeni' : new FormControl('')
      })
      console.log("ng"+this.pitanja)
    /*this.route.params.subscribe(
      (params: Params) => {
        if (+(params['id'])) //ako ima id onda izmena
        {
          console.log(+(params['id']));
          this.pitanje=this.PitanjeService.getPitanje(+(params['id']));
          this.editPitanje.setValue({
              'tekst' : this.pitanje.tekst,
              'ponudjeni' : ''
            })

        }
        else
        {

        }
      }
    )*/

  }
  f(){
    return this.editPitanje.controls;
  }
  onClickSacuvajTkest(){
    //if (this.pitanje==undefined)
      this.pitanja.push(new TekstualnoPitanje(-1, this.editPitanje.get('tekst').value, '' ));  
      this.pitanjeChanged.next(this.pitanja.slice());
      this.editPitanje.patchValue({tekst : ''});
  }
  onClickSacuvajPonudjeno(){
    this.pitanja.push(new PitanjeSaPonudjenimOdgovorima(-1, this.editPitanje.get('tekst2').value,
                                                    this.ponudjeni, ''));
    this.ponudjeni=[];
    this.pitanjeChanged.next(this.pitanja.slice());
    this.editPitanje.patchValue({ponudjeni : ''});
    this.editPitanje.patchValue({tekst2 : ''});
  }
  onClickOtkazi(){
    this.ponudjeni=[];
  }
  onClickDodaj(){
    this.ponudjeni.push(this.editPitanje.get('ponudjeni').value);
    this.editPitanje.patchValue({ponudjeni : ''});
  }
  onClickIzbrisi(){

  }
}
