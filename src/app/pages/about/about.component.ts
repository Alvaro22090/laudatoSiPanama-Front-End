import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  activeSection: string = 'movimiento';

  activities: Activity[] = [
    {
      title: "Circulos Laudato Si",
      description: "Encuentros comunitarios para la reflexión y acción ambiental"
    },
    {
      title: "Conversión ecológica",
      description: "Profundizando en nuestra relación con Dios y el cuidado de la creación"
    },
    {
      title: "Semillas de cambio",
      description: "Promoviendo una cultura ecológica entre jóvenes y niños"
    },
    {
      title: "Juntos por el bien común",
      description: "Acciones comunitarias y retiros ecológicos para el cuidado de la creación"
    }
  ];

  values: Value[] = [
    {
      icon: "fas fa-seedling",
      title: "Ecología integral",
      description: "Enfoque que une el cuidado ambiental, la justicia social y el bienestar humano en un equilibrio integral."
    },
    {
      icon: "fas fa-balance-scale",
      title: "Justicia social y ambiental",
      description: "Garantizar equidad en el acceso a recursos y proteger el medio ambiente para todos."
    },
    {
      icon: "fas fa-hands-helping",
      title: "Solidaridad con los más vulnerables",
      description: "Apoyar activamente a quienes sufren por la degradación ambiental y la exclusión."
    },
    {
      icon: "fas fa-recycle",
      title: "Conversión ecológica",
      description: "Transformación hacia un estilo de vida sostenible y respetuoso con la creación."
    },
    {
      icon: "fas fa-users",
      title: "Colaboración y comunidad",
      description: "Trabajar juntos para enfrentar desafíos ambientales y sociales con cooperación y diálogo."
    }
  ];
}

interface Activity {
  title: string;
  description: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}
