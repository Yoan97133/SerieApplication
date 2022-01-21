import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISaison, Saison } from '../saison.model';
import { SaisonService } from '../service/saison.service';
import { IEpisode } from 'app/entities/episode/episode.model';
import { EpisodeService } from 'app/entities/episode/service/episode.service';

@Component({
  selector: 'jhi-saison-update',
  templateUrl: './saison-update.component.html',
})
export class SaisonUpdateComponent implements OnInit {
  isSaving = false;

  episodesSharedCollection: IEpisode[] = [];

  editForm = this.fb.group({
    id: [],
    number: [],
    episode: [],
  });

  constructor(
    protected saisonService: SaisonService,
    protected episodeService: EpisodeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ saison }) => {
      this.updateForm(saison);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const saison = this.createFromForm();
    if (saison.id !== undefined) {
      this.subscribeToSaveResponse(this.saisonService.update(saison));
    } else {
      this.subscribeToSaveResponse(this.saisonService.create(saison));
    }
  }

  trackEpisodeById(index: number, item: IEpisode): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISaison>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(saison: ISaison): void {
    this.editForm.patchValue({
      id: saison.id,
      number: saison.number,
      episode: saison.episode,
    });

    this.episodesSharedCollection = this.episodeService.addEpisodeToCollectionIfMissing(this.episodesSharedCollection, saison.episode);
  }

  protected loadRelationshipsOptions(): void {
    this.episodeService
      .query()
      .pipe(map((res: HttpResponse<IEpisode[]>) => res.body ?? []))
      .pipe(
        map((episodes: IEpisode[]) => this.episodeService.addEpisodeToCollectionIfMissing(episodes, this.editForm.get('episode')!.value))
      )
      .subscribe((episodes: IEpisode[]) => (this.episodesSharedCollection = episodes));
  }

  protected createFromForm(): ISaison {
    return {
      ...new Saison(),
      id: this.editForm.get(['id'])!.value,
      number: this.editForm.get(['number'])!.value,
      episode: this.editForm.get(['episode'])!.value,
    };
  }
}
