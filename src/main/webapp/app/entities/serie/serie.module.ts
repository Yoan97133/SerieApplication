import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SerieComponent } from './list/serie.component';
import { SerieDetailComponent } from './detail/serie-detail.component';
import { SerieUpdateComponent } from './update/serie-update.component';
import { SerieDeleteDialogComponent } from './delete/serie-delete-dialog.component';
import { SerieRoutingModule } from './route/serie-routing.module';

@NgModule({
  imports: [SharedModule, SerieRoutingModule],
  declarations: [SerieComponent, SerieDetailComponent, SerieUpdateComponent, SerieDeleteDialogComponent],
  entryComponents: [SerieDeleteDialogComponent],
})
export class SerieModule {}
