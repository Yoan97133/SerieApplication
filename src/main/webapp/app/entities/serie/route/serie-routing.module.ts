import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SerieComponent } from '../list/serie.component';
import { SerieDetailComponent } from '../detail/serie-detail.component';
import { SerieUpdateComponent } from '../update/serie-update.component';
import { SerieRoutingResolveService } from './serie-routing-resolve.service';

const serieRoute: Routes = [
  {
    path: '',
    component: SerieComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SerieDetailComponent,
    resolve: {
      serie: SerieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SerieUpdateComponent,
    resolve: {
      serie: SerieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SerieUpdateComponent,
    resolve: {
      serie: SerieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(serieRoute)],
  exports: [RouterModule],
})
export class SerieRoutingModule {}
