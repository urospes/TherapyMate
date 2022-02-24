export class TerapijaBasic {
  private idTerapije: string;
  private tip: string;
  private detalji: string;
  private cena: number;
  private odradjeno: number;
  private ukupno: number;

  constructor(
    id: string,
    tip: string,
    detalji: string,
    cena: number,
    odr: number = -1,
    ukupno: number = -1
  ) {
    this.idTerapije = id;
    this.tip = tip;
    this.detalji = detalji;
    this.cena = cena;
    this.odradjeno = odr;
    this.ukupno = ukupno;
  }

  getId(): string {
    return this.idTerapije;
  }
  getTip(): string {
    return this.tip;
  }
  getDetalji(): string {
    return this.detalji;
  }
  getCena(): number {
    return this.cena;
  }
  getOdradjenoTerapija(): number {
    return this.odradjeno;
  }
  getUkupnoTerapija(): number {
    return this.ukupno;
  }

  setOdradjeno(br: number): void {
    this.odradjeno = br;
  }
  setUkupno(br: number): void {
    this.ukupno = br;
  }
}
