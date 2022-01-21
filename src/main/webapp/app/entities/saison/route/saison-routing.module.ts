import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SaisonComponent } from '../list/saison.component';
import { SaisonDetailComponent } from '../detail/saison-detail.component';
import { SaisonUpdateComponent } from '../update/saison-update.component';
import { SaisonRoutingResolveService } from './saison-routing-resolve.service';

const saisonRoute: Routes = [
  {
    path: '',
    component: SaisonComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SaisonDetailComponent,
    resolve: {
      saison: SaisonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SaisonUpdateComponent,
    resolve: {
      saison: SaisonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SaisonUpdateComponent,
    resolve: {
      saison: SaisonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(saisonRoute)],
  exports: [RouterModule],
})
export class SaisonRoutingModule {}
