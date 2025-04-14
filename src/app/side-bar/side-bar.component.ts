import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-side-bar',
  imports: [
    MatSidenavModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  // FIXME: prevents DesktopsComponent initialization
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideBarComponent implements OnInit {
  @Output() selectedFiltersChanged =
    new EventEmitter<{memory: number[]; storage: number[]}>();
  private readonly formBuilder = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);

  // category: string = '';

  // https://material.angular.io/components/checkbox/examples#checkbox-reactive-forms
  readonly filterForm = this.formBuilder.group({
    memory: this.formBuilder.group({
      8: this.formBuilder.control(false), // define default, for .reset()
      16: this.formBuilder.control(false),
      32: this.formBuilder.control(false)
    }),
    storage: this.formBuilder.group({
      256: this.formBuilder.control(false),
      512: this.formBuilder.control(false),
      1000: this.formBuilder.control(false)
    })
  });

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.selectedFiltersChanged.emit({
        memory: this.selectedMemory,
        storage: this.selectedStorage
      });
    });
    this.activatedRoute.queryParams.subscribe(params => {
      let mem: string[] = (params['memory']) || [];
      let stor: string[] = (params['storage']) || [];
      // restore selections (e.g., when returning from selected offer page)
      mem.forEach(selected => this.memory.get(selected)!.setValue(true,
        { emitEvent: false })); // prevents call that reset page to 0
      stor.forEach(selected => this.storage.get(selected)!.setValue(true,
        { emitEvent: false }));
      /*
      if (this.category != params['category']) {
        this.category = params['category'];
        this.filterForm.reset(undefined, { emitEvent: false });
        // undefined: defaults set
      }
      */
    });
  }

  get memory() {
    return this.filterForm.get('memory') as FormGroup;
  }

  get storage() {
    return this.filterForm.get('storage') as FormGroup;
  }

  get selectedMemory(): number[] {
    return Object.entries(this.memory.value)
      .filter(([option, isChecked]) => isChecked) // is true
      .map(([checked]) => Number.parseInt(checked));
  }

  get selectedStorage(): number[] {
    return Object.entries(this.storage.value)
      .filter(([option, isChecked]) => isChecked)
      .map(([checked]) => Number.parseInt(checked));
  }

}
