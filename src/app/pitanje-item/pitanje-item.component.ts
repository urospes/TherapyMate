import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PitanjeService } from '../services/pitanje.service';
import { TestService } from '../services/test.service';
import { Pitanje } from '../shared/pitanje.model';

@Component({
  selector: 'app-pitanje-item',
  templateUrl: './pitanje-item.component.html',
  styleUrls: ['./pitanje-item.component.css']
})
export class PitanjeItemComponent implements OnInit {
@Input() pitanje;
@Input() klijent;

 edit=false;
 isHovered=false;
  constructor(private route : ActivatedRoute,
    private router : Router, 
    private PitanjeService : PitanjeService,
    private testService : TestService
    ) { }

  ngOnInit(): void {
    if(this.route.snapshot.routeConfig.path.includes("edit"))
      this.edit=true;
    else this.edit=false;
}
onClickIzbrisi(){

this.PitanjeService.deletePitanje(this.pitanje);
}
onClickIzmeni(){
this.PitanjeService.setTrenutnoPitanje(this.pitanje);
this.router.navigate(['/terapeutView/testovi/pitanje/',this.pitanje.tip, this.pitanje.id, 'edit']);
}
}
