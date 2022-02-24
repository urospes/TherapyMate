export class LoggedKorisnik {
  public id: string;
  public tip: string;
  private _token: string;
  private _tokenExpiration: Date;

  constructor(id: string, tip: string, token: string, tokenExpiration: Date) {
    this.id = id;
    this.tip = tip;
    this._token = token;
    this._tokenExpiration = tokenExpiration;
  }

  get token() {
    //OVAKO TREBA KAD DODAMO VREME ISTEKA
    if (!this._tokenExpiration || new Date() > this._tokenExpiration) {
      return null;
    }
    return this._token;

    //return this._token;
  }
}
