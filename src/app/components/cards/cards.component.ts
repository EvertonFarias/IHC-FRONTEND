import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Card {
  id: number;
  name: string;
  type: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  card_images: { image_url: string }[];
  card_prices?: { cardmarket_price?: string }[];
}

interface ApiResponse {
  data: Card[];
  meta?: { next_page?: string };
}

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
  imports: [CommonModule, FormsModule ],
  standalone: true
})
export class CardsComponent implements OnInit {
  cards: Card[] = [];
  searchTerm: string = '';
  selectedType: string = '';
  sortBy: string = 'name';
  pageSize: number = 12;
  currentPage: number = 1;
  totalCards: number = 0;
  loading: boolean = false;
  error: string | null = null;
  cardTypes: string[] = [
    'Effect Monster',
    'Normal Monster',
    'Synchro Monster',
    'XYZ Monster',
    'Fusion Monster',
    'Spell Card',
    'Trap Card'
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchCards();
  }

  fetchCards(offset: number = 0): void {
    this.loading = true;
    this.error = null;
    let url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?num=${this.pageSize}&offset=${offset}`;
    if (this.searchTerm) {
      url += `&fname=${encodeURIComponent(this.searchTerm)}`;
    }
    if (this.selectedType) {
      url += `&type=${encodeURIComponent(this.selectedType)}`;
    }

    this.http.get<ApiResponse>(url).pipe(
      map(response => {
        let cards = response?.data ?? [];
        // Ordenação no front-end
        if (this.sortBy === 'cardmarket_price') {
          cards = cards.slice().sort((a, b) => {
            const priceA = parseFloat(a.card_prices?.[0]?.cardmarket_price ?? '0');
            const priceB = parseFloat(b.card_prices?.[0]?.cardmarket_price ?? '0');
            return priceA - priceB;
          });
        } else if (this.sortBy === 'name') {
          cards = cards.slice().sort((a, b) => a.name.localeCompare(b.name));
        }
        return {
          cards,
          nextPage: response?.meta?.next_page ?? null
        };
      }),
      catchError(error => {
        this.error = 'Erro ao carregar as cartas. Tente novamente mais tarde.';
        this.loading = false;
        return of({ cards: [], nextPage: null });
      })
    ).subscribe({
      next: ({ cards }) => {
        this.cards = cards ?? [];
        this.totalCards = (cards?.length ?? 0) < this.pageSize ? this.currentPage * this.pageSize : (this.currentPage * this.pageSize) + 1;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.fetchCards();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.fetchCards();
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.fetchCards();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    const offset = (page - 1) * this.pageSize;
    this.fetchCards(offset);
  }

  viewCardDetails(cardId: number): void {
    this.router.navigate(['/cartas', cardId]);
  }

}