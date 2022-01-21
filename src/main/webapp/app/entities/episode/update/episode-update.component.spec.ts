import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EpisodeService } from '../service/episode.service';
import { IEpisode, Episode } from '../episode.model';
import { ISaison } from 'app/entities/saison/saison.model';
import { SaisonService } from 'app/entities/saison/service/saison.service';

import { EpisodeUpdateComponent } from './episode-update.component';

describe('Episode Management Update Component', () => {
  let comp: EpisodeUpdateComponent;
  let fixture: ComponentFixture<EpisodeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let episodeService: EpisodeService;
  let saisonService: SaisonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EpisodeUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EpisodeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EpisodeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    episodeService = TestBed.inject(EpisodeService);
    saisonService = TestBed.inject(SaisonService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Saison query and add missing value', () => {
      const episode: IEpisode = { id: 456 };
      const saison: ISaison = { id: 78687 };
      episode.saison = saison;

      const saisonCollection: ISaison[] = [{ id: 47537 }];
      jest.spyOn(saisonService, 'query').mockReturnValue(of(new HttpResponse({ body: saisonCollection })));
      const additionalSaisons = [saison];
      const expectedCollection: ISaison[] = [...additionalSaisons, ...saisonCollection];
      jest.spyOn(saisonService, 'addSaisonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ episode });
      comp.ngOnInit();

      expect(saisonService.query).toHaveBeenCalled();
      expect(saisonService.addSaisonToCollectionIfMissing).toHaveBeenCalledWith(saisonCollection, ...additionalSaisons);
      expect(comp.saisonsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const episode: IEpisode = { id: 456 };
      const saison: ISaison = { id: 27148 };
      episode.saison = saison;

      activatedRoute.data = of({ episode });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(episode));
      expect(comp.saisonsSharedCollection).toContain(saison);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Episode>>();
      const episode = { id: 123 };
      jest.spyOn(episodeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ episode });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: episode }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(episodeService.update).toHaveBeenCalledWith(episode);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Episode>>();
      const episode = new Episode();
      jest.spyOn(episodeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ episode });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: episode }));
      saveSubject.complete();

      // THEN
      expect(episodeService.create).toHaveBeenCalledWith(episode);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Episode>>();
      const episode = { id: 123 };
      jest.spyOn(episodeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ episode });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(episodeService.update).toHaveBeenCalledWith(episode);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackSaisonById', () => {
      it('Should return tracked Saison primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSaisonById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
