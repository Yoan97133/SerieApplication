import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISerie } from '../serie.model';
import { SerieService } from '../service/serie.service';
import { SerieDeleteDialogComponent } from '../delete/serie-delete-dialog.component';

@Component({
  selector: 'jhi-serie',
  templateUrl: './serie.component.html',
})
export class SerieComponent implements OnInit {
  series?: ISerie[];
  isLoading = false;

  constructor(protected serieService: SerieService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.serieService.query().subscribe({
      next: (res: HttpResponse<ISerie[]>) => {
        this.isLoading = false;
        this.series = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISerie): number {
    return item.id!;
  }

  delete(serie: ISerie): void {
    const modalRef = this.modalService.open(SerieDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.serie = serie;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
