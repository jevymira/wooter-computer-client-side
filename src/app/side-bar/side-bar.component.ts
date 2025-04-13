import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
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
export class SideBarComponent {
  private readonly _formBuilder = inject(FormBuilder);

  readonly _memory = this._formBuilder.group({
    has8: false,
    has16: false,
    has32: false
  });
}
