import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pocetna-strana',
  templateUrl: './pocetna-strana.component.html',
  styleUrls: ['./pocetna-strana.component.css'],
})
export class PocetnaStranaComponent implements OnInit {
  @Input() naziv: string = 'PsihoSvet';
  @Input() adresa: string = 'Njegoseva 30';

  constructor() {}

  ngOnInit(): void {}
}
