import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
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

  checkedMemory: number[] = [];
  category: string = '';

  // https://material.angular.io/components/checkbox/examples#checkbox-reactive-forms
  filterForm: FormGroup = this.formBuilder.group({
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
    this.activatedRoute.params.subscribe(params => {
      // Clear selections; e.g., when navigating to
      // "offers/laptops" away from "offers/desktops".
      if (this.category != params['category']) {
        this.category = params['category'];
        this.filterForm.reset(undefined, { emitEvent: false });
        // undefined: defaults set
      }
    });
  }

  ngAfterViewInit() { 
    this.activatedRoute.queryParams.subscribe(params => {
      let memoryParams: string[] = (
        Array.isArray(params['memory']) // edge case: single (non-array) param
          ? params['memory']   
          : [params['memory']]
      );
      let storageParams: string[] = (
      Array.isArray(params['storage'])
        ? params['storage']   
        : [params['storage']]
      ); 
      // restore selections (e.g., when returning from selected offer page)
      // optional chaining with ? prevents TypeError when form control null/undefined
      if (memoryParams.length != 0) {
        memoryParams.forEach(selected => this.memory.get((selected))?.setValue(true,
          { emitEvent: false })); // prevents call that reset page to 0
      }
      if (storageParams.length != 0) { // ERROR TypeError: Cannot read properties of null
        storageParams.forEach(selected => this.storage.get(selected)?.setValue(true,
          { emitEvent: false })); 
      }
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
