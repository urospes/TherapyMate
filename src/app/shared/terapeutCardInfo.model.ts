export class TerapeutCardInfo {
  private id: string;
  private ime: string;
  private prezime: string;
  private brTerapija: number;
  private brKlijenata: number;
  private ocena: number;
  private slika: string;
  private tipoviTerapija: string[];

  constructor(
    id: string,
    ime: string,
    prezime: string,
    brTerapija: number,
    brKlijenata: number,
    ocena: number,
    slika: string,
    tipoviTerapija: string[]
  ) {
    this.id = id;
    this.ime = ime;
    this.prezime = prezime;
    this.brTerapija = brTerapija;
    this.brKlijenata = brKlijenata;
    this.ocena = ocena;
    this.slika = slika;
    this.tipoviTerapija = tipoviTerapija;
  }

  public getId(): string {
    return this.id;
  }
  public getIme(): string {
    return this.ime;
  }
  public getPrezime(): string {
    return this.prezime;
  }
  public getBrKlijenata(): number {
    return this.brKlijenata;
  }
  public getBrTerapija(): number {
    return this.brTerapija;
  }
  public getOcena(): number {
    return this.ocena;
  }
  public getSlika(): string {
    return this.slika;
  }

  public getTipoviTerapija(): string[] {
    return this.tipoviTerapija;
  }
}
