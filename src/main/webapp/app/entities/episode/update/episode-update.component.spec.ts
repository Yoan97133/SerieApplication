import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EpisodeService } from '../service/episode.service';
import { IEpisode, Episode } from '../episode.model';

import { EpisodeUpdateComponent } from './episode-update.component';

describe('Episode Management Update Component', () => {
  let comp: EpisodeUpdateComponent;
  let fixture: ComponentFixture<EpisodeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let episodeService: EpisodeService;

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const episode: IEpisode = { id: 456 };

      activatedRoute.data = of({ episode });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(episode));
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
});
