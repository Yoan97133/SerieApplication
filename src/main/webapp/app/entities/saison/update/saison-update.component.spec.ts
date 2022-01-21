import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SaisonService } from '../service/saison.service';
import { ISaison, Saison } from '../saison.model';
import { ISerie } from 'app/entities/serie/serie.model';
import { SerieService } from 'app/entities/serie/service/serie.service';

import { SaisonUpdateComponent } from './saison-update.component';

describe('Saison Management Update Component', () => {
  let comp: SaisonUpdateComponent;
  let fixture: ComponentFixture<SaisonUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let saisonService: SaisonService;
  let serieService: SerieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SaisonUpdateComponent],
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
      .overrideTemplate(SaisonUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SaisonUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    saisonService = TestBed.inject(SaisonService);
    serieService = TestBed.inject(SerieService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Serie query and add missing value', () => {
      const saison: ISaison = { id: 456 };
      const serie: ISerie = { id: 10985 };
      saison.serie = serie;

      const serieCollection: ISerie[] = [{ id: 83450 }];
      jest.spyOn(serieService, 'query').mockReturnValue(of(new HttpResponse({ body: serieCollection })));
      const additionalSeries = [serie];
      const expectedCollection: ISerie[] = [...additionalSeries, ...serieCollection];
      jest.spyOn(serieService, 'addSerieToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ saison });
      comp.ngOnInit();

      expect(serieService.query).toHaveBeenCalled();
      expect(serieService.addSerieToCollectionIfMissing).toHaveBeenCalledWith(serieCollection, ...additionalSeries);
      expect(comp.seriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const saison: ISaison = { id: 456 };
      const serie: ISerie = { id: 87785 };
      saison.serie = serie;

      activatedRoute.data = of({ saison });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(saison));
      expect(comp.seriesSharedCollection).toContain(serie);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Saison>>();
      const saison = { id: 123 };
      jest.spyOn(saisonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ saison });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: saison }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(saisonService.update).toHaveBeenCalledWith(saison);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Saison>>();
      const saison = new Saison();
      jest.spyOn(saisonService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ saison });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: saison }));
      saveSubject.complete();

      // THEN
      expect(saisonService.create).toHaveBeenCalledWith(saison);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Saison>>();
      const saison = { id: 123 };
      jest.spyOn(saisonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ saison });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(saisonService.update).toHaveBeenCalledWith(saison);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackSerieById', () => {
      it('Should return tracked Serie primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSerieById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
