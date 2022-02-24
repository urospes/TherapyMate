import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TerapeutCardInfo } from '../shared/terapeutCardInfo.model';

@Component({
  selector: 'app-terapeut-item',
  templateUrl: './terapeut-item.component.html',
  styleUrls: ['./terapeut-item.component.css'],
})
export class TerapeutItemComponent implements OnInit {
  @Input() terapeut: TerapeutCardInfo; //terapeut koji se prikazuje
  isHovered: boolean;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  onCardClicked() {
    this.router.navigate([this.terapeut.getId()], { relativeTo: this.route });
  }

  klijentiPadez(br: number) {
    if (br !== 11 && br % 10 === 1) {
      return 'klijent';
    } else if (br % 10 > 1 && br % 10 < 5) {
      return 'klijenta';
    } else return 'klijenata';
  }

  terapijePadez(br: number) {
    if (br !== 11 && br % 10 === 1) {
      return 'terapija';
    } else if (br % 10 > 1 && br % 10 < 5) {
      return 'različite terapije';
    } else return 'različitih terapija';
  }

  showOcena() {
    if (this.terapeut.getOcena() === 0) {
      return 'Terapeut nema recenzije!';
    } else {
      return 'Ocena ' + this.terapeut.getOcena().toFixed(1);
    }
  }
}
