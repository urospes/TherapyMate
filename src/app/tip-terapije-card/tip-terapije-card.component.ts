import { Component, Input, OnInit } from '@angular/core';
import { TerapijeService } from '../services/terapije.service';
import { TipTerapijeCard } from '../shared/tipTerapijeCard.model';

@Component({
  selector: 'app-tip-terapije-card',
  templateUrl: './tip-terapije-card.component.html',
  styleUrls: ['./tip-terapije-card.component.css'],
})
export class TipTerapijeCardComponent implements OnInit {
  @Input() tip: TipTerapijeCard;
  @Input() isClicked: boolean = false;
  constructor(private terapijeService: TerapijeService) {}

  ngOnInit(): void {}

  onTipClicked(event) {
    if(event.target.id === "vidi"){
      return;
    }
    this.isClicked = !this.isClicked;
    if (this.isClicked) {
      this.terapijeService.tipTerapijeClick.next({
        id: this.tip.getID(),
        naziv: this.tip.getNaziv(),
      });
    } else {
      this.terapijeService.tipTerapijeClick.next(null);
    }
  }

  onVidiTerapije(){
    this.isClicked = true;
    window.scrollTo({
      top: window.innerHeight * 3,
      left: 0,
      behavior: 'smooth',
    });
  }
}
