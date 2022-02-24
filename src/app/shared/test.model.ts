import { Pitanje } from './pitanje.model';

export class Test {
  private _id: string;
  pitanja: Pitanje[];

  getID() {
    return this._id;
  }
  setID(value : string){
    this._id=value;
  }
  constructor(id: string, pitanja: Pitanje[]) {
    this._id = id;
    this.pitanja = pitanja;
  }
}
