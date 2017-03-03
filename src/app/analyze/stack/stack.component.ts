import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'alm-stack',
  templateUrl: 'stack.component.html',
  styleUrls: ['./stack.component.scss']
})

export class StackComponent {
  constructor(private router: Router) { }
}
