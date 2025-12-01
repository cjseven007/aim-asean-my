import { Component } from '@angular/core';
import { DetailCard } from '../../components/detail-card/detail-card';
import tools from '../../data/tools-link.json';

@Component({
  selector: 'app-tools-page',
  imports: [DetailCard],
  templateUrl: './tools-page.html',
  styleUrl: './tools-page.css',
})
export class ToolsPage {
  toolsList = tools;

  // Get all unique categories in alphabetical order
  categories = Array.from(new Set(this.toolsList.map(t => t.category))).sort();

  // Filter tools by category
  toolsByCategory(category: string) {
    return this.toolsList.filter(tool => tool.category === category);
  }
}
