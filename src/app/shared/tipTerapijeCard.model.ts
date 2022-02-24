export class TipTerapijeCard {
  private id: string;
  private opis: string;
  private naziv: string;

  constructor(id: string, opis: string, naziv: string) {
    this.id = id;
    this.opis = opis;
    this.naziv = naziv;
  }

  getID(): string {
    return this.id;
  }
  getOpis(): string {
    return this.opis;
  }
  getNaziv(): string {
    return this.naziv;
  }
}
