import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-forum',
  imports: [CommonModule],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css'
})
export class ForumComponent {
  topics: ForumTopic[] = [
    {
      id: 1,
      title: 'Impacto de la Tecnología Verde en Comunidades Rurales',
      author: 'María González',
      date: new Date('2024-02-15'),
      summary: 'Análisis sobre cómo las soluciones tecnológicas sostenibles están transformando la vida en zonas rurales...',
      image: 'assets/images/tech-rural.jpg',
      category: 'sustainability'
    },
    {
      id: 2,
      title: 'Biodiversidad Digital: Monitoreo con IA',
      author: 'Carlos Ruiz',
      date: new Date('2024-02-14'),
      summary: 'Explorando nuevas formas de conservación utilizando inteligencia artificial para el seguimiento de especies...',
      image: 'assets/images/biodiversity-ai.jpg',
      category: 'biodiversity'
    },
    // Agrega más tópicos según necesites
  ];
}
interface ForumTopic {
  id: number;
  title: string;
  author: string;
  date: Date;
  summary: string;
  image: string;
  category: string;
}