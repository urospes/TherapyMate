import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  Pitanje,
  PitanjeSaPonudjenimOdgovorima,
  TekstualnoPitanje,
} from '../shared/pitanje.model';
import { Test } from '../shared/test.model';
import { SavetovalisteService } from './savetovaliste.service';
import { TerapeutService } from './terapeut.service';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  testChanged = new Subject<Test[]>();
  testovi: Test[] = [];
  trenutniTest: Test;
  constructor(
    savetovalisteService: SavetovalisteService,
    private terapeutService: TerapeutService
  ) {}

  getTestoviByTerapeut() {
    //this.testovi = this.terapeutService.fetchTestovi();
    return this.testovi;
  }
  getTest(id: string) {
    const test = this.testovi.find((test) => test.getID() == id);
    return test;
  }
  getTrenutniTest() {
    return this.trenutniTest;
  }
  setTrenutniTest(test: Test) {
    this.trenutniTest = test;
  }
  deleteTest(id: string) {
    const index = this.testovi.findIndex((test) => test.getID() == id);
    this.testovi.splice(index, 1);
    this.testChanged.next(this.testovi);
  }
  addPitanje(pitanje: Pitanje) {
    this.trenutniTest.pitanja.push(pitanje);
  }
}
