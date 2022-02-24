export class Recenzija{
    constructor(private id : string, 
        private ocena : number,
        private komentar : string,
        private terapeut : string,
        private klijent : string) {
        
    }
    getId(){
        return this.id;
    }
    getKlijent(){
        return this.terapeut;
    }
    getTerapeut(){
        return this.klijent;
    }
    getOcena(){
        return this.ocena;
    }
    getKomentar(){
        return this.komentar;
    }
}