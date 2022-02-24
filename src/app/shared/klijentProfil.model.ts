export class KlijentProfil {
  private id: string;
  private ime: string;
  private prezime: string;
  private email: string;
  private telefon: string;
  private slikaPath: string;
  private brObavestenja: number;
  private brTestova: number;

  constructor(
    id: string,
    ime: string,
    prezime: string,
    email: string,
    telefon: string,
    slika: string,
    brO: number,
    brT: number
  ) {
    this.id = id;
    this.ime = ime;
    this.prezime = prezime;
    this.email = email;
    this.telefon = telefon;
    this.slikaPath = slika;
    this.brObavestenja = brO;
    this.brTestova = brT;
  }

  getID(): string {
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
  getSlikaPath(): string {
    return this.slikaPath;
  }
  getBrObavestenja(): number {
    return this.brObavestenja;
  }
  getBrTestova(): number {
    return this.brTestova;
  }
}
