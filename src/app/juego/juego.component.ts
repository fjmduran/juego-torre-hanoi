import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {

  public discInAir: BehaviorSubject<any>=new BehaviorSubject(null);
  
  constructor() { }

  ngOnInit(): void {
  }

  putDiscInAir(event:number|null){    
    this.discInAir.next(event);
  }
}
