import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-stats-widget',
  imports: [],
  templateUrl: './stats-widget.html',
  styleUrl: './stats-widget.scss',
})
export class StatsWidget {
  public text = input.required<string>();
  public score = input.required<number>();
  public icon = input.required<string>();
  public twClass = input<string>('text-blue-500');

  public className = computed(() => `${this.icon()}  ${this.twClass()}`);
}
