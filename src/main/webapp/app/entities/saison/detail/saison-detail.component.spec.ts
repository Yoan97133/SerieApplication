import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SaisonDetailComponent } from './saison-detail.component';

describe('Saison Management Detail Component', () => {
  let comp: SaisonDetailComponent;
  let fixture: ComponentFixture<SaisonDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaisonDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ saison: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SaisonDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SaisonDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load saison on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.saison).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
