export class TerapeutClientCard {
  private id: string;
  private ime: string;
  private prezime: string;
  private email: string;
  private telefon: string;
  private spec: string;
  private slika: string;

  constructor(
    id: string,
    ime: string,
    prezime: string,
    email: string,
    telefon: string,
    spec: string,
    slika: string
  ) {
    this.id = id;
    this.ime = ime;
    this.prezime = prezime;
    this.email = email;
    this.telefon = telefon;
    this.spec = spec;
    this.slika = slika;
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
  getSpec(): string {
    return this.spec;
  }
  getSlika(): string {
    return this.slika;
  }
}
