import { Terapija } from './terapija.model';

export class TipTerapija {
  constructor(
    public id: string,
    public opis: string,
    public naziv: string,
    public terapije: Terapija[]
  ) {}
  getId(){
    return this.id;
  }
}
