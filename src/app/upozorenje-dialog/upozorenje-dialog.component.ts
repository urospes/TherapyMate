import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-upozorenje-dialog',
  templateUrl: './upozorenje-dialog.component.html',
  styleUrls: ['./upozorenje-dialog.component.css']
})
export class UpozorenjeDialogComponent implements OnInit {
  potvrdna : string='';
  pitanje : string ='';
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any) {
      if(data){
      this.pitanje=data.pitanje;
      this.potvrdna=data.potvrdna;
    }
  }
  ngOnInit(){}
}
