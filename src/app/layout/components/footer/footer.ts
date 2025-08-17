import { Component } from '@angular/core';
import { Logo } from '../../../components/logo/logo';

@Component({
  selector: 'app-footer',
  imports: [Logo],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  public fullYear = new Date().getFullYear();
}
