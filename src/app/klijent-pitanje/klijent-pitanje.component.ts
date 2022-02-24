import { Component, Input, OnInit } from '@angular/core';
import { Pitanje } from '../shared/pitanje.model';

@Component({
  selector: 'app-klijent-pitanje',
  templateUrl: './klijent-pitanje.component.html',
  styleUrls: ['./klijent-pitanje.component.css']
})
export class KlijentPitanjeComponent implements OnInit {
@Input() pitanje : Pitanje;
  constructor() { }

  ngOnInit(): void {
  }
 
}
