import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEpisode, Episode } from '../episode.model';
import { EpisodeService } from '../service/episode.service';
import { ISaison } from 'app/entities/saison/saison.model';
import { SaisonService } from 'app/entities/saison/service/saison.service';

@Component({
  selector: 'jhi-episode-update',
  templateUrl: './episode-update.component.html',
})
export class EpisodeUpdateComponent implements OnInit {
  isSaving = false;

  saisonsSharedCollection: ISaison[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    number: [],
    saison: [],
  });

  constructor(
    protected episodeService: EpisodeService,
    protected saisonService: SaisonService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ episode }) => {
      this.updateForm(episode);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const episode = this.createFromForm();
    if (episode.id !== undefined) {
      this.subscribeToSaveResponse(this.episodeService.update(episode));
    } else {
      this.subscribeToSaveResponse(this.episodeService.create(episode));
    }
  }

  trackSaisonById(index: number, item: ISaison): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEpisode>>): void {
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

  protected updateForm(episode: IEpisode): void {
    this.editForm.patchValue({
      id: episode.id,
      name: episode.name,
      number: episode.number,
      saison: episode.saison,
    });

    this.saisonsSharedCollection = this.saisonService.addSaisonToCollectionIfMissing(this.saisonsSharedCollection, episode.saison);
  }

  protected loadRelationshipsOptions(): void {
    this.saisonService
      .query()
      .pipe(map((res: HttpResponse<ISaison[]>) => res.body ?? []))
      .pipe(map((saisons: ISaison[]) => this.saisonService.addSaisonToCollectionIfMissing(saisons, this.editForm.get('saison')!.value)))
      .subscribe((saisons: ISaison[]) => (this.saisonsSharedCollection = saisons));
  }

  protected createFromForm(): IEpisode {
    return {
      ...new Episode(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      number: this.editForm.get(['number'])!.value,
      saison: this.editForm.get(['saison'])!.value,
    };
  }
}
