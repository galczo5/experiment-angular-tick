import {ApplicationRef, ChangeDetectorRef, Component, DoCheck, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {interval, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-root',
  template: `
    <div style="padding: 10px; border: 1px solid;">
      <h1>Parent [{{timestamp}}]</h1>
      <button (click)="tick()">tick()</button>
      <button (click)="detect()">detectChanges()</button>
      <hr>
      <div style="display: flex; gap: 10px;">
        <app-child style="flex-grow: 1" id="1"></app-child>
        <app-child style="flex-grow: 1" id="2" [childIds]="['3', '4']"></app-child>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit, DoCheck, OnChanges, OnDestroy {

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
    console.log('ngOnInit', 'AppComponent');

    interval(1000)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.timestamp = new Date().getTime();
      });
  }

  ngOnDestroy() {
    console.log('ngOnDestroy', 'AppComponent');

    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges() {
    console.log('ngOnChanges', 'AppComponent');
  }

  ngDoCheck() {
    console.log('ngDoCheck', 'AppComponent');
  }
}
