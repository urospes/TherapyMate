export class TerminInfo {
  private id: string;
  private datum: Date;
  private vreme: string;
  private trajanje: string;
  private potvrdjen: boolean;
  private idTerapeuta: string;
  private imeTerapeuta: string;
  private prezimeTerapeuta: string;
  private brTerapeuta: string;
  private idTerapije: string;
  private nazivTipa: string;

  constructor(
    id: string,
    datum: Date,
    vreme: string,
    trajanje: string,
    potvrdjen: boolean,
    idT: string,
    imeT: string,
    prezT: string,
    brT: string,
    idTerapije: string,
    naziv: string
  ) {
    this.id = id;
    this.datum = datum;
    this.vreme = vreme;
    this.trajanje = trajanje;
    this.potvrdjen = potvrdjen;
    this.idTerapeuta = idT;
    this.imeTerapeuta = imeT;
    this.prezimeTerapeuta = prezT;
    this.brTerapeuta = brT;
    this.idTerapije = idTerapije;
    this.nazivTipa = naziv;
  }

  getID(): string {
    return this.id;
  }
  getDatum(): string {
    const temp: Date = new Date(this.datum);
    return temp.toLocaleDateString();
  }
  getDatumDate(): Date {
    return this.datum;
  }
  getVreme(): string {
    return this.vreme;
  }
  getTrajanje(): string {
    return this.trajanje;
  }
  getPotvrdjen(): boolean {
    return this.potvrdjen;
  }
  getIDTerapeuta(): string {
    return this.idTerapeuta;
  }
  getImeTerapeuta(): string {
    return this.imeTerapeuta + ' ' + this.prezimeTerapeuta;
  }
  getBrTerapeuta(): string {
    return this.brTerapeuta;
  }
  getIDTerapije(): string {
    return this.idTerapije;
  }
  getNazivTipa(): string {
    return this.nazivTipa;
  }
  getDatumCustomFormat(): string {
    const temp: Date = new Date(this.datum);
    temp.setTime(temp.getTime() - 24 * 60 * 60 * 1000);

    return (
      temp.getDate().toString() +
      '.' +
      (temp.getMonth() + 1).toString() +
      '.' +
      temp.getFullYear() +
      '.'
    );
  }
}
