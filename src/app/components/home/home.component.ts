import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { UserDTO, UserService } from '../../services/UserService';
import { Router } from '@angular/router';

interface Categoria {
  nome: string;
  imagem: string;
  rota: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // Note: styleUrls (plural)
})

export class HomeComponent implements OnInit{
  emailNewsletter: string = '';
  
 categorias: Categoria[] = [
    {
      nome: 'Pacotes De Reforço',
      imagem: 'assets/img/categoria01.png',
      rota: 'pacotes-reforco'
    },
    {
      nome: 'Decks Estruturais',
      imagem: 'assets/img/categoria02.png',
      rota: 'decks-estruturais'
    },
    {
      nome: 'Latas',
      imagem: 'assets/img/categoria03.png',
      rota: 'latas'
    },
    {
      nome: 'Decks Iniciais',
      imagem: 'assets/img/categoria04.png',
      rota: 'decks-iniciais'
    },
    {
      nome: 'Outros',
      imagem: 'assets/img/categoria05.png',
      rota: 'outros'
    },
    {
      nome: 'Duelo De Velocidade',
      imagem: 'assets/img/categoria06.png',
      rota: 'duelo-velocidade'
    },
    {
      nome: 'Pacotes De Torneio OTS',
      imagem: 'assets/img/categoria07.png',
      rota: 'pacotes-ots'
    },
    {
      nome: 'Acessórios',
      imagem: 'assets/img/categoria08.png',
      rota: 'acessorios'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Inicialização do componente
  }

  montarDeck(): void {
    // Navegar para a página de montagem de deck
    this.router.navigate(['/montar-deck']);
  }

  navegarPara(rota: string): void {
    // Navegar para a rota especificada
    this.router.navigate([`/${rota}`]);
  }

  abrirRede(rede: string): void {
    // URLs das redes sociais
    const redesSociais: { [key: string]: string } = {
      discord: 'https://discord.gg/dualShop',
      youtube: 'https://youtube.com/dualShop',
      twitter: 'https://twitter.com/dualShop',
      instagram: 'https://instagram.com/dualShop'
    };

    if (redesSociais[rede]) {
      window.open(redesSociais[rede], '_blank');
    }
  }

  inscreverNewsletter(event: Event): void {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
    const email = emailInput.value;
    
    if (email && this.isValidEmail(email)) {
      // Aqui você faria a chamada para seu serviço de newsletter
      console.log('Email inscrito:', email);
      
      // Simular sucesso
      alert('Email inscrito com sucesso!');
      emailInput.value = '';
    } else {
      alert('Por favor, insira um email válido.');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}