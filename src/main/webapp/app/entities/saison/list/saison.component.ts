import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISaison } from '../saison.model';
import { SaisonService } from '../service/saison.service';
import { SaisonDeleteDialogComponent } from '../delete/saison-delete-dialog.component';

@Component({
  selector: 'jhi-saison',
  templateUrl: './saison.component.html',
})
export class SaisonComponent implements OnInit {
  saisons?: ISaison[];
  isLoading = false;

  constructor(protected saisonService: SaisonService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.saisonService.query().subscribe({
      next: (res: HttpResponse<ISaison[]>) => {
        this.isLoading = false;
        this.saisons = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISaison): number {
    return item.id!;
  }

  delete(saison: ISaison): void {
    const modalRef = this.modalService.open(SaisonDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.saison = saison;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
