import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISaison, Saison } from '../saison.model';
import { SaisonService } from '../service/saison.service';

@Injectable({ providedIn: 'root' })
export class SaisonRoutingResolveService implements Resolve<ISaison> {
  constructor(protected service: SaisonService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISaison> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((saison: HttpResponse<Saison>) => {
          if (saison.body) {
            return of(saison.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Saison());
  }
}
