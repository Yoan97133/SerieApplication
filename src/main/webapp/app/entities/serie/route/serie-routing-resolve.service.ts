import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISerie, Serie } from '../serie.model';
import { SerieService } from '../service/serie.service';

@Injectable({ providedIn: 'root' })
export class SerieRoutingResolveService implements Resolve<ISerie> {
  constructor(protected service: SerieService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISerie> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((serie: HttpResponse<Serie>) => {
          if (serie.body) {
            return of(serie.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Serie());
  }
}
