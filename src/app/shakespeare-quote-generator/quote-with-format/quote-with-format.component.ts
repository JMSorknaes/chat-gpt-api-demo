import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteData } from '../shakespeare-quote.service';

@Component({
  selector: 'quote-with-format',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule],
  template: `
    <ng-container *ngIf="quote != null">
      <mat-card-header>
        <mat-card-title
          > {{ quote.charName }} ({{ quote.charCurrentHp }}) vs. {{ quote.monsterName }} ({{ quote.monsterCurrentHp }})</mat-card-title
        >
        <mat-card-subtitle>
          <span
            >In a battle to the death!
            </span
          >
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <mat-divider class="my-5"></mat-divider>
        <p class="text-lg">{{  quote.lastRound }}</p>
      </mat-card-content>
    </ng-container>
  `,
})
export class QuoteWithFormatComponent {
  @Input({ required: true }) quote: QuoteData | null = null;
  @Input({ required: true }) style: string = '';
}
