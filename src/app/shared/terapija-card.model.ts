export class TerapijaCardInfo {
  private id: string;
  private detalji: string;
  private cena: number;
  private tip: string;
  private imeTerapeuta: string;
  private prezimeterapeuta: string;
  private specTerapeuta: string;
  private idTerapeuta: string;
  private ukupno: number;
  private odradjeno: number;

  constructor(
    id: string,
    detalji: string,
    cena: number,
    tip: string,
    imeT: string,
    prezT: string,
    spec: string,
    idT: string,
    ukupno: number = null,
    odradjeno: number = null
  ) {
    this.id = id;
    this.detalji = detalji;
    this.cena = cena;
    this.tip = tip;
    this.imeTerapeuta = imeT;
    this.prezimeterapeuta = prezT;
    this.specTerapeuta = spec;
    this.idTerapeuta = idT;
    this.ukupno = ukupno;
    this.odradjeno = odradjeno;
  }

  getID(): string {
    return this.id;
  }
  getDetalji(): string {
    return this.detalji;
  }
  getTip(): string {
    return this.tip;
  }
  getCena(): number {
    return this.cena;
  }
  getTerapeutName(): string {
    return this.imeTerapeuta + ' ' + this.prezimeterapeuta;
  }
  getSpecTerapeuta(): string {
    return this.specTerapeuta;
  }
  getTerapeutId(): string {
    return this.idTerapeuta;
  }
  getUkupnoTerapija(): number {
    return this.ukupno;
  }
  getOdradjenoTerapija(): number {
    return this.odradjeno;
  }

  setUkupno(br: number): void{
    this.ukupno = br;
  }
  setOdradjeno(br: number): void{
    this.odradjeno = br;
  }
}
