import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISerie } from '../serie.model';

@Component({
  selector: 'jhi-serie-detail',
  templateUrl: './serie-detail.component.html',
})
export class SerieDetailComponent implements OnInit {
  serie: ISerie | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serie }) => {
      this.serie = serie;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
