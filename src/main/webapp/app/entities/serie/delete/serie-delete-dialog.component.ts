import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISerie } from '../serie.model';
import { SerieService } from '../service/serie.service';

@Component({
  templateUrl: './serie-delete-dialog.component.html',
})
export class SerieDeleteDialogComponent {
  serie?: ISerie;

  constructor(protected serieService: SerieService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.serieService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
