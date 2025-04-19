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
export class AppComponent {
  title = 'frontend';



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
