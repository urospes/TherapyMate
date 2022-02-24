export class SavetovalisteInfo {
  public naziv: string;
  public adresa: string;
  public email: string;
  public opis: string;
  public telefon: string;

  constructor(
    naziv: string,
    adr: string,
    email: string,
    opis: string,
    tel: string
  ) {
    this.naziv = naziv;
    this.adresa = adr;
    this.email = email;
    this.opis = opis;
    this.telefon = tel;
  }
}
