// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { UserDTO, UserService } from '../../../services/UserService';

interface UserStats {
  totalCards: number;
  totalDecks: number;
  totalBattles: number;
  wins: number;
  winRate: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: Date;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ProfileComponent implements OnInit {
  user$: Observable<UserDTO | null>;
  isEditing: boolean = false;
  editForm: any = {};
  

  userStats!: UserStats;
  achievements: Achievement[] = [];
  recentActivity: any[] = [];
  bio: string = '';
  favoriteCard: string = '';
  location: string = '';
  joinDate: Date = new Date();

  constructor(private userService: UserService) {
    this.user$ = this.userService.user$;
    this.generateRandomData();
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.editForm = {
          login: user.login,
          email: user.email,
          bio: this.bio,
          favoriteCard: this.favoriteCard,
          location: this.location
        };
      }
    });
  }

  private generateRandomData(): void {
    // Gerar estatísticas aleatórias
    const totalBattles = Math.floor(Math.random() * 300) + 50;
    const wins = Math.floor(totalBattles * (0.4 + Math.random() * 0.4)); // 40-80% win rate
    
    this.userStats = {
      totalCards: Math.floor(Math.random() * 2000) + 500,
      totalDecks: Math.floor(Math.random() * 15) + 3,
      totalBattles: totalBattles,
      wins: wins,
      winRate: Math.round((wins / totalBattles) * 100 * 10) / 10
    };

    // Gerar dados pessoais fictícios
    const bios = [
      'Duelista apaixonado por estratégias complexas e combos devastadores.',
      'Colecionador de cartas raras e entusiasta de duelos competitivos.',
      'Jogador veterano sempre em busca do deck perfeito.',
      'Especialista em arquétipos únicos e estratégias inovadoras.',
      'Duelista casual que aprecia a arte e história por trás das cartas.'
    ];

    const cards = [
      'Dragão Branco de Olhos Azuis',
      'Mago Negro',
      'Exodia, o Proibido',
      'Dragão Alado de Ra',
      'Obelisco, o Atormentador',
      'Slifer, o Dragão Celeste',
      'Kuriboh',
      'Guerreiro Celta da Espada',
      'Máquina Antiga - Golem',
      'Cavaleiro Gaia, o Feroz'
    ];

    const locations = [
      'São Paulo, Brasil',
      'Rio de Janeiro, Brasil',
      'Belo Horizonte, Brasil',
      'Porto Alegre, Brasil',
      'Salvador, Brasil',
      'Brasília, Brasil',
      'Curitiba, Brasil',
      'Recife, Brasil'
    ];

    this.bio = bios[Math.floor(Math.random() * bios.length)];
    this.favoriteCard = cards[Math.floor(Math.random() * cards.length)];
    this.location = locations[Math.floor(Math.random() * locations.length)];
    
    // Data de entrada aleatória nos últimos 2 anos
    const randomDays = Math.floor(Math.random() * 730);
    this.joinDate = new Date();
    this.joinDate.setDate(this.joinDate.getDate() - randomDays);

    
    this.achievements = [
      {
        id: '1',
        name: 'Primeiro Duelo',
        description: 'Complete seu primeiro duelo',
        icon: 'fas fa-fist-raised', 
        unlocked: true,
        unlockedDate: new Date(this.joinDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Colecionador',
        description: 'Possua mais de 1000 cartas',
        icon: 'fas fa-coins', 
        unlocked: this.userStats.totalCards > 1000,
        unlockedDate: this.userStats.totalCards > 1000 
          ? new Date(this.joinDate.getTime() + Math.random() * 200 * 24 * 60 * 60 * 1000) 
          : undefined
      },
      {
        id: '3',
        name: 'Vitorioso',
        description: 'Ganhe 100 duelos',
        icon: 'fas fa-trophy',
        unlocked: this.userStats.wins >= 100,
        unlockedDate: this.userStats.wins >= 100 
          ? new Date(this.joinDate.getTime() + Math.random() * 300 * 24 * 60 * 60 * 1000) 
          : undefined
      },
      {
        id: '4',
        name: 'Mestre dos Decks',
        description: 'Crie 10 decks diferentes',
        icon: 'fas fa-layer-group', 
        unlocked: this.userStats.totalDecks >= 10,
        unlockedDate: this.userStats.totalDecks >= 10 
          ? new Date(this.joinDate.getTime() + Math.random() * 150 * 24 * 60 * 60 * 1000) 
          : undefined
      },
      {
        id: '5',
        name: 'Lenda',
        description: 'Alcance 70% de taxa de vitória',
        icon: 'fas fa-crown',
        unlocked: this.userStats.winRate >= 70,
        unlockedDate: this.userStats.winRate >= 70 
          ? new Date(this.joinDate.getTime() + Math.random() * 400 * 24 * 60 * 60 * 1000) 
          : undefined
      },
      {
        id: '6',
        name: 'Veterano',
        description: 'Jogue por 6 meses consecutivos',
        icon: 'fas fa-calendar-alt', // Alterado de 'fas fa-calendar'
        unlocked: (new Date().getTime() - this.joinDate.getTime()) > (180 * 24 * 60 * 60 * 1000),
        unlockedDate: (new Date().getTime() - this.joinDate.getTime()) > (180 * 24 * 60 * 60 * 1000)
          ? new Date(this.joinDate.getTime() + 180 * 24 * 60 * 60 * 1000)
          : undefined
      }
    ];

    // Gerar atividades recentes
    const activities = [
      { type: 'battle', description: 'Venceu duelo contra DragonMaster' },
      { type: 'battle', description: 'Perdeu duelo contra CardKing' },
      { type: 'battle', description: 'Venceu duelo contra DuelMaster' },
      { type: 'card', description: `Adquiriu ${cards[Math.floor(Math.random() * cards.length)]}` },
      { type: 'card', description: `Adquiriu ${cards[Math.floor(Math.random() * cards.length)]}` },
      { type: 'deck', description: 'Criou novo deck "Máquinas Ancientes"' },
      { type: 'deck', description: 'Criou novo deck "Dragões Supremos"' },
      { type: 'deck', description: 'Criou novo deck "Guerreiros Místicos"' },
      { type: 'achievement', description: 'Desbloqueou conquista "Colecionador"' },
      { type: 'achievement', description: 'Desbloqueou conquista "Primeiro Duelo"' }
    ];

    const times = ['2 horas atrás', '5 horas atrás', '1 dia atrás', '3 dias atrás', '1 semana atrás'];
    
    this.recentActivity = [];
    for (let i = 0; i < 4; i++) {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      this.recentActivity.push({
        ...activity,
        time: times[i] || `${i + 1} dias atrás`
      });
    }
  }

  startEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
    // Reset form to original values
    this.user$.subscribe(user => {
      if (user) {
        this.editForm = {
          login: user.login,
          email: user.email,
          bio: this.bio,
          favoriteCard: this.favoriteCard,
          location: this.location
        };
      }
    });
  }

  saveProfile(): void {
    // Atualizar dados locais fictícios
    this.bio = this.editForm.bio;
    this.favoriteCard = this.editForm.favoriteCard;
    this.location = this.editForm.location;
    
    // Aqui você salvaria os dados reais do usuário no backend
    console.log('Salvando perfil:', {
      login: this.editForm.login,
      email: this.editForm.email
    });
    
    this.isEditing = false;
    // Simular atualização dos dados reais
    // this.userService.updateUser({ login: this.editForm.login, email: this.editForm.email });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Aqui você faria upload da imagem
      console.log('Upload da imagem:', file);
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'battle': return 'fas fa-fist-raised'; 
      case 'card': return 'fas fa-magic';
      case 'deck': return 'fas fa-layer-group';
      case 'achievement': return 'fas fa-trophy';
      default: return 'fas fa-info-circle';
    }
  }

  formatJoinDate(): string {
    return this.joinDate.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long'
    });
  }
}