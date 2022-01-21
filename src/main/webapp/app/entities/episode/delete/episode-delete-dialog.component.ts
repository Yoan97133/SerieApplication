import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEpisode } from '../episode.model';
import { EpisodeService } from '../service/episode.service';

@Component({
  templateUrl: './episode-delete-dialog.component.html',
})
export class EpisodeDeleteDialogComponent {
  episode?: IEpisode;

  constructor(protected episodeService: EpisodeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.episodeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
