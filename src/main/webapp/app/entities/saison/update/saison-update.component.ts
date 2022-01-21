import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISaison, Saison } from '../saison.model';
import { SaisonService } from '../service/saison.service';
import { ISerie } from 'app/entities/serie/serie.model';
import { SerieService } from 'app/entities/serie/service/serie.service';

@Component({
  selector: 'jhi-saison-update',
  templateUrl: './saison-update.component.html',
})
export class SaisonUpdateComponent implements OnInit {
  isSaving = false;

  seriesSharedCollection: ISerie[] = [];

  editForm = this.fb.group({
    id: [],
    number: [],
    serie: [],
  });

  constructor(
    protected saisonService: SaisonService,
    protected serieService: SerieService,
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

  trackSerieById(index: number, item: ISerie): number {
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
      serie: saison.serie,
    });

    this.seriesSharedCollection = this.serieService.addSerieToCollectionIfMissing(this.seriesSharedCollection, saison.serie);
  }

  protected loadRelationshipsOptions(): void {
    this.serieService
      .query()
      .pipe(map((res: HttpResponse<ISerie[]>) => res.body ?? []))
      .pipe(map((series: ISerie[]) => this.serieService.addSerieToCollectionIfMissing(series, this.editForm.get('serie')!.value)))
      .subscribe((series: ISerie[]) => (this.seriesSharedCollection = series));
  }

  protected createFromForm(): ISaison {
    return {
      ...new Saison(),
      id: this.editForm.get(['id'])!.value,
      number: this.editForm.get(['number'])!.value,
      serie: this.editForm.get(['serie'])!.value,
    };
  }
}
