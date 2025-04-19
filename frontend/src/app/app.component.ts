import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-root',
  imports: [MatTabsModule, MatGridListModule, MatTableModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit{
  title = 'frontend';
  @ViewChild('drawingCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000000'; // Color del pincel (negro)
  }

  startDrawing(e: MouseEvent) {
    this.isDrawing = true;
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    this.lastX = e.clientX - rect.left;
    this.lastY = e.clientY - rect.top;
  }

  draw(e: MouseEvent) {
    if (!this.isDrawing) return;
    
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();

    this.lastX = currentX;
    this.lastY = currentY;
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clearCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  saveAsPNG() {
    const canvas = this.canvasRef.nativeElement;
    const link = document.createElement('a');
    link.download = 'dibujo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
  

}
