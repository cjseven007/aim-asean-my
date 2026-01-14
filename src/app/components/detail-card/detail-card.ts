import { Component, Input } from '@angular/core';

@Component({
  selector: 'cmpnt-detail-card',
  imports: [],
  templateUrl: './detail-card.html',
  styleUrl: './detail-card.css',
})
export class DetailCard {
  @Input() name!: string;           
  @Input() description!: string;    
  @Input() link!: string;           
  @Input() pricing!: string;        
  @Input() image!: string;
}
