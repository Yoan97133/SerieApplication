import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISaison, Saison } from '../saison.model';

import { SaisonService } from './saison.service';

describe('Saison Service', () => {
  let service: SaisonService;
  let httpMock: HttpTestingController;
  let elemDefault: ISaison;
  let expectedResult: ISaison | ISaison[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SaisonService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      number: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Saison', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Saison()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Saison', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          number: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Saison', () => {
      const patchObject = Object.assign(
        {
          number: 1,
        },
        new Saison()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Saison', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          number: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Saison', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSaisonToCollectionIfMissing', () => {
      it('should add a Saison to an empty array', () => {
        const saison: ISaison = { id: 123 };
        expectedResult = service.addSaisonToCollectionIfMissing([], saison);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(saison);
      });

      it('should not add a Saison to an array that contains it', () => {
        const saison: ISaison = { id: 123 };
        const saisonCollection: ISaison[] = [
          {
            ...saison,
          },
          { id: 456 },
        ];
        expectedResult = service.addSaisonToCollectionIfMissing(saisonCollection, saison);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Saison to an array that doesn't contain it", () => {
        const saison: ISaison = { id: 123 };
        const saisonCollection: ISaison[] = [{ id: 456 }];
        expectedResult = service.addSaisonToCollectionIfMissing(saisonCollection, saison);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(saison);
      });

      it('should add only unique Saison to an array', () => {
        const saisonArray: ISaison[] = [{ id: 123 }, { id: 456 }, { id: 20477 }];
        const saisonCollection: ISaison[] = [{ id: 123 }];
        expectedResult = service.addSaisonToCollectionIfMissing(saisonCollection, ...saisonArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const saison: ISaison = { id: 123 };
        const saison2: ISaison = { id: 456 };
        expectedResult = service.addSaisonToCollectionIfMissing([], saison, saison2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(saison);
        expect(expectedResult).toContain(saison2);
      });

      it('should accept null and undefined values', () => {
        const saison: ISaison = { id: 123 };
        expectedResult = service.addSaisonToCollectionIfMissing([], null, saison, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(saison);
      });

      it('should return initial array if no Saison is added', () => {
        const saisonCollection: ISaison[] = [{ id: 123 }];
        expectedResult = service.addSaisonToCollectionIfMissing(saisonCollection, undefined, null);
        expect(expectedResult).toEqual(saisonCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
