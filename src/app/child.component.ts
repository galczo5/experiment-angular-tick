import {
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  Input,
  OnChanges, OnDestroy, OnInit
} from '@angular/core';
import {interval, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-child',
  template: `
    <div style="padding: 10px; border: 1px solid;">
      <h1>Child {{id}} [{{timestamp}}]</h1>
      <button (click)="tick()">tick()</button>
      <button (click)="detect()">detectChanges()</button>
      <hr>
      <div style="display: flex; gap: 10px;">
        <app-child style="flex-grow: 1" *ngFor="let childId of childIds" [id]="childId"></app-child>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildComponent implements OnInit, DoCheck, OnChanges, OnDestroy {

  @Input()
  id: string | undefined;

  @Input()
  childIds: Array<string> = [];

  timestamp: number = 0;

  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(
    private readonly applicationRef: ApplicationRef,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  tick() {
    console.log('tick');
    this.applicationRef.tick();
  }

  detect() {
    console.log('detectChanges');
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {
    console.log('ngOnInit', 'ChildComponent', this.id);

    interval(1000)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.timestamp = new Date().getTime();
      });
  }

  ngOnChanges() {
    console.log('ngOnChanges', 'ChildComponent', this.id);
  }

  ngOnDestroy() {
    console.log('ngOnDestroy', 'ChildComponent', this.id);

    this.destroy$.next();
    this.destroy$.complete();
  }

  ngDoCheck() {
    console.log('ngDoCheck', 'ChildComponent', this.id);
  }
}
