import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PitanjeService } from '../services/pitanje.service';
import { TerapeutService } from '../services/terapeut.service';
import { TestService } from '../services/test.service';
import { Pitanje } from '../shared/pitanje.model';
import { Test } from '../shared/test.model';
import { UpozorenjeDialogComponent } from '../upozorenje-dialog/upozorenje-dialog.component';

@Component({
  selector: 'app-test-item',
  templateUrl: './test-item.component.html',
  styleUrls: ['./test-item.component.css'],
})
export class TestItemComponent implements OnInit {
  @Input() test: Test;
  @Input() klijent: boolean;
  @Input() klijentDodaj: boolean;
  @Output() obrisani : Subject<string>=new Subject<string>();
  @Output() dodatTest :  Subject<string>=new Subject<string>();
  @Input() klijentID: string = '';
  @Input() broj;
  isHovered: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    private terapeutService: TerapeutService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.route.paramMap.subscribe((params: Params) => {
    //   if (params.get('id')) {
    //     this.klijentID = params.get('id');
    //   }
    //   else if (params.get('idK'))
    //   {
    //     this.klijentID = params.get('id');
    //   }
    // });
  }
  // onClickAzuriraj() {
  //   this.router.navigate([this.test.getID(), 'edit'], {
  //     relativeTo: this.route,
  //   });
 // }
  onClickIzbrisi() {
    let dialogRef = this.dialog.open(UpozorenjeDialogComponent, {
      data: {
        pitanje: `Da li ste sigurni da želite da obrišete test ?`,
        potvrdna: 'Obriši',
      },
    });
    console.log(this.test)
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'true') {
         this.terapeutService.deleteTest(this.test.getID()).subscribe(
          (data) => {
         // console.log(data)
          if (data=="Test je uspešno obrisan.")
          this.obrisani.next(this.test.getID());
          else this.obrisani.next(data.toString());
          },
          (err) => {
           if (err.status==200)
           this.obrisani.next(this.test.getID());
          }
        );
        
      }
    });
  }
  onClickDodaj() {
    //console.log(this.test.getID())
   // console.log(this.klijentID)
    this.terapeutService.addTestKlijentu(this.test.getID(), this.klijentID).subscribe(
      (data)=> {
       // console.log(data)
        if (data=="Test je uspešno dodeljen klijentu.")
        this.dodatTest.next(this.test.getID())
        else this.dodatTest.next("Greska")
      }, 
      (err)=> {
        console.log(err);
        this.dodatTest.next("Greska")
      }
      )
    // this.router
    //   .navigate(['/terapeut/klijenti/' + this.klijentID + '/testovi'])
    //   .then(() => {
    //     window.location.reload();
    //   });
  }
}
