import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EpisodeComponent } from '../list/episode.component';
import { EpisodeDetailComponent } from '../detail/episode-detail.component';
import { EpisodeUpdateComponent } from '../update/episode-update.component';
import { EpisodeRoutingResolveService } from './episode-routing-resolve.service';

const episodeRoute: Routes = [
  {
    path: '',
    component: EpisodeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EpisodeDetailComponent,
    resolve: {
      episode: EpisodeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EpisodeUpdateComponent,
    resolve: {
      episode: EpisodeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EpisodeUpdateComponent,
    resolve: {
      episode: EpisodeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(episodeRoute)],
  exports: [RouterModule],
})
export class EpisodeRoutingModule {}
