import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISerie, Serie } from '../serie.model';
import { SerieService } from '../service/serie.service';
import { ISaison } from 'app/entities/saison/saison.model';
import { SaisonService } from 'app/entities/saison/service/saison.service';

@Component({
  selector: 'jhi-serie-update',
  templateUrl: './serie-update.component.html',
})
export class SerieUpdateComponent implements OnInit {
  isSaving = false;

  saisonsSharedCollection: ISaison[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    saison: [],
  });

  constructor(
    protected serieService: SerieService,
    protected saisonService: SaisonService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serie }) => {
      this.updateForm(serie);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const serie = this.createFromForm();
    if (serie.id !== undefined) {
      this.subscribeToSaveResponse(this.serieService.update(serie));
    } else {
      this.subscribeToSaveResponse(this.serieService.create(serie));
    }
  }

  trackSaisonById(index: number, item: ISaison): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISerie>>): void {
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

  protected updateForm(serie: ISerie): void {
    this.editForm.patchValue({
      id: serie.id,
      name: serie.name,
      saison: serie.saison,
    });

    this.saisonsSharedCollection = this.saisonService.addSaisonToCollectionIfMissing(this.saisonsSharedCollection, serie.saison);
  }

  protected loadRelationshipsOptions(): void {
    this.saisonService
      .query()
      .pipe(map((res: HttpResponse<ISaison[]>) => res.body ?? []))
      .pipe(map((saisons: ISaison[]) => this.saisonService.addSaisonToCollectionIfMissing(saisons, this.editForm.get('saison')!.value)))
      .subscribe((saisons: ISaison[]) => (this.saisonsSharedCollection = saisons));
  }

  protected createFromForm(): ISerie {
    return {
      ...new Serie(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      saison: this.editForm.get(['saison'])!.value,
    };
  }
}
