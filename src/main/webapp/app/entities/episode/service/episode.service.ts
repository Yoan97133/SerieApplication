import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEpisode, getEpisodeIdentifier } from '../episode.model';

export type EntityResponseType = HttpResponse<IEpisode>;
export type EntityArrayResponseType = HttpResponse<IEpisode[]>;

@Injectable({ providedIn: 'root' })
export class EpisodeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/episodes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(episode: IEpisode): Observable<EntityResponseType> {
    return this.http.post<IEpisode>(this.resourceUrl, episode, { observe: 'response' });
  }

  update(episode: IEpisode): Observable<EntityResponseType> {
    return this.http.put<IEpisode>(`${this.resourceUrl}/${getEpisodeIdentifier(episode) as number}`, episode, { observe: 'response' });
  }

  partialUpdate(episode: IEpisode): Observable<EntityResponseType> {
    return this.http.patch<IEpisode>(`${this.resourceUrl}/${getEpisodeIdentifier(episode) as number}`, episode, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEpisode>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEpisode[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEpisodeToCollectionIfMissing(episodeCollection: IEpisode[], ...episodesToCheck: (IEpisode | null | undefined)[]): IEpisode[] {
    const episodes: IEpisode[] = episodesToCheck.filter(isPresent);
    if (episodes.length > 0) {
      const episodeCollectionIdentifiers = episodeCollection.map(episodeItem => getEpisodeIdentifier(episodeItem)!);
      const episodesToAdd = episodes.filter(episodeItem => {
        const episodeIdentifier = getEpisodeIdentifier(episodeItem);
        if (episodeIdentifier == null || episodeCollectionIdentifiers.includes(episodeIdentifier)) {
          return false;
        }
        episodeCollectionIdentifiers.push(episodeIdentifier);
        return true;
      });
      return [...episodesToAdd, ...episodeCollection];
    }
    return episodeCollection;
  }
}
