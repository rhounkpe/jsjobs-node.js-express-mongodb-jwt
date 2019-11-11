// command to load into database: load("companiesDataset.js");
db = db.getSiblingDB('jsjobs');
db.companies.drop();
db.companies.insertMany([
  {
    "name": "AT Sure",
    "email": "job@atsure.com",
    "url": "www.atsure.com",
    "address": {
      "street": "Rue du Chêne, 13",
      "city": "Bruxelles",
      "zipcode": "1000",
    },
    "password": "Pa$$w0rd",
    "description": "Arrogance Technology est une société à taille humaine, leader sur le marché, nous cherchons un développeur Front connaissant TOUS les frameworks y compris ceux qui ne sont pas encore sortis. Si vous parlez Anglais, Allemand et Espagnol et avez des notions de Mandarin, c'est un plus.",
  },
  {
    "name": "c-noo-les-meilleurs",
    "email": "job@bests.com",
    "url": "www.bests.com",
    "address": {
      "street": "Avenue du Général de Gaulle, 57",
      "city": "St Malo",
      "zipcode": "35400",
    },
    "password": "Pa$$w0rd",
    "description": "Vous maitrisez Angular, Node et MongoDB : ne cherchez plus, c'est nous les vrais leaders sur le marché. Vous souhaitez intégrer une société qui saura vous faire grandir techniquement et humainement, ne cherchez plus (bis) : ça n'existe pas ! (attends t'es sûr qu'on peut le dire). Pour info, nous ne cherchons pas vraiment, c'est juste pour donner l'impression à nos concurrents que nous sommes en très forte croissance.",
  },
  {
    "name": "SHT",
    "email": "job@sht.com",
    "url": "www.sht.com",
    "address": {
      "street": "Rue de l'impératrice, 80",
      "city": "Nantes",
      "zipcode": "1000",
    },
    "password": "Pa$$w0rd",
    "description": "Steak Haché Technologie cherche son expert pas cher : chez nous, le minimum c'est déjà trop. Alors envoie ton CV et tes prétentions, mais surtout le CV.",
  },
  {
    "name": "Palindrome",
    "email": "job@palindrome.com",
    "url": "www.palindrome.com",
    "address": {
      "street": "Rue Fin, 68",
      "city": "Laval",
      "zipcode": "53000",
    },
    "password": "Pa$$w0rd",
    "description": "'Engage le jeu que je le gagne' : c'est ce que tu pourras déclarer si tu maîtrises React, Redux et Node. Si en plus tu sais réparer un 'radar nu' et que tu habites sur 'un roc cornu', le poste est fait pour toi. On a déménagé à Laval pour aller au bout de notre obsession. Pas de babyfoot chez nous : on fait ... du Kayak :)",
  },
]);
