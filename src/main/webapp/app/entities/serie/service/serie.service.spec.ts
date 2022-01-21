import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISerie, Serie } from '../serie.model';

import { SerieService } from './serie.service';

describe('Serie Service', () => {
  let service: SerieService;
  let httpMock: HttpTestingController;
  let elemDefault: ISerie;
  let expectedResult: ISerie | ISerie[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SerieService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
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

    it('should create a Serie', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Serie()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Serie', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Serie', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Serie()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Serie', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
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

    it('should delete a Serie', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSerieToCollectionIfMissing', () => {
      it('should add a Serie to an empty array', () => {
        const serie: ISerie = { id: 123 };
        expectedResult = service.addSerieToCollectionIfMissing([], serie);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(serie);
      });

      it('should not add a Serie to an array that contains it', () => {
        const serie: ISerie = { id: 123 };
        const serieCollection: ISerie[] = [
          {
            ...serie,
          },
          { id: 456 },
        ];
        expectedResult = service.addSerieToCollectionIfMissing(serieCollection, serie);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Serie to an array that doesn't contain it", () => {
        const serie: ISerie = { id: 123 };
        const serieCollection: ISerie[] = [{ id: 456 }];
        expectedResult = service.addSerieToCollectionIfMissing(serieCollection, serie);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(serie);
      });

      it('should add only unique Serie to an array', () => {
        const serieArray: ISerie[] = [{ id: 123 }, { id: 456 }, { id: 5965 }];
        const serieCollection: ISerie[] = [{ id: 123 }];
        expectedResult = service.addSerieToCollectionIfMissing(serieCollection, ...serieArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const serie: ISerie = { id: 123 };
        const serie2: ISerie = { id: 456 };
        expectedResult = service.addSerieToCollectionIfMissing([], serie, serie2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(serie);
        expect(expectedResult).toContain(serie2);
      });

      it('should accept null and undefined values', () => {
        const serie: ISerie = { id: 123 };
        expectedResult = service.addSerieToCollectionIfMissing([], null, serie, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(serie);
      });

      it('should return initial array if no Serie is added', () => {
        const serieCollection: ISerie[] = [{ id: 123 }];
        expectedResult = service.addSerieToCollectionIfMissing(serieCollection, undefined, null);
        expect(expectedResult).toEqual(serieCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
