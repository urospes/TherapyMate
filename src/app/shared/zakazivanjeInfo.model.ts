export class ZakazivanjeInfo{
  private idTerapeuta: string;
  private imeTerapeuta: string;
  private prezimeTerapeuta: string;
  private telefonTerapeuta: string;
  private terapije: {idTerapije: string, nazivTipa: string}[];

  constructor(idT: string, ime: string, prez: string, tel: string,
     ter: {idTerapije: string, nazivTipa: string}[]){
       this.idTerapeuta = idT;
       this.imeTerapeuta = ime;
       this.prezimeTerapeuta = prez;
       this.telefonTerapeuta = tel;
       this.terapije = ter;
     }

  getIDTerapeuta(): string{
    return this.idTerapeuta;
  }
  getImeTerapeuta(): string{
    return this.imeTerapeuta + ' ' + this.prezimeTerapeuta;
  }
  getTelefon(): string{
    return this.telefonTerapeuta;
  }
  getTerapije(): {idTerapije: string, nazivTipa: string}[]{
    return this.terapije;
  }
}
