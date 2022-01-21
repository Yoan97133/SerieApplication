import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEpisode, Episode } from '../episode.model';

import { EpisodeService } from './episode.service';

describe('Episode Service', () => {
  let service: EpisodeService;
  let httpMock: HttpTestingController;
  let elemDefault: IEpisode;
  let expectedResult: IEpisode | IEpisode[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EpisodeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
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

    it('should create a Episode', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Episode()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Episode', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
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

    it('should partial update a Episode', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Episode()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Episode', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
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

    it('should delete a Episode', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEpisodeToCollectionIfMissing', () => {
      it('should add a Episode to an empty array', () => {
        const episode: IEpisode = { id: 123 };
        expectedResult = service.addEpisodeToCollectionIfMissing([], episode);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(episode);
      });

      it('should not add a Episode to an array that contains it', () => {
        const episode: IEpisode = { id: 123 };
        const episodeCollection: IEpisode[] = [
          {
            ...episode,
          },
          { id: 456 },
        ];
        expectedResult = service.addEpisodeToCollectionIfMissing(episodeCollection, episode);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Episode to an array that doesn't contain it", () => {
        const episode: IEpisode = { id: 123 };
        const episodeCollection: IEpisode[] = [{ id: 456 }];
        expectedResult = service.addEpisodeToCollectionIfMissing(episodeCollection, episode);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(episode);
      });

      it('should add only unique Episode to an array', () => {
        const episodeArray: IEpisode[] = [{ id: 123 }, { id: 456 }, { id: 95077 }];
        const episodeCollection: IEpisode[] = [{ id: 123 }];
        expectedResult = service.addEpisodeToCollectionIfMissing(episodeCollection, ...episodeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const episode: IEpisode = { id: 123 };
        const episode2: IEpisode = { id: 456 };
        expectedResult = service.addEpisodeToCollectionIfMissing([], episode, episode2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(episode);
        expect(expectedResult).toContain(episode2);
      });

      it('should accept null and undefined values', () => {
        const episode: IEpisode = { id: 123 };
        expectedResult = service.addEpisodeToCollectionIfMissing([], null, episode, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(episode);
      });

      it('should return initial array if no Episode is added', () => {
        const episodeCollection: IEpisode[] = [{ id: 123 }];
        expectedResult = service.addEpisodeToCollectionIfMissing(episodeCollection, undefined, null);
        expect(expectedResult).toEqual(episodeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
