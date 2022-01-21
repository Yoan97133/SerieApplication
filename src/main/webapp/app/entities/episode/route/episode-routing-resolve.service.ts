import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEpisode, Episode } from '../episode.model';
import { EpisodeService } from '../service/episode.service';

@Injectable({ providedIn: 'root' })
export class EpisodeRoutingResolveService implements Resolve<IEpisode> {
  constructor(protected service: EpisodeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEpisode> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((episode: HttpResponse<Episode>) => {
          if (episode.body) {
            return of(episode.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Episode());
  }
}
