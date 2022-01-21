import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SerieService } from '../service/serie.service';
import { ISerie, Serie } from '../serie.model';
import { ISaison } from 'app/entities/saison/saison.model';
import { SaisonService } from 'app/entities/saison/service/saison.service';

import { SerieUpdateComponent } from './serie-update.component';

describe('Serie Management Update Component', () => {
  let comp: SerieUpdateComponent;
  let fixture: ComponentFixture<SerieUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let serieService: SerieService;
  let saisonService: SaisonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SerieUpdateComponent],
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
      .overrideTemplate(SerieUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SerieUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    serieService = TestBed.inject(SerieService);
    saisonService = TestBed.inject(SaisonService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Saison query and add missing value', () => {
      const serie: ISerie = { id: 456 };
      const saison: ISaison = { id: 82849 };
      serie.saison = saison;

      const saisonCollection: ISaison[] = [{ id: 37814 }];
      jest.spyOn(saisonService, 'query').mockReturnValue(of(new HttpResponse({ body: saisonCollection })));
      const additionalSaisons = [saison];
      const expectedCollection: ISaison[] = [...additionalSaisons, ...saisonCollection];
      jest.spyOn(saisonService, 'addSaisonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ serie });
      comp.ngOnInit();

      expect(saisonService.query).toHaveBeenCalled();
      expect(saisonService.addSaisonToCollectionIfMissing).toHaveBeenCalledWith(saisonCollection, ...additionalSaisons);
      expect(comp.saisonsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const serie: ISerie = { id: 456 };
      const saison: ISaison = { id: 10755 };
      serie.saison = saison;

      activatedRoute.data = of({ serie });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(serie));
      expect(comp.saisonsSharedCollection).toContain(saison);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Serie>>();
      const serie = { id: 123 };
      jest.spyOn(serieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serie }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(serieService.update).toHaveBeenCalledWith(serie);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Serie>>();
      const serie = new Serie();
      jest.spyOn(serieService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: serie }));
      saveSubject.complete();

      // THEN
      expect(serieService.create).toHaveBeenCalledWith(serie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Serie>>();
      const serie = { id: 123 };
      jest.spyOn(serieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ serie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(serieService.update).toHaveBeenCalledWith(serie);
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
