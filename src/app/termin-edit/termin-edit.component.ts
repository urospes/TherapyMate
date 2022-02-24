import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { ActivatedRoute, Router } from '@angular/router';
import { TerapeutService } from '../services/terapeut.service';
import { Termin } from '../shared/termin.model';

@Component({
  selector: 'app-termin-edit',
  templateUrl: './termin-edit.component.html',
  styleUrls: ['./termin-edit.component.css'],
})
export class TerminEditComponent implements OnInit {
  addTermin: FormGroup;
  termin: Termin;
  minDate: Date;
  maxDate: Date;
  picker: Date;
  trajanje: FormControl;
  success : string='';
  error : string='';

  trajanja: string[] = ['45min', '60min', '90min'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private terapeutService: TerapeutService
  ) {}

  ngOnInit(): void {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setMonth(this.maxDate.getMonth() + 1);
    this.addTermin = new FormGroup({
      vreme: new FormControl('', [
        Validators.required,
        Validators.pattern('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'),
      ]),
      datum: new FormControl('', Validators.required),
      trajanje: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    let datum = this.addTermin.get('datum').value;
    //console.log(datum)
    //console.log(datum.getDate())
    this.termin = new Termin(
      true,
      false,
      this.addTermin.get('vreme').value,
      new Date(datum.getFullYear(), datum.getMonth(), datum.getDate() + 1),
      this.addTermin.get('trajanje').value,
      '',
      '',
      '',
      ''
    );
    //console.log(this.termin)
    this.terapeutService.addTermin(this.termin).subscribe(
      (data) => {
        this.success=data;
        setTimeout(()=>{
          this.success='';
          this.router.navigate(['/terapeut/termini']).then(() => {
            //window.location.reload();
          });
        }, 2000)
      },
      (err) => {
        this.error=err.error;
        setTimeout(()=>{
          this.error='';
        }, 2000)
      }
    );
    
  }

  onClickOtkazi() {
    this.router.navigate(['/terapeut/termini']);
  }

  dateFilter(date: Date) {
    let day;
    if (date) day = date.getDay();
    return day != 0;
  }
}
