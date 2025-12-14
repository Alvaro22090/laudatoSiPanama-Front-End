import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  
  pilares = [
    { icon: 'fas fa-book-open', title: 'Formación', description: 'Capacitación constante sobre la ecología integral y la doctrina social de la iglesia.' },
    { icon: 'fas fa-leaf', title: 'Acción Sostenible', description: 'Iniciativas prácticas para reducir nuestra huella de carbono y restaurar ecosistemas.' },
    { icon: 'fas fa-praying-hands', title: 'Espiritualidad', description: 'Conexión profunda con el Creador a través de la contemplación de la naturaleza.' }
  ];

  valores = [
    { icon: 'fas fa-heart', title: 'Amor', description: 'El motor que impulsa el cuidado por cada criatura de Dios.' },
    { icon: 'fas fa-balance-scale', title: 'Justicia', description: 'Buscamos la equidad para las comunidades más vulnerables al cambio climático.' },
    { icon: 'fas fa-users', title: 'Solidaridad', description: 'Caminamos juntos, sin dejar a nadie atrás en esta misión ecológica.' },
    { icon: 'fas fa-dove', title: 'Paz', description: 'Construimos armonía entre la humanidad y el medio ambiente.' }
  ];

}