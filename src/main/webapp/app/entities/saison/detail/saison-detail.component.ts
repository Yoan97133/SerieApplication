import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISaison } from '../saison.model';

@Component({
  selector: 'jhi-saison-detail',
  templateUrl: './saison-detail.component.html',
})
export class SaisonDetailComponent implements OnInit {
  saison: ISaison | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ saison }) => {
      this.saison = saison;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
