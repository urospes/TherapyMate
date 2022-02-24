import { TerapijaListComponent } from "../terapija-list/terapija-list.component";

export class Termin {
    getTrajanje: any;
    constructor(private slobodan : boolean, 
        private potvrdjen : boolean,
        private vreme : string,
        private datum : Date,
        private trajanje : string ,
        private terapija : string,
        private klijent : string, 
        private terapeut : string,
        private _id : string) {
        
    }
    replace( slobodan : boolean, 
        potvrdjen : boolean,
         vreme : string,
         datum : Date,
         trajanje : string ,
         terapija : string,
         klijent : string, 
         terapeut : string,
         _id : string){
             this.slobodan=slobodan;
             this.potvrdjen=potvrdjen;
             this.vreme=vreme;
             this.datum=datum;
             this.trajanje=trajanje;
             this.terapija=terapija;
             this.klijent=klijent;
             this.terapeut=terapeut;
             this._id=_id;

         }
    changeSlobodan(){
        this.slobodan=!this.slobodan;
    }
    changePotvrdjen(){
        this.potvrdjen=!this.potvrdjen;
    }
    getSlobodan(){
        return this.slobodan;
    }
    getPotvrdjen(){
        return this.potvrdjen;
    }
    getVreme(){
        return this.vreme;
    }
    getDatum(){
        return this.datum;
    }
    geTrajanje(){
        return this.trajanje;
    }
    geTerapija(){
        return this.terapija;
    }
    getKlijent(){
        return this.klijent;
    }
    geTerapeut(){
        return this.terapeut
    }
    getId(){
        return this._id;
    }
    setTerapija(value : string){
        this.terapija=value;
    }
}