import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EpisodeComponent } from './list/episode.component';
import { EpisodeDetailComponent } from './detail/episode-detail.component';
import { EpisodeUpdateComponent } from './update/episode-update.component';
import { EpisodeDeleteDialogComponent } from './delete/episode-delete-dialog.component';
import { EpisodeRoutingModule } from './route/episode-routing.module';

@NgModule({
  imports: [SharedModule, EpisodeRoutingModule],
  declarations: [EpisodeComponent, EpisodeDetailComponent, EpisodeUpdateComponent, EpisodeDeleteDialogComponent],
  entryComponents: [EpisodeDeleteDialogComponent],
})
export class EpisodeModule {}
