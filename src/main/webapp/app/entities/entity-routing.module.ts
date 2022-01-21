import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'serie',
        data: { pageTitle: 'serieApplicationApp.serie.home.title' },
        loadChildren: () => import('./serie/serie.module').then(m => m.SerieModule),
      },
      {
        path: 'saison',
        data: { pageTitle: 'serieApplicationApp.saison.home.title' },
        loadChildren: () => import('./saison/saison.module').then(m => m.SaisonModule),
      },
      {
        path: 'episode',
        data: { pageTitle: 'serieApplicationApp.episode.home.title' },
        loadChildren: () => import('./episode/episode.module').then(m => m.EpisodeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
