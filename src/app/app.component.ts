import {Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {RenderService} from "../renderer/render.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('renderContainer') renderContainer: ElementRef;

  constructor(public renderService: RenderService) {}

  ngAfterViewInit(): void {
    this.renderService.initRenderer(this.renderContainer)
  }
}

