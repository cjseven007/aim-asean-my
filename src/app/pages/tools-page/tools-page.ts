import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailCard } from '../../components/detail-card/detail-card';
import tools from '../../../data/tools-link.json';
import {Tool} from '../../models/tool.models'

@Component({
  standalone:true,
  selector: 'app-tools-page',
  imports: [DetailCard, CommonModule],
  templateUrl: './tools-page.html',
  styleUrl: './tools-page.css',
})
export class ToolsPage {
  toolsList: Tool[] = tools as Tool[];

  // Get all unique categories in alphabetical order
  categories = Array.from(new Set(this.toolsList.map(t => t.category))).sort();

  // Filter tools by category
  toolsByCategory(category: string) {
    return this.toolsList.filter(tool => tool.category === category);
  }

  selectedCategory: string = this.categories[0];

  // Tools to show based on the selected category
  get visibleTools(): Tool[] {
    return this.toolsList.filter(
      (tool) => tool.category === this.selectedCategory
    );
  }

  // Handler when clicking a chip
  selectCategory(category: string) {
    this.selectedCategory = category;
  }
}
