import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EpisodeDetailComponent } from './episode-detail.component';

describe('Episode Management Detail Component', () => {
  let comp: EpisodeDetailComponent;
  let fixture: ComponentFixture<EpisodeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EpisodeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ episode: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EpisodeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EpisodeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load episode on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.episode).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
