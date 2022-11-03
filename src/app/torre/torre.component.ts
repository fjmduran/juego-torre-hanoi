import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-torre',
  templateUrl: './torre.component.html',
  styleUrls: ['./torre.component.css'],
})
export class TorreComponent implements OnInit {
  @Input() public discs: number[] = [];
  @Input() public numberOfDiscs: number = 0;
  @Input() public $discInAir: BehaviorSubject<any>=new BehaviorSubject(null);
  private discInAir: number | null = null;

  @Output() outputDisc = new EventEmitter<number|null>();

  @ViewChildren('discos') components!: QueryList<ElementRef>;

  private watchdogDiscs$!: Subscription;
  private watchdogDisInAir$!: Subscription;

  private startTower: boolean = false;

  constructor(private rederer2: Renderer2) {}
  ngOnDestroy(): void {
    if (this.watchdogDiscs$) this.watchdogDiscs$.unsubscribe();
    if (this.watchdogDisInAir$) this.watchdogDisInAir$.unsubscribe();
  }

  ngOnInit(): void {
    const _discs = [...this.discs];
    if (_discs.length > 0) {
      this.startTower = true;
    }

    this.watchdogDisInAir$ = this.$discInAir.subscribe((discInAir) => {
      if (discInAir !== null && this.discInAir !== null) return;

      if (discInAir === null && this.discInAir! >= 0) {
        //acabo de detectar que quitan el disco del aire
        if (this.discInAirIsMy()) {
          this.discs.pop();
        } else {
        }
      }
      this.discInAir = discInAir;
      this.isSolvedProblem();
    });
  }

  ngAfterViewInit() {
    this.drawDiscs();
    this.watchdogDiscs$ = this.components.changes.subscribe((data) => {
      this.drawDiscs();
    });
  }

  public isSolvedProblem(): boolean {
    if (!this.startTower && this.discs.length === this.numberOfDiscs) {
      return true;
    }
    return false;
  }

  private drawDiscs() {
    this.components.forEach((disc) => {
      const nativeElement = disc.nativeElement;
      disc.nativeElement.id = nativeElement.innerText;
      nativeElement.innerText = '';
      this.setColor(nativeElement);
    });
  }

  public goAHead(): void {
    if (this.isSolvedProblem()) return;
    if (this.anyDiscInAir()) {
      if (this.discInAirIsMy()) {
        const lastElement = this.components.length - 1;
        const nativeElement =
          this.components.toArray()[lastElement].nativeElement;
        this.rederer2.removeStyle(nativeElement, 'top');
        this.rederer2.setStyle(nativeElement, 'position', 'static');
        this.outputDisc.emit(null);
      } else {
        if (this.canInsertDisc()) {
          if(this.discInAir) this.discs.push(this.discInAir);
          this.$discInAir.next(null);
        }
      }
    } else {
      if (this.components.length === 0) return;
      const lastIndex = this.components.length - 1;
      const nativeElement = this.components.toArray()[lastIndex].nativeElement;
      this.rederer2.setStyle(nativeElement, 'position', 'absolute');
      this.rederer2.setStyle(nativeElement, 'top', '0');
      this.outputDisc.emit(this.discs[lastIndex]);
    }
  }

  private canInsertDisc(): boolean {
    if (this.discs.length === 0) return true;
    if (this.discInAir! > this.discs[this.discs.length - 1]) return true;
    return false;
  }

  private discInAirIsMy(): boolean {
    if (!this.components || this.components.length === 0) return false;
    const lastElement = this.components.length - 1;
    const nativeElement = this.components.toArray()[lastElement].nativeElement;
    if (nativeElement.style.top === '0px') return true;
    return false;
  }

  private anyDiscInAir(): boolean {
    return this.discInAir !== null;
  }

  private setColor(disc: any): void {
    switch (disc.id) {
      case '0': //rojo
        this.rederer2.setStyle(
          disc,
          'background-color',
          'rgba(255, 0, 0, 0.8)'
        );
        this.rederer2.setStyle(disc, 'border', 'solid rgb(161, 0, 0)');
        this.rederer2.setStyle(disc, 'width', '90%');
        break;
      case '1': //amarillo
        this.rederer2.setStyle(
          disc,
          'background-color',
          'rgba(234, 255, 1, 0.8)'
        );
        this.rederer2.setStyle(disc, 'border', 'solid rgb(128, 139, 3)');
        this.rederer2.setStyle(disc, 'width', '80%');
        break;
      case '2': //verde
        this.rederer2.setStyle(
          disc,
          'background-color',
          'rgba(53, 159, 0, 0.8)'
        );
        this.rederer2.setStyle(disc, 'border', 'solid rgb(55, 160, 0)');
        this.rederer2.setStyle(disc, 'width', '70%');
        break;
      case '3': //azul
        this.rederer2.setStyle(
          disc,
          'background-color',
          'rgba(0, 55, 220, 0.8)'
        );
        this.rederer2.setStyle(disc, 'border', 'solid rgb(0, 55, 220)');
        this.rederer2.setStyle(disc, 'width', '60%');
        break;
      case '4': //white
        this.rederer2.setStyle(
          disc,
          'background-color',
          'rgba(75, 0, 130, 0.8)'
        );
        this.rederer2.setStyle(disc, 'border', 'solid rgb(75,0,130)');
        this.rederer2.setStyle(disc, 'width', '50%');
        break;

      default:
        break;
    }
  }
}
