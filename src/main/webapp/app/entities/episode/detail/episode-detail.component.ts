import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEpisode } from '../episode.model';

@Component({
  selector: 'jhi-episode-detail',
  templateUrl: './episode-detail.component.html',
})
export class EpisodeDetailComponent implements OnInit {
  episode: IEpisode | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ episode }) => {
      this.episode = episode;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
