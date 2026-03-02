import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  pilares = [
    {
      icon: 'fas fa-book-open',
      title: 'Formación',
      description: 'Capacitación constante sobre ecología integral y doctrina social de la Iglesia, inspirados en el mensaje de Laudato Si\'.'
    },
    {
      icon: 'fas fa-leaf',
      title: 'Acción Sostenible',
      description: 'Iniciativas prácticas para reducir nuestra huella de carbono, restaurar ecosistemas y promover estilos de vida sostenibles.'
    },
    {
      icon: 'fas fa-praying-hands',
      title: 'Espiritualidad',
      description: 'Conversión ecológica profunda: conexión con el Creador a través de la contemplación y la comunión con toda la Creación.'
    },
    {
      icon: 'fas fa-hands-helping',
      title: 'Red y Comunidad',
      description: 'Actuamos en red con organizaciones, miembros comunitarios y personas de buena voluntad, guiados por la subsidiariedad.'
    }
  ];

  valores = [
    {
      icon: 'fas fa-heart',
      title: 'Amor',
      description: 'El amor por cada criatura de Dios y por nuestra casa común es el motor que impulsa cada acción del movimiento.'
    },
    {
      icon: 'fas fa-balance-scale',
      title: 'Justicia',
      description: 'Buscamos la equidad ambiental y social, especialmente para las comunidades más vulnerables al cambio climático.'
    },
    {
      icon: 'fas fa-users',
      title: 'Solidaridad',
      description: 'Caminamos juntos en la unidad de la diversidad, sin dejar a nadie atrás en esta misión ecológica.'
    },
    {
      icon: 'fas fa-dove',
      title: 'Paz',
      description: 'Construimos armonía entre la humanidad y el medio ambiente, respondiendo al clamor de la tierra y de los pobres.'
    }
  ];
}
