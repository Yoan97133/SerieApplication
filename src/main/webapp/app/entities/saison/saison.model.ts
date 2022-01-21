import { ISerie } from 'app/entities/serie/serie.model';
import { IEpisode } from 'app/entities/episode/episode.model';

export interface ISaison {
  id?: number;
  number?: number | null;
  series?: ISerie[] | null;
  episode?: IEpisode | null;
}

export class Saison implements ISaison {
  constructor(public id?: number, public number?: number | null, public series?: ISerie[] | null, public episode?: IEpisode | null) {}
}

export function getSaisonIdentifier(saison: ISaison): number | undefined {
  return saison.id;
}
