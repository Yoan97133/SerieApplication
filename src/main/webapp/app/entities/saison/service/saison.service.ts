import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISaison, getSaisonIdentifier } from '../saison.model';

export type EntityResponseType = HttpResponse<ISaison>;
export type EntityArrayResponseType = HttpResponse<ISaison[]>;

@Injectable({ providedIn: 'root' })
export class SaisonService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/saisons');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(saison: ISaison): Observable<EntityResponseType> {
    return this.http.post<ISaison>(this.resourceUrl, saison, { observe: 'response' });
  }

  update(saison: ISaison): Observable<EntityResponseType> {
    return this.http.put<ISaison>(`${this.resourceUrl}/${getSaisonIdentifier(saison) as number}`, saison, { observe: 'response' });
  }

  partialUpdate(saison: ISaison): Observable<EntityResponseType> {
    return this.http.patch<ISaison>(`${this.resourceUrl}/${getSaisonIdentifier(saison) as number}`, saison, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISaison>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISaison[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSaisonToCollectionIfMissing(saisonCollection: ISaison[], ...saisonsToCheck: (ISaison | null | undefined)[]): ISaison[] {
    const saisons: ISaison[] = saisonsToCheck.filter(isPresent);
    if (saisons.length > 0) {
      const saisonCollectionIdentifiers = saisonCollection.map(saisonItem => getSaisonIdentifier(saisonItem)!);
      const saisonsToAdd = saisons.filter(saisonItem => {
        const saisonIdentifier = getSaisonIdentifier(saisonItem);
        if (saisonIdentifier == null || saisonCollectionIdentifiers.includes(saisonIdentifier)) {
          return false;
        }
        saisonCollectionIdentifiers.push(saisonIdentifier);
        return true;
      });
      return [...saisonsToAdd, ...saisonCollection];
    }
    return saisonCollection;
  }
}
