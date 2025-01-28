import { Component, OnInit } from '@angular/core';
import {IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem} from '@ionic/angular/standalone';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, NgForOf],
  standalone: true
})
export class HomePage implements OnInit {
  public cards: any[] = [];
  cardPairs: { name: string; number: string }[][] = [];

  constructor() {}

  private groupCardsIntoPairs(): void {
    for (let i = 0; i < this.cards.length; i += 2) {
      this.cardPairs.push(this.cards.slice(i, i + 2));
    }
  }

  ngOnInit() {
    this.cards = [
      {
        name: 'Card A',
        number: '123456'
      },
      {
        name: 'Card B',
        number: '123456'
      },
      {
        name: 'Card C',
        number: '123456'
      },
      {
        name: 'Card D',
        number: '123456'
      },
      {
        name: 'Card E',
        number: '123456'
      },
      {
        name: 'Card F',
        number: '123456'
      }
    ]
    this.groupCardsIntoPairs();
  }
}
