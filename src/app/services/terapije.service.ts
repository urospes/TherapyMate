import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TerapijeService {
  tipTerapijeClick: Subject<{ id: string; naziv: string }> = new Subject<{
    id: string;
    naziv: string;
  }>();

  otkazivanjeTerapijeClick: Subject<string> = new Subject<string>();
  pretplataTerapijeSub: Subject<string> = new Subject<string>();
}
