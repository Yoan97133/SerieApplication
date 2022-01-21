import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SaisonComponent } from './list/saison.component';
import { SaisonDetailComponent } from './detail/saison-detail.component';
import { SaisonUpdateComponent } from './update/saison-update.component';
import { SaisonDeleteDialogComponent } from './delete/saison-delete-dialog.component';
import { SaisonRoutingModule } from './route/saison-routing.module';

@NgModule({
  imports: [SharedModule, SaisonRoutingModule],
  declarations: [SaisonComponent, SaisonDetailComponent, SaisonUpdateComponent, SaisonDeleteDialogComponent],
  entryComponents: [SaisonDeleteDialogComponent],
})
export class SaisonModule {}
