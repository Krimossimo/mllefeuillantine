/* ✏️ Catalogue par défaut (le plus simple : utilisez la page admin.html puis « Exporter » pour régénérer ce fichier). */
const CATS = [{ id: 'entremets', nom: 'Entremets' }, { id: 'tartes', nom: 'Tartes' }, { id: 'choux', nom: 'Choux' }];
const CATALOGUE_DEFAUT = [
 {
  "id": "royalty",
  "nom": "Royalty",
  "desc": "Génoise chocolat, croustillant praliné, mousse chocolat.",
  "cat": "entremets",
  "img": "images/royalty.jpg",
  "tailles": [
   {
    "label": "4/6 parts",
    "prix": 25
   },
   {
    "label": "8/10 parts",
    "prix": 42
   },
   {
    "label": "20 parts",
    "prix": 92
   }
  ],
  "visible": true,
  "epuise": false,
  "offre": false
 },
 {
  "id": "rose-vert",
  "nom": "Rose & Vert",
  "desc": "Biscuit financier pistache/framboise, croustillant praliné pistache, mousse vanille, compotée de framboise.",
  "cat": "entremets",
  "img": "images/rose-vert.jpg",
  "tailles": [
   {
    "label": "4/6 parts",
    "prix": 31
   },
   {
    "label": "8/10 parts",
    "prix": 52
   },
   {
    "label": "20 parts",
    "prix": 112
   }
  ],
  "visible": true,
  "epuise": false,
  "offre": false
 },
 {
  "id": "poirier",
  "nom": "Poirier",
  "desc": "Pâte sucrée, biscuit financier, mousse vanille, crémeux et brunoise aux poires, chantilly mascarpone.",
  "cat": "entremets",
  "img": "images/poirier.jpg",
  "tailles": [
   {
    "label": "4/6 parts",
    "prix": 23
   },
   {
    "label": "8/10 parts",
    "prix": 38
   },
   {
    "label": "20 parts",
    "prix": 82
   }
  ],
  "visible": true,
  "epuise": false,
  "offre": false
 },
 {
  "id": "abricotier",
  "nom": "Abricotier",
  "desc": "Pâte sucrée, biscuit madeleine, mousse vanille, compotée d'abricot, crème vanille abricot.",
  "cat": "entremets",
  "img": "images/abricotier.jpg",
  "tailles": [
   {
    "label": "4/6 parts",
    "prix": 23
   },
   {
    "label": "8/10 parts",
    "prix": 38
   },
   {
    "label": "20 parts",
    "prix": 82
   }
  ],
  "visible": true,
  "epuise": false,
  "offre": false
 },
 {
  "id": "virgin-mojito",
  "nom": "Virgin Mojito",
  "desc": "Biscuit citron, mousse citron, curd menthe citron.",
  "cat": "entremets",
  "img": "images/virgin-mojito.jpg",
  "tailles": [
   {
    "label": "4/6 parts",
    "prix": 22
   },
   {
    "label": "8/10 parts",
    "prix": 36
   },
   {
    "label": "20 parts",
    "prix": 78
   }
  ],
  "visible": true,
  "epuise": false,
  "offre": false
 },
 {
  "id": "gourmand",
  "nom": "Le Gourmand",
  "desc": "Brownie pécan, mousse chocolat noir, caramel beurre salé.",
  "cat": "entremets",
  "img": "images/gourmand.jpg",
  "tailles": [
   {
    "label": "4/6 parts",
    "prix": 27
   },
   {
    "label": "8/10 parts",
    "prix": 45
   },
   {
    "label": "20 parts",
    "prix": 98
   }
  ],
  "visible": true,
  "epuise": false,
  "offre": false
 },
 {
  "id": "passion-fraise",
  "nom": "Passion Fraise",
  "desc": "Biscuit financier, croustillant praliné, mousse fraise, confit fraise et passion.",
  "cat": "entremets",
  "img": "images/passion-fraise.jpg",
  "tailles": [
   {
    "label": "4/6 parts",
    "prix": 24
   },
   {
    "label": "8/10 parts",
    "prix": 40
   },
   {
    "label": "20 parts",
    "prix": 88
   }
  ],
  "visible": true,
  "epuise": false,
  "offre": false
 },
 {
  "id": "figue-assidulee",
  "nom": "Figue Assidulée",
  "desc": "Financier framboise, croustillant praliné, mousse framboise, confit framboise et figue.",
  "cat": "entremets",
  "img": "images/figue-assidulee.jpg",
  "tailles": [
   {
    "label": "4/6 parts",
    "prix": 26
   },
   {
    "label": "8/10 parts",
    "prix": 44
   },
   {
    "label": "20 parts",
    "prix": 96
   }
  ],
  "visible": true,
  "epuise": false,
  "offre": false
 }
];
const AVIS_PUBLICS = [
  // { nom: 'Camille', note: 5, commentaire: 'Un délice !' }
];
