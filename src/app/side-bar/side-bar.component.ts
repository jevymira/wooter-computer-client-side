import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  @Output() selectedMemoryChanged = new EventEmitter<number[]>();
  private readonly formBuilder = inject(FormBuilder);

  // https://material.angular.io/components/checkbox/examples#checkbox-reactive-forms
  readonly memory = this.formBuilder.group({
    8: false,
    16: false,
    32: false
  });

  ngOnInit(): void {
    this.memory.valueChanges.subscribe(() => {
      this.selectedMemoryChanged.emit(this.selectedMemory);
    });
  }

  get selectedMemory(): number[] {
    return Object.entries(this.memory.value)
      .filter(([key, value]) => value) // is true
      .map(([key]) => Number.parseInt(key));
  }
}
