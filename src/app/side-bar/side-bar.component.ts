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
  @Output() selectedMemoryChanged = new EventEmitter<{memory: number[]}>();
  private readonly formBuilder = inject(FormBuilder);

  constructor(private activatedRoute: ActivatedRoute) {}

  // https://material.angular.io/components/checkbox/examples#checkbox-reactive-forms
  readonly filterForm = this.formBuilder.group({
    memory: this.formBuilder.group({
      8: false,
      16: false,
      32: false
    })
  });

  ngOnInit(): void {
    this.memory.valueChanges.subscribe(() => {
      this.selectedMemoryChanged.emit({memory: this.selectedMemory});
    });
    this.activatedRoute.queryParams.subscribe(params => {
      let mem: string[] = (params['memory']) || [];
      // restore selections (e.g., when returning from selected offer page)
      mem.forEach(selected => this.filterForm.get(selected)?.setValue(true,
        { emitEvent: false })); // prevents call that reset page to 0
    });
  }

  get memory() {
    return this.filterForm.get('memory') as FormGroup;
  }

  get selectedMemory(): number[] {
    return Object.entries(this.memory.value)
      .filter(([key, value]) => value) // is true
      .map(([key]) => Number.parseInt(key));
  }
}
