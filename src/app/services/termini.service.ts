import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TerminInfo } from '../shared/terminInfo.model';

@Injectable({ providedIn: 'root' })
export class TerminiService {
  otkazivanjeSubject: Subject<string> = new Subject<string>();
  zakazivanjeSubject: Subject<{ idTermina: string; promena: boolean }> =
    new Subject<{ idTermina: string; promena: boolean }>();
  promenaSubject: Subject<TerminInfo> = new Subject<TerminInfo>();
}
