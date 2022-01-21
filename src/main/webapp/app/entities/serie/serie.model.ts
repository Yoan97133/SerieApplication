import { ISaison } from 'app/entities/saison/saison.model';

export interface ISerie {
  id?: number;
  name?: string | null;
  saison?: ISaison | null;
}

export class Serie implements ISerie {
  constructor(public id?: number, public name?: string | null, public saison?: ISaison | null) {}
}

export function getSerieIdentifier(serie: ISerie): number | undefined {
  return serie.id;
}
