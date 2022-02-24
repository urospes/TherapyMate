export interface Pitanje {
id : number;
tip : string,
tekst : string;
izabranOdgovor : string;
ponudjeniOdgovori: string[];
}

export class TekstualnoPitanje implements Pitanje {
    id : number;
    tip : string="tekstualno";
    tekst : string;
    izabranOdgovor : string;
    ponudjeniOdgovori=[];
    constructor(id : number=-1, tekst: string='',  izabrani : string='')
    {   
        this.id=id;
        this.tekst=tekst;
        this.izabranOdgovor=izabrani;
    }
}

export class PitanjeSaPonudjenimOdgovorima implements Pitanje {
    id : number;
    tip : string="ponudjeni";
    tekst : string;
    izabranOdgovor : string;
    ponudjeniOdgovori : string[];
    constructor(id : number=-1, tekst : string='', ponudjeni: string[]=[], izabrani : string='')
    {
        this.id=id;
        this.tekst=tekst;
        this.ponudjeniOdgovori=ponudjeni;
        this.izabranOdgovor=izabrani;
    }
}