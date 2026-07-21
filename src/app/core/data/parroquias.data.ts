export interface Vicaria {
  vicaria: string;
  parroquias: string[];
}

export interface ZonaPastoral {
  zona: string;
  vicarias: Vicaria[];
}

/**
 * Distribución de zonas pastorales, vicarías y parroquias de la Arquidiócesis
 * de Panamá (fuente: LS webPage - Distribución de las Zonas Pastorales y
 * parroquias 2021.xlsx). Alimenta el selector de parroquia del formulario
 * de registro y el perfil de usuario.
 */
export const ZONAS_PASTORALES: ZonaPastoral[] = [
  {
    zona: 'Zona Santa María la Antigua',
    vicarias: [
      {
        vicaria: 'VICARÍA DE LA MERCED',
        parroquias: ['Santa Teresita (El Marañón)', 'San Miguel Arcángel (Calidonia)', 'Basílica Menor Don Bosco (Calidonia)', 'San Vicente de Paúl (5 de Mayo)', 'María Reina (Curundú)', 'Santa Ana (Santa Ana)', 'Ntra. Sra. de la Merced (Casco Antiguo)', 'Ntra. Sra. de Fátima (El Chorrillo)', 'Santa María (Balboa-Ancón)', 'Sagrado Corazón de Jesús (Ancón)', 'San José (Paraíso)']
      },
      {
        vicaria: 'VICARÍA DE CRISTO REY',
        parroquias: ['Santuario Nacional (Obarrio)', 'San Mateo (Punta Paitilla)', 'Nstra. Sra. del Carmen (Vía España)', 'Cristo Rey (Justo Arosemena)', 'Nstra. Sra. de Guadalupe (Calle 50)', 'San Francisco de Asís (La Caleta, San Fco)']
      },
      {
        vicaria: 'VICARÍA SANTA EDUVIGIS',
        parroquias: ['Santísima Trinidad (Villa de las Fuentes)', 'Nstra. Sra. de los Angeles (Urb. Los Angeles)', 'Santa Marta (Altos del Chase)', 'San Pablo Apóstol (La Locería)', 'Santa Eduvigis (Betania)', 'San Antonio de Padua (Miraflores)', 'Santa María La Antigua (Santa María)', 'Nstra. Sra. del Perpetuo Socorro (El Ingenio)', 'Nstra. Sra. de La Esperanza (El Bosque)']
      },
      {
        vicaria: 'VICARÍA DE LA ASUNCIÓN',
        parroquias: ['Nstra. Sra. de Lourdes (Carrasquilla)', 'María Auxiliadora (Pueblo Nuevo)', 'San Antonio Ma. Claret (Hato Pintado)', 'San Juan Bautista de la Salle (Parque Lefevre)', 'Santiago Apóstol (Río Abajo)', 'San Gerardo Mayela (Chanis)', 'Nstra. Sra. de la Asunción (Pamaná Viejo)', 'San Lucas Evangelista (Costa del Este)']
      },
    ]
  },
  {
    zona: 'Zona San Cristóbal - Panamá Este',
    vicarias: [
      {
        vicaria: 'VICARÍA NSTRA. SRA. DEL CARMEN',
        parroquias: ['San Judas Tadeo (Jardín Olímpico)', 'San Pedro Apóstol y San Cristobal (San Pedro)', 'Ntra. Sra. de la Candelaria (San Fernando - Juan Díaz)', 'Ntra. Sra.del Carmen (Juan Díaz)', 'La Inmaculada Concepción ( Juan Diaz)', 'Santa María del Camino (Ciudad Radial)', 'Santa María de Guadalupe (Altos de las Acacias)', 'C.C. El Señor de los Milagros (Las Acacias)', 'María Madre de Dios (Bda. Don Bosco)', 'Santa Rita de Casia (Bello Horizonte)']
      },
      {
        vicaria: 'VICARÍA DE DON BOSCO',
        parroquias: ['San Antonio de Padua (Tocumen)', 'Espíritu Santo (24 de Diciembre)', 'Ntra. Sra. de Belén (Nuevo Belén)', 'La Ascención del Señor (Mañanitas)', 'San Juan Bosco (Pedregal)', 'San Pío Pietrelchina (La Siesta)', 'San Andrés Kim (Mañanitas)', 'San Juan XXIII (24 de Diciembre)']
      },
      {
        vicaria: 'VICARÍA DE SAN CRISTÓBAL',
        parroquias: ['San Cristóbal (Chepo)-Área Mis.Bayano', 'Inmaculada Concepción (Pacora)', 'Jesús Buen Pastor (San Martín)', 'Cuerpo y Sangre de Cristo (Tortí)', 'San Pedro (Taboga)', 'San Francisco Javier (Pacora y 24 de dic.)']
      },
    ]
  },
  {
    zona: 'Zona Cristo Redentor Panama Norte',
    vicarias: [
      {
        vicaria: 'VICARÍA CRISTO REDENTOR',
        parroquias: ['Cristo Redentor (Paraiso)', 'Cristo Hijo del Hombre (Villa Guadalupe)', 'Cristo Servidor (El Crisol)', 'El Señor de los Milagros (Villa Lucre)', 'Cristo Hijo de Dios (Samaria)', 'Cristo Resucitado (Monte Oscuro)', 'San Antonio de Padua (San Antonio)', 'La Natividad de María (Cerro Viento)', 'San Juan Apóstol y Evangelista (Brisas del Golf)', 'San José (Veranillo)', 'La Medalla Milagrosa (Veranillo)', 'Cristo Luz del Mundo (Pan de Azúcar)', 'San Marcos (9 de enero y Andes No.1)', 'María Reina de la Paz (Andes No.2)']
      },
      {
        vicaria: 'VICARÍA LA SANTA CRUZ',
        parroquias: ['San Martín de Porres (Cerro Batea)', 'Ntra. Sra. del Rosario (Torrijos Carter)', 'La Sagrada Familia (San Isidro)', 'De la Transfiguración del Señor (Santa Librada)', 'San Agustín  (Villa Zaita)', 'San Juan María Vianney (Las Cumbres)', 'Virgen de la Medalla Milagrosa (A. Díaz)', 'San Jerónimo (Las Lajas)', 'La Santa Cruz ( Chilibre)']
      },
    ]
  },
  {
    zona: 'Panama Oeste',
    vicarias: [
      {
        vicaria: 'VICARÍA SAN FCO. DE PAULA',
        parroquias: ['Inmaculada Concepción (Veracruz)', 'Pablo VI (Howard)', 'San Nicolás de Bari (Arraiján)', 'Nstra. Sra. de los Dolores (Bello Horizonte)', 'Nstra. Sra. de Guadalupe (Guadalupe)', 'San Francisco de Paula (Chorrera)', 'La Inmaculada Concepción (A.de San Fco)', 'Santa Rita de Casia (Fuentes del Chase)']
      },
      {
        vicaria: 'VICARÍA SAN JOSÉ',
        parroquias: ['San Martín de Porres (El Espino)', 'San Isidro Labrador (Capira)', 'María Auxiliadora (Bejuco)', 'San José (Chame)', 'San Carlos Borromeo (San Carlos)']
      },
    ]
  },
];

/** Lista plana de todas las parroquias, para búsqueda rápida. */
export const TODAS_LAS_PARROQUIAS: string[] = ZONAS_PASTORALES
  .flatMap(z => z.vicarias)
  .flatMap(v => v.parroquias);
