import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [MatTabsModule, MatGridListModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'frontend';
  imagenSeleccionada: string | ArrayBuffer | null = null;


  //// CANVAS
  
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;

  

  ngAfterViewInit() {
    this.setupCanvas();
  }

  setupCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = 280;
    canvas.height = 280;
    
    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineWidth = 15;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = 'black';
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    this.draw(event);
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing) return;
    
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  stopDrawing() {
    this.isDrawing = false;
    this.ctx.beginPath();
  }

  clearCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.ctx.beginPath();
  }

  ////// FIN CANVAS

  //////      INICIO CONSUMO HTTP

  constructor(private http: HttpClient) {}

  evaluarNumero() {
    const canvas = this.canvasRef.nativeElement;
    
    canvas.toBlob(blob => {
      if (blob) {
        const formData = new FormData();
        formData.append('image', blob, 'canvas-image.png');
  
        this.http.post('http://localhost:3000/predict-number', formData)
          .subscribe({
            next: (res:any) => {
              console.log('Respuesta del backend:', res);
              this.resultadoNumero = res;
              // Aquí puedes actualizar resultadoNumero con la respuesta del backend
            },
            error: (err) => {
              console.error('Error al enviar imagen:', err);
            }
          });
      }
    }, 'image/png');
  }
  

  /////     FIN CONSUMO HTTP

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.imagenSeleccionada = reader.result;
      reader.readAsDataURL(file);
    }
  }


  ////      INICIO CONSUMO POR IMAGEN
  // imagenSeleccionada: string | ArrayBuffer | null = null;
archivoSeleccionado: File | null = null;

onImageSelected2(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.archivoSeleccionado = file;

    const reader = new FileReader();
    reader.onload = e => this.imagenSeleccionada = reader.result;
    reader.readAsDataURL(file);
  }
}

analizarRostro(): void {
  if (!this.archivoSeleccionado) {
    console.warn('No se ha seleccionado ninguna imagen.');
    return;
  }

  const formData = new FormData();
  formData.append('image', this.archivoSeleccionado);

  this.http.post('http://localhost:3000/predict-face', formData)
    .subscribe({
      next: (res:any) => {
        console.log('Respuesta del backend (rostro):', res);
        this.resultadoRostro = res;
        // Aquí puedes actualizar resultadoRostro con los datos reales
        // this.resultadoRostro = res;
      },
      error: (err) => {
        console.error('Error al analizar rostro:', err);
      }
    });
}


  ////      FIN CONSUMO POR IMAGEN



  resultadoNumero = { 
    prediction: 2, 
    probabilities: 
    [{ number: 0, probability: 17.64 }, { number: 1, probability: 3.44 }, { number: 2, probability: 23.38 }, { number: 3, probability: 3.27 }, { number: 4, probability: 6.98 }, { number: 5, probability: 18.93 }, { number: 6, probability: 14.05 }, { number: 7, probability: 10.32 }, { number: 8, probability: 1.66 }, { number: 9, probability: 0.32 }] }


  resultadoRostro = {
    cantidadRostros: 1,
    prediction: "enojado",
    probabilities: [
      {
        emotion: "feliz",
        probability: 20.51
      },
      {
        emotion: "sorpresa",
        probability: 16.97
      },
      {
        emotion: "neutral",
        probability: 5.4
      },
      {
        emotion: "enojado",
        probability: 26.69
      },
      {
        emotion: "asco",
        probability: 17.23
      },
      {
        emotion: "miedo",
        probability: 13.09
      },
      {
        emotion: "triste",
        probability: 0.12
      }
    ]
  }
}
