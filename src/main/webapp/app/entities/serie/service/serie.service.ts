import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISerie, getSerieIdentifier } from '../serie.model';

export type EntityResponseType = HttpResponse<ISerie>;
export type EntityArrayResponseType = HttpResponse<ISerie[]>;

@Injectable({ providedIn: 'root' })
export class SerieService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/series');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(serie: ISerie): Observable<EntityResponseType> {
    return this.http.post<ISerie>(this.resourceUrl, serie, { observe: 'response' });
  }

  update(serie: ISerie): Observable<EntityResponseType> {
    return this.http.put<ISerie>(`${this.resourceUrl}/${getSerieIdentifier(serie) as number}`, serie, { observe: 'response' });
  }

  partialUpdate(serie: ISerie): Observable<EntityResponseType> {
    return this.http.patch<ISerie>(`${this.resourceUrl}/${getSerieIdentifier(serie) as number}`, serie, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISerie>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISerie[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSerieToCollectionIfMissing(serieCollection: ISerie[], ...seriesToCheck: (ISerie | null | undefined)[]): ISerie[] {
    const series: ISerie[] = seriesToCheck.filter(isPresent);
    if (series.length > 0) {
      const serieCollectionIdentifiers = serieCollection.map(serieItem => getSerieIdentifier(serieItem)!);
      const seriesToAdd = series.filter(serieItem => {
        const serieIdentifier = getSerieIdentifier(serieItem);
        if (serieIdentifier == null || serieCollectionIdentifiers.includes(serieIdentifier)) {
          return false;
        }
        serieCollectionIdentifiers.push(serieIdentifier);
        return true;
      });
      return [...seriesToAdd, ...serieCollection];
    }
    return serieCollection;
  }
}
