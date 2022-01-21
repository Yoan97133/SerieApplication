import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISaison } from '../saison.model';
import { SaisonService } from '../service/saison.service';

@Component({
  templateUrl: './saison-delete-dialog.component.html',
})
export class SaisonDeleteDialogComponent {
  saison?: ISaison;

  constructor(protected saisonService: SaisonService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.saisonService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
