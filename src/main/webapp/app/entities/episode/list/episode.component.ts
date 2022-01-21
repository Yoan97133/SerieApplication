import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEpisode } from '../episode.model';
import { EpisodeService } from '../service/episode.service';
import { EpisodeDeleteDialogComponent } from '../delete/episode-delete-dialog.component';

@Component({
  selector: 'jhi-episode',
  templateUrl: './episode.component.html',
})
export class EpisodeComponent implements OnInit {
  episodes?: IEpisode[];
  isLoading = false;

  constructor(protected episodeService: EpisodeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.episodeService.query().subscribe({
      next: (res: HttpResponse<IEpisode[]>) => {
        this.isLoading = false;
        this.episodes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEpisode): number {
    return item.id!;
  }

  delete(episode: IEpisode): void {
    const modalRef = this.modalService.open(EpisodeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.episode = episode;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
