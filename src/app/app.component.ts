import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { GridComponent } from './grid/grid.component';
import { KonvaComponent } from './konva/konva.component';
import { ContextMenuService } from './services/context-menu.service';
import { ToolbarComponent } from './toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [KonvaComponent, RouterOutlet, ToolbarComponent, GridComponent, ContextMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements AfterViewInit {
  title = 'yms_light';
  @ViewChild('contextMenu') contextMenu!: ContextMenuComponent;

  constructor(private contextMenuService: ContextMenuService) {
  }

  ngAfterViewInit() {
    this.contextMenuService.inject(this.contextMenu);
  }
}
