import { TerapijaBasic } from './terapija-basic.model';

export class TerapeutPageInfo {
  private id: string;
  private ime: string;
  private prezime: string;
  private email: string;
  private telefon: string;
  private specijalizacija: string;
  private opis: string;
  private slika: string;
  private terapije: TerapijaBasic[];

  constructor(
    id: string,
    ime: string,
    prezime: string,
    email: string,
    telefon: string,
    specijalizacija: string,
    opis: string,
    slika: string,
    terapije: TerapijaBasic[] = []
  ) {
    this.id = id;
    this.ime = ime;
    this.prezime = prezime;
    this.email = email;
    this.telefon = telefon;
    this.specijalizacija = specijalizacija;
    this.opis = opis;
    this.slika = slika;
    this.terapije = terapije;
  }

  getId(): string {
    return this.id;
  }
  getIme(): string {
    return this.ime;
  }
  getPrezime(): string {
    return this.prezime;
  }
  getEmail(): string {
    return this.email;
  }
  getTelefon(): string {
    return this.telefon;
  }
  getSpecijalizacija(): string {
    return this.specijalizacija;
  }
  getOpis(): string {
    return this.opis;
  }
  getSlika(): string {
    return this.slika;
  }
  getTerapije(): TerapijaBasic[] {
    return this.terapije;
  }
  setTerapije(terapije: TerapijaBasic[]): void {
    this.terapije = terapije;
  }
}
