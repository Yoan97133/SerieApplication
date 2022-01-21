import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SerieDetailComponent } from './serie-detail.component';

describe('Serie Management Detail Component', () => {
  let comp: SerieDetailComponent;
  let fixture: ComponentFixture<SerieDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SerieDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ serie: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SerieDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SerieDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load serie on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.serie).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
