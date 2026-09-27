import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  Interview,
  Question,
  FavoriteQuestion,
  DashboardStats,
  TechnicalDomain,
  ExperienceLevel,
  Transaction,
  AdminNotification,
  TreasuryStats,
  PaymentMethod,
} from '../types';

interface DatabaseSchema {
  users: User[];
  interviews: Interview[];
  favorites: FavoriteQuestion[];
  transactions: Transaction[];
  notifications: AdminNotification[];
}

const DB_FILE_PATH = path.resolve(process.cwd(), 'data/db.json');

// Password hashing utility with sha256 and salt
export function hashPassword(password: string): string {
  const salt = 'techinterviews_salt_v2';
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Seed initial realistic data for instant demonstration and rich dashboard
function getInitialSeedData(): DatabaseSchema {
  const demoUserId = 'usr_demo_01';
  const demoPasswordHash = hashPassword('password123');

  const users: User[] = [
    {
      id: demoUserId,
      name: 'Alexandre Dupont',
      email: 'alex@techinterviews.io',
      passwordHash: demoPasswordHash,
      createdAt: '2026-08-15T10:00:00.000Z',
      targetDomain: 'JavaScript',
      targetLevel: 'Intermédiaire',
      role: 'student',
      subscription: {
        status: 'active',
        monthlyFee: 29,
        nextDueDate: '2026-10-31T23:59:59.000Z',
        lastPaymentDate: '2026-09-25T10:15:00.000Z',
        totalDeposited: 58,
      },
    },
    {
      id: 'usr_student_02',
      name: 'Sarah Connor',
      email: 'sarah.connor@gmail.com',
      passwordHash: demoPasswordHash,
      createdAt: '2026-09-01T14:20:00.000Z',
      targetDomain: 'Bases de données',
      targetLevel: 'Intermédiaire',
      role: 'student',
      subscription: {
        status: 'active',
        monthlyFee: 29,
        nextDueDate: '2026-10-31T23:59:59.000Z',
        lastPaymentDate: '2026-09-26T16:30:00.000Z',
        totalDeposited: 29,
      },
    },
    {
      id: 'usr_student_03',
      name: 'Mamadou Traoré',
      email: 'mamadou.traore@ecole-tech.org',
      passwordHash: demoPasswordHash,
      createdAt: '2026-09-18T08:45:00.000Z',
      targetDomain: 'Python',
      targetLevel: 'Débutant',
      role: 'student',
      subscription: {
        status: 'active',
        monthlyFee: 29,
        nextDueDate: '2026-10-31T23:59:59.000Z',
        lastPaymentDate: '2026-09-20T11:00:00.000Z',
        totalDeposited: 29,
      },
    },
    {
      id: 'usr_admin_01',
      name: 'Responsable Pédagogique (Admin)',
      email: 'admin@techinterviews.io',
      passwordHash: demoPasswordHash,
      createdAt: '2026-08-01T09:00:00.000Z',
      role: 'admin',
    },
  ];

  const transactions: Transaction[] = [
    {
      id: 'tx_01',
      userId: demoUserId,
      userName: 'Alexandre Dupont',
      userEmail: 'alex@techinterviews.io',
      type: 'INCOME',
      amount: 29,
      currency: '€',
      category: 'Cotisation mensuelle cours',
      paymentMethod: 'Carte Bancaire',
      status: 'COMPLETED',
      description: 'Paiement mensuel cours - Domaine JavaScript',
      date: '2026-08-25T10:15:00.000Z',
    },
    {
      id: 'tx_02',
      userId: demoUserId,
      userName: 'Alexandre Dupont',
      userEmail: 'alex@techinterviews.io',
      type: 'INCOME',
      amount: 29,
      currency: '€',
      category: 'Cotisation mensuelle cours',
      paymentMethod: 'Carte Bancaire',
      status: 'COMPLETED',
      description: 'Renouvellement mensuel cours - Septembre',
      date: '2026-09-25T10:15:00.000Z',
    },
    {
      id: 'tx_03',
      userId: 'usr_student_02',
      userName: 'Sarah Connor',
      userEmail: 'sarah.connor@gmail.com',
      type: 'INCOME',
      amount: 29,
      currency: '€',
      category: 'Cotisation mensuelle cours',
      paymentMethod: 'Mobile Money',
      status: 'COMPLETED',
      description: 'Paiement cours - Domaine Bases de données',
      date: '2026-09-26T16:30:00.000Z',
    },
    {
      id: 'tx_04',
      userId: 'usr_student_03',
      userName: 'Mamadou Traoré',
      userEmail: 'mamadou.traore@ecole-tech.org',
      type: 'INCOME',
      amount: 29,
      currency: '€',
      category: 'Cotisation mensuelle cours',
      paymentMethod: 'Carte Bancaire',
      status: 'COMPLETED',
      description: 'Paiement cours - Domaine Python (Débutant)',
      date: '2026-09-20T11:00:00.000Z',
    },
    {
      id: 'tx_05',
      userId: 'usr_admin_01',
      userName: 'Administration TechInterviews',
      userEmail: 'admin@techinterviews.io',
      type: 'EXPENSE',
      amount: 32,
      currency: '€',
      category: 'Hébergement & Serveurs Cloud',
      paymentMethod: 'Virement Bancaire',
      status: 'COMPLETED',
      description: 'Serveurs d\'exécution et stockage sécurisé',
      date: '2026-09-15T09:00:00.000Z',
    },
    {
      id: 'tx_06',
      userId: 'usr_admin_01',
      userName: 'Administration TechInterviews',
      userEmail: 'admin@techinterviews.io',
      type: 'EXPENSE',
      amount: 15,
      currency: '€',
      category: 'API IA Gemini',
      paymentMethod: 'Carte Bancaire',
      status: 'COMPLETED',
      description: 'Consommation tokens évaluation et génération questions',
      date: '2026-09-22T14:00:00.000Z',
    },
  ];

  const notifications: AdminNotification[] = [
    {
      id: 'notif_01',
      type: 'NEW_REGISTRATION',
      title: 'Nouvelle inscription étudiant',
      message: 'Un étudiant vient de s\'inscrire à TechInterview : Sarah Connor (sarah.connor@gmail.com) pour faire dans le domaine des Bases de données, elle a choisi le niveau Intermédiaire.',
      userId: 'usr_student_02',
      studentName: 'Sarah Connor',
      domain: 'Bases de données',
      level: 'Intermédiaire',
      read: false,
      createdAt: '2026-09-26T16:25:00.000Z',
    },
    {
      id: 'notif_02',
      type: 'NEW_PAYMENT',
      title: 'Paiement de cours reçu',
      message: 'Sarah Connor a déposé 29 € via Mobile Money pour ses cours mensuels de Bases de données.',
      userId: 'usr_student_02',
      studentName: 'Sarah Connor',
      domain: 'Bases de données',
      level: 'Intermédiaire',
      amount: 29,
      read: false,
      createdAt: '2026-09-26T16:30:00.000Z',
    },
    {
      id: 'notif_03',
      type: 'NEW_REGISTRATION',
      title: 'Nouvelle inscription étudiant',
      message: 'Un étudiant vient de s\'inscrire à TechInterview : Mamadou Traoré (mamadou.traore@ecole-tech.org) pour faire dans le domaine Python, il a choisi le niveau Débutant.',
      userId: 'usr_student_03',
      studentName: 'Mamadou Traoré',
      domain: 'Python',
      level: 'Débutant',
      read: true,
      createdAt: '2026-09-18T08:45:00.000Z',
    },
    {
      id: 'notif_04',
      type: 'NEW_PAYMENT',
      title: 'Paiement mensuel reçu',
      message: 'Alexandre Dupont a réglé sa cotisation mensuelle de 29 € (Carte Bancaire).',
      userId: demoUserId,
      studentName: 'Alexandre Dupont',
      amount: 29,
      read: true,
      createdAt: '2026-09-25T10:15:00.000Z',
    },
  ];

  const interviews: Interview[] = [
    {
      id: 'int_demo_01',
      userId: demoUserId,
      domain: 'JavaScript',
      level: 'Intermédiaire',
      mode: 'Simulation',
      questionCount: 5,
      globalScore: 78,
      createdAt: '2026-09-10T14:30:00.000Z',
      completedAt: '2026-09-10T14:48:00.000Z',
      questions: [
        {
          id: 'q_js_1',
          orderIndex: 0,
          question: 'Expliquez la différence entre `var`, `let` et `const` en JavaScript, en détaillant la portée et le hoisting.',
          expectedTopics: ['Portée de bloc', 'Portée de fonction', 'Hoisting', 'Temporal Dead Zone', 'Réassignation'],
          difficulty: 'beginner',
        },
        {
          id: 'q_js_2',
          orderIndex: 1,
          question: 'Comment fonctionne l\'Event Loop en JavaScript ? Quelle est la différence entre les microtâches et les macrotâches ?',
          expectedTopics: ['Call Stack', 'Callback Queue', 'Microtask Queue', 'Promise vs setTimeout', 'Render Queue'],
          difficulty: 'intermediate',
        },
        {
          id: 'q_js_3',
          orderIndex: 2,
          question: 'Qu\'est-ce qu\'une closure (fermeture) et dans quel cas concret l\'utiliseriez-vous ?',
          expectedTopics: ['Lexical scoping', 'Encapsulation', 'Factory functions', 'Mémoire / Fuites'],
          difficulty: 'intermediate',
        },
        {
          id: 'q_js_4',
          orderIndex: 3,
          question: 'Expliquez comment fonctionne le chaînage d\'erreurs avec `async/await` et `Promise.allSettled` vs `Promise.all`.',
          expectedTopics: ['Try / catch', 'Fail fast', 'Résilience', 'Gestion concurrente'],
          difficulty: 'intermediate',
        },
        {
          id: 'q_js_5',
          orderIndex: 4,
          question: 'Quelle est la différence entre `==` et `===` ? Donnez un exemple de coercion de type inattendue.',
          expectedTopics: ['Strict equality', 'Type coercion', 'Algorithme ToPrimitive', 'Truthy/Falsy'],
          difficulty: 'beginner',
        },
      ],
      answers: [
        {
          id: 'ans_js_1',
          questionId: 'q_js_1',
          userAnswer: '`var` a une portée de fonction et est hissé avec la valeur undefined. `let` et `const` ont une portée de bloc ({}) et sont dans une Temporal Dead Zone jusqu\'à leur déclaration. `const` empêche la réassignation de la référence.',
          score: 90,
          strengths: ['Bonne explication de la portée de bloc vs fonction', 'Mention pertinente de la Temporal Dead Zone'],
          weaknesses: ['Aurait pu préciser que les objets sous `const` restent mutables'],
          feedback: 'Excellente réponse, claire et synthétique. Les concepts clés de portée et de TDZ sont parfaitement compris.',
          improvementTips: ['Précisez toujours la mutabilité interne des objets déclarés avec `const`.'],
          createdAt: '2026-09-10T14:34:00.000Z',
        },
        {
          id: 'ans_js_2',
          questionId: 'q_js_2',
          userAnswer: 'L\'Event Loop coordonne la pile d\'appels et les files d\'attente. Quand la stack est vide, les microtâches comme les Promises sont traitées en priorité avant les macrotâches comme setTimeout.',
          score: 85,
          strengths: ['Ordre d\'exécution microtâches vs macrotâches bien identifié', 'Vocabulaire technique précis'],
          weaknesses: ['Explication rapide de la phase de rendering'],
          feedback: 'Très bonne compréhension du moteur asynchrone V8 et de la priorité accordée aux Promises.',
          improvementTips: ['Mentionnez queueMicrotask() ou MutationObserver pour montrer une expertise avancée.'],
          createdAt: '2026-09-10T14:38:00.000Z',
        },
        {
          id: 'ans_js_3',
          questionId: 'q_js_3',
          userAnswer: 'Une closure est une fonction qui se souvient des variables de son environnement lexical même après l\'exécution de la fonction parente. C\'est utilisé pour créer des variables privées.',
          score: 80,
          strengths: ['Définition exacte du scope lexical', 'Cas d\'usage pertinent (état privé)'],
          weaknesses: ['Manque d\'un court exemple de code ou mention des risques de fuite mémoire'],
          feedback: 'Bonne définition théorique. Illustrer avec un compteur ou un module pattern aurait été parfait.',
          improvementTips: ['Donnez un exemple concret d\'implémentation (ex: currying, createCounter).'],
          createdAt: '2026-09-10T14:41:00.000Z',
        },
        {
          id: 'ans_js_4',
          questionId: 'q_js_4',
          userAnswer: 'Promise.all échoue dès qu\'une promesse est rejetée, alors que allSettled attend que toutes soient terminées, avec leur status et reason.',
          score: 75,
          strengths: ['Différence fail-fast vs all-settled bien comprise'],
          weaknesses: ['La gestion des blocs try/catch autour de plusieurs await n\'a pas été suffisamment détaillée'],
          feedback: 'Bonne base sur les méthodes statiques de Promise, mais un peu succinct sur le pattern try/catch structuré.',
          improvementTips: ['Expliquez comment manipuler le tableau d\'objets {status, value, reason} retourné par allSettled.'],
          createdAt: '2026-09-10T14:44:00.000Z',
        },
        {
          id: 'ans_js_5',
          questionId: 'q_js_5',
          userAnswer: '`===` vérifie la valeur et le type, tandis que `==` convertit les types avant de comparer. Par exemple `0 == ""` ou `null == undefined`.',
          score: 70,
          strengths: ['Exemples classiques de coercion'],
          weaknesses: ['Explication un peu brève sur les règles de coercion abstraite'],
          feedback: 'Correct et direct. Maîtriser le tableau de coercion aide beaucoup en entretien.',
          improvementTips: ['Expliquez pourquoi Object.is() est parfois préféré pour NaN et -0.'],
          createdAt: '2026-09-10T14:47:00.000Z',
        },
      ],
      summary: {
        overallStrengths: ['Excellente maîtrise du hoisting et de la boucle d\'événements', 'Vocabulaire JavaScript moderne'],
        overallWeaknesses: ['Détail des cas limites en gestion d\'erreurs asynchrones', 'Exemples de code plus concrets attendus'],
        recommendations: ['Pratiquer la manipulation avancée de Promise.allSettled et concevoir des retry patterns.'],
      },
    },
    {
      id: 'int_demo_02',
      userId: demoUserId,
      domain: 'Développement Web',
      level: 'Débutant',
      mode: 'Entraînement',
      questionCount: 5,
      globalScore: 88,
      createdAt: '2026-09-15T09:15:00.000Z',
      completedAt: '2026-09-15T09:35:00.000Z',
      questions: [
        {
          id: 'q_web_1',
          orderIndex: 0,
          question: 'Quelle est la différence fondamentale entre les éléments HTML `inline` et `block` ?',
          expectedTopics: ['Flux normal', 'Largeur 100% vs contenu', 'Marges et padding'],
          difficulty: 'beginner',
        },
        {
          id: 'q_web_2',
          orderIndex: 1,
          question: 'Comment rendre un site web accessible (a11y) pour les utilisateurs de lecteurs d\'écran ?',
          expectedTopics: ['HTML sémantique', 'Balises alt', 'Attributs ARIA', 'Navigation clavier', 'Contraste des couleurs'],
          difficulty: 'beginner',
        },
        {
          id: 'q_web_3',
          orderIndex: 2,
          question: 'Quels sont les principaux verbes HTTP dans une API REST et leur sémantique ?',
          expectedTopics: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'Idempotence'],
          difficulty: 'beginner',
        },
        {
          id: 'q_web_4',
          orderIndex: 3,
          question: 'Expliquez ce qu\'est le LocalStorage vs SessionStorage vs Cookies.',
          expectedTopics: ['Persistance', 'Taille maximale', 'Transmission serveur HTTP', 'Scope onglet/navigateur'],
          difficulty: 'beginner',
        },
        {
          id: 'q_web_5',
          orderIndex: 4,
          question: 'Qu\'est-ce que le Responsive Design et comment les Media Queries fonctionnent-elles ?',
          expectedTopics: ['Viewport meta tag', 'Breakpoints', 'Mobile-first', 'CSS flexible'],
          difficulty: 'beginner',
        },
      ],
      answers: [
        {
          id: 'ans_web_1',
          questionId: 'q_web_1',
          userAnswer: 'Un élément block (comme div, p) prend toute la largeur disponible et commence sur une nouvelle ligne. Un élément inline (comme span, a) ne prend que la largeur de son contenu.',
          score: 95,
          strengths: ['Distinction limpide', 'Exemples pertinents'],
          weaknesses: [],
          feedback: 'Parfait. C\'est la réponse idéale pour un entretien débutant.',
          improvementTips: ['Mentionnez aussi `inline-block` pour montrer une vision exhaustive.'],
          createdAt: '2026-09-15T09:18:00.000Z',
        },
        {
          id: 'ans_web_2',
          questionId: 'q_web_2',
          userAnswer: 'Utiliser des balises sémantiques (header, nav, main, footer), renseigner les textes alt sur les images, assurer un bon contraste de couleurs et tester la navigation au clavier avec Tab.',
          score: 90,
          strengths: ['Approche sémantique prioritaire', 'Prise en compte de la navigation clavier'],
          weaknesses: ['Peu de détails sur les rôles ARIA'],
          feedback: 'Très solide. L\'accessibilité est souvent négligée, cette réponse fait une excellente impression.',
          improvementTips: ['Citez la règle de base ARIA : "Le meilleur ARIA est le HTML sémantique natif".'],
          createdAt: '2026-09-15T09:22:00.000Z',
        },
        {
          id: 'ans_web_3',
          questionId: 'q_web_3',
          userAnswer: 'GET pour lire des données, POST pour créer, PUT pour remplacer complètement une ressource, PATCH pour modifier partiellement, et DELETE pour supprimer.',
          score: 92,
          strengths: ['Différence PUT vs PATCH bien précisée', 'Excellente clarté'],
          weaknesses: ['Idempotence non mentionnée explicitement'],
          feedback: 'Excellente maîtrise des standards RESTful.',
          improvementTips: ['Mentionnez que GET, PUT et DELETE sont idempotents, tandis que POST ne l\'est pas.'],
          createdAt: '2026-09-15T09:26:00.000Z',
        },
        {
          id: 'ans_web_4',
          questionId: 'q_web_4',
          userAnswer: 'LocalStorage persiste même si on ferme le navigateur (~5Mo). SessionStorage s\'efface à la fermeture de l\'onglet. Les cookies sont envoyés au serveur avec chaque requête HTTP et sont plus petits (~4Ko).',
          score: 88,
          strengths: ['Limites de taille et durée de vie précisées', 'Rôle des cookies dans les requêtes HTTP'],
          weaknesses: ['Attributs de sécurité des cookies (HttpOnly, Secure, SameSite) omis'],
          feedback: 'Très bonne comparaison. Les différences fonctionnelles sont parfaitement maîtrisées.',
          improvementTips: ['Abordez la sécurité : cookie HttpOnly pour se protéger des failles XSS.'],
          createdAt: '2026-09-15T09:30:00.000Z',
        },
        {
          id: 'ans_web_5',
          questionId: 'q_web_5',
          userAnswer: 'Le responsive design adapte l\'affichage aux différentes tailles d\'écran via la balise meta viewport et les media queries (@media screen and (min-width: 768px)). On privilégie souvent le Mobile First.',
          score: 85,
          strengths: ['Mention de Mobile-First et de la balise viewport'],
          weaknesses: ['Exemple de syntaxe basique'],
          feedback: 'Très bonne réponse, pratique et moderne.',
          improvementTips: ['Mentionnez les unités relatives comme rem, vw, et vh pour une flexibilité optimale.'],
          createdAt: '2026-09-15T09:34:00.000Z',
        },
      ],
      summary: {
        overallStrengths: ['Très grande clarté sur les bases du Web', 'Sensibilité aux bonnes pratiques (a11y, REST)'],
        overallWeaknesses: ['Sécurité des cookies et spécificités protocolaires'],
        recommendations: ['Passer au niveau Intermédiaire en Développement Web pour explorer le rendu SSR, l\'hydratation et les Web Workers.'],
      },
    },
    {
      id: 'int_demo_03',
      userId: demoUserId,
      domain: 'Bases de données',
      level: 'Intermédiaire',
      mode: 'Simulation',
      questionCount: 5,
      globalScore: 72,
      createdAt: '2026-09-22T16:00:00.000Z',
      completedAt: '2026-09-22T16:20:00.000Z',
      questions: [
        {
          id: 'q_db_1',
          orderIndex: 0,
          question: 'Que signifie l\'acronyme ACID dans le contexte des bases de données relationnelles ?',
          expectedTopics: ['Atomicité', 'Cohérence', 'Isolation', 'Durabilité'],
          difficulty: 'intermediate',
        },
        {
          id: 'q_db_2',
          orderIndex: 1,
          question: 'Comment fonctionne un index B-Tree et quand peut-il ralentir les performances ?',
          expectedTopics: ['Arbre équilibré', 'Recherche O(log n)', 'Coût en écriture (INSERT/UPDATE)', 'Sélectivité'],
          difficulty: 'intermediate',
        },
        {
          id: 'q_db_3',
          orderIndex: 2,
          question: 'Quelle est la différence entre une jointure INNER JOIN, LEFT JOIN et FULL OUTER JOIN ?',
          expectedTopics: ['Intersection', 'Préservation des lignes de gauche', 'Gestion des valeurs NULL'],
          difficulty: 'beginner',
        },
        {
          id: 'q_db_4',
          orderIndex: 3,
          question: 'Expliquez ce qu\'est le problème N+1 requêtes dans un ORM et comment le résoudre.',
          expectedTopics: ['Lazy loading', 'Eager loading / JOIN FETCH', 'Impact réseau', 'Batching'],
          difficulty: 'intermediate',
        },
        {
          id: 'q_db_5',
          orderIndex: 4,
          question: 'Qu\'est-ce que le sharding et en quoi diffère-t-il de la réplication Read-Replica ?',
          expectedTopics: ['Partitionnement horizontal', 'Distribution des écritures', 'Scalabilité en lecture'],
          difficulty: 'advanced',
        },
      ],
      answers: [
        {
          id: 'ans_db_1',
          questionId: 'q_db_1',
          userAnswer: 'Atomicité : tout ou rien. Cohérence : respect des contraintes d\'intégrité. Isolation : transactions indépendantes. Durabilité : les données confirmées ne sont pas perdues même en cas de crash.',
          score: 88,
          strengths: ['Définition exacte de chaque lettre', 'Excellente concision'],
          weaknesses: ['Niveaux d\'isolation (Read Committed, Serializable) non évoqués'],
          feedback: 'Très bonne réponse théorique sur les transactions relationnelles.',
          improvementTips: ['Mentionnez les anomalies d\'isolation (Dirty Read, Non-repeatable read, Phantom read).'],
          createdAt: '2026-09-22T16:04:00.000Z',
        },
        {
          id: 'ans_db_2',
          questionId: 'q_db_2',
          userAnswer: 'Un index B-tree organise les clés dans un arbre pour chercher rapidement en O(log N). Il ralentit les écritures (INSERT/UPDATE/DELETE) car l\'arbre doit être rééquilibré.',
          score: 82,
          strengths: ['Complexité O(log N) mentionnée', 'Impact négatif sur les écritures bien identifié'],
          weaknesses: ['Notion de sélectivité de colonne non abordée'],
          feedback: 'Bonne compréhension du compromis lecture/écriture sur les index.',
          improvementTips: ['Rappelez qu\'un index sur une colonne peu discriminante (ex: booléen) est souvent inefficace.'],
          createdAt: '2026-09-22T16:08:00.000Z',
        },
        {
          id: 'ans_db_3',
          questionId: 'q_db_3',
          userAnswer: 'INNER JOIN garde seulement les correspondances. LEFT JOIN garde toutes les lignes de la table de gauche même sans correspondance (avec des NULL à droite). FULL OUTER JOIN garde toutes les lignes des deux tables.',
          score: 90,
          strengths: ['Explication claire et directe des types de jointures'],
          weaknesses: [],
          feedback: 'Impeccable.',
          improvementTips: ['Mentionnez l\'utilisation de RIGHT JOIN ou de CROSS JOIN pour compléter.'],
          createdAt: '2026-09-22T16:11:00.000Z',
        },
        {
          id: 'ans_db_4',
          questionId: 'q_db_4',
          userAnswer: 'C\'est quand l\'ORM fait 1 requête pour la liste parente puis 1 requête par enfant. Ça fait beaucoup d\'appels.',
          score: 60,
          strengths: ['Identification du problème de requêtes multiples'],
          weaknesses: ['Aucune solution technique proposée (eager loading, join fetch, prefetch)'],
          feedback: 'Le problème est reconnu, mais la solution en pratique manquait dans la réponse.',
          improvementTips: ['Expliquez comment résoudre avec `includes` en Prisma, `prefetch_related` en Django ou `JOIN FETCH` en SQL.'],
          createdAt: '2026-09-22T16:15:00.000Z',
        },
        {
          id: 'ans_db_5',
          questionId: 'q_db_5',
          userAnswer: 'La réplication copie la base sur des serveurs secondaires pour lire. Le sharding divise les données selon une clé sur plusieurs bases pour encaisser plus de requêtes.',
          score: 65,
          strengths: ['Distinction lecture (replicas) vs partitionnement (sharding)'],
          weaknesses: ['Explications sommaires sur la complexité des transactions distribuées'],
          feedback: 'Bonne intuition générale pour une question avancée.',
          improvementTips: ['Expliquez la difficulté des jointures cross-shard et le choix de la clé de sharding (Shard Key).'],
          createdAt: '2026-09-22T16:19:00.000Z',
        },
      ],
      summary: {
        overallStrengths: ['Excellentes bases SQL et compréhension des index', 'Compréhension du cycle de vie des transactions ACID'],
        overallWeaknesses: ['Optimisation d\'ORM (problème N+1) et architectures de scalabilité distribuée'],
        recommendations: ['Réviser l\'eager loading avec les ORM modernes et approfondir les mécanismes de Sharding vs Réplication.'],
      },
    },
  ];

  const favorites: FavoriteQuestion[] = [
    {
      id: 'fav_01',
      userId: demoUserId,
      questionId: 'q_js_2',
      domain: 'JavaScript',
      level: 'Intermédiaire',
      question: 'Comment fonctionne l\'Event Loop en JavaScript ? Quelle est la différence entre les microtâches et les macrotâches ?',
      expectedTopics: ['Call Stack', 'Callback Queue', 'Microtask Queue', 'Promise vs setTimeout', 'Render Queue'],
      createdAt: '2026-09-10T14:50:00.000Z',
      notes: 'Question classique en entretien frontend / fullstack. À réviser avant tout entretien technique !',
    },
    {
      id: 'fav_02',
      userId: demoUserId,
      questionId: 'q_db_4',
      domain: 'Bases de données',
      level: 'Intermédiaire',
      question: 'Expliquez ce qu\'est le problème N+1 requêtes dans un ORM et comment le résoudre.',
      expectedTopics: ['Lazy loading', 'Eager loading / JOIN FETCH', 'Impact réseau', 'Batching'],
      createdAt: '2026-09-22T16:25:00.000Z',
      notes: 'Revoir la syntaxe des include/select en ORM pour éliminer les requêtes superflues.',
    },
  ];

  return { users, interviews, favorites, transactions, notifications };
}

// Ensure database file exists
function ensureDb(): DatabaseSchema {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE_PATH)) {
      const initial = getInitialSeedData();
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }

    const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data) as DatabaseSchema;
    let modified = false;
    const seed = getInitialSeedData();

    if (!parsed.transactions || parsed.transactions.length === 0) {
      parsed.transactions = seed.transactions;
      modified = true;
    }
    if (!parsed.notifications || parsed.notifications.length === 0) {
      parsed.notifications = seed.notifications;
      modified = true;
    }
    // Ensure existing demo users have student profiles if missing
    for (const u of parsed.users) {
      if (!u.targetDomain && u.email === 'alex@techinterviews.io') {
        u.targetDomain = 'JavaScript';
        u.targetLevel = 'Intermédiaire';
        u.role = 'student';
        u.subscription = {
          status: 'active',
          monthlyFee: 29,
          nextDueDate: '2026-10-31T23:59:59.000Z',
          lastPaymentDate: '2026-09-25T10:15:00.000Z',
          totalDeposited: 58,
        };
        modified = true;
      }
    }
    // Ensure admin user exists
    if (!parsed.users.some(u => u.email === 'admin@techinterviews.io')) {
      const admin = seed.users.find(u => u.email === 'admin@techinterviews.io');
      if (admin) parsed.users.push(admin);
      modified = true;
    }
    // Ensure other seed students exist for rich stats
    if (!parsed.users.some(u => u.email === 'sarah.connor@gmail.com')) {
      const sarah = seed.users.find(u => u.email === 'sarah.connor@gmail.com');
      if (sarah) parsed.users.push(sarah);
      modified = true;
    }
    if (!parsed.users.some(u => u.email === 'mamadou.traore@ecole-tech.org')) {
      const mamadou = seed.users.find(u => u.email === 'mamadou.traore@ecole-tech.org');
      if (mamadou) parsed.users.push(mamadou);
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
    }

    return parsed;
  } catch (err) {
    console.error('Error reading DB, using initial seed:', err);
    return getInitialSeedData();
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

export const db = {
  // Users
  getUserByEmail(email: string): User | undefined {
    const data = ensureDb();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  getUserById(id: string): User | undefined {
    const data = ensureDb();
    return data.users.find((u) => u.id === id);
  },

  createUser(userData: {
    name: string;
    email: string;
    password: string;
    targetDomain?: TechnicalDomain;
    targetLevel?: ExperienceLevel;
    role?: 'student' | 'admin';
  }): User {
    const data = ensureDb();
    const existing = data.users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    const domain = userData.targetDomain || 'Bases de données';
    const level = userData.targetLevel || 'Intermédiaire';
    const role = userData.role || (userData.email.toLowerCase().includes('admin') ? 'admin' : 'student');

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      passwordHash: hashPassword(userData.password),
      createdAt: new Date().toISOString(),
      targetDomain: domain,
      targetLevel: level,
      role,
      subscription: role === 'student' ? {
        status: 'trial',
        monthlyFee: 29,
        nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        totalDeposited: 0,
      } : undefined,
    };

    data.users.push(newUser);

    // Notification automatique pour l'administrateur
    if (role === 'student') {
      const notif: AdminNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type: 'NEW_REGISTRATION',
        title: 'Nouvelle inscription étudiant',
        message: `Un étudiant vient de s'inscrire à TechInterview pour faire dans le domaine "${domain}", il a choisi le niveau "${level}" : ${newUser.name} (${newUser.email}).`,
        userId: newUser.id,
        studentName: newUser.name,
        domain,
        level,
        read: false,
        createdAt: new Date().toISOString(),
      };
      if (!data.notifications) data.notifications = [];
      data.notifications.unshift(notif);
    }

    writeDb(data);
    return newUser;
  },

  updateUserProfile(userId: string, name: string): User {
    const data = ensureDb();
    const userIndex = data.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Utilisateur introuvable');
    }
    data.users[userIndex].name = name.trim();
    writeDb(data);
    return data.users[userIndex];
  },

  // Interviews
  saveInterview(interview: Interview): Interview {
    const data = ensureDb();
    const existingIndex = data.interviews.findIndex((i) => i.id === interview.id);
    if (existingIndex >= 0) {
      data.interviews[existingIndex] = interview;
    } else {
      data.interviews.push(interview);
    }
    writeDb(data);
    return interview;
  },

  getInterviewById(id: string): Interview | undefined {
    const data = ensureDb();
    return data.interviews.find((i) => i.id === id);
  },

  getInterviewsByUser(
    userId: string,
    filters?: {
      domain?: TechnicalDomain;
      level?: ExperienceLevel;
      sortBy?: 'date_desc' | 'date_asc' | 'score_desc' | 'score_asc';
      limit?: number;
      offset?: number;
    }
  ): { items: Interview[]; total: number } {
    const data = ensureDb();
    let userInterviews = data.interviews.filter((i) => i.userId === userId);

    if (filters?.domain) {
      userInterviews = userInterviews.filter((i) => i.domain === filters.domain);
    }

    if (filters?.level) {
      userInterviews = userInterviews.filter((i) => i.level === filters.level);
    }

    const sortBy = filters?.sortBy || 'date_desc';
    userInterviews.sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'score_desc') {
        return b.globalScore - a.globalScore;
      }
      if (sortBy === 'score_asc') {
        return a.globalScore - b.globalScore;
      }
      return 0;
    });

    const total = userInterviews.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;
    const items = userInterviews.slice(offset, offset + limit);

    return { items, total };
  },

  // Dashboard Stats
  getDashboardStats(userId: string): DashboardStats {
    const data = ensureDb();
    const userInterviews = data.interviews
      .filter((i) => i.userId === userId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const totalInterviews = userInterviews.length;

    if (totalInterviews === 0) {
      return {
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        totalQuestionsAnswered: 0,
        recentProgress: 0,
        scoreHistory: [],
        domainStats: [],
        levelStats: [],
      };
    }

    const scores = userInterviews.map((i) => i.globalScore);
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const bestScore = Math.max(...scores);
    const totalQuestionsAnswered = userInterviews.reduce((acc, curr) => acc + (curr.answers?.length || 0), 0);

    // Recent progress: compare last 2 vs previous
    let recentProgress = 0;
    if (scores.length >= 2) {
      const recent = scores.slice(-2);
      const prior = scores.slice(0, -2);
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const priorAvg = prior.length > 0 ? prior.reduce((a, b) => a + b, 0) / prior.length : recentAvg;
      recentProgress = Math.round(recentAvg - priorAvg);
    }

    const scoreHistory = userInterviews.map((i) => ({
      interviewId: i.id,
      date: i.createdAt,
      domain: i.domain,
      score: i.globalScore,
      level: i.level,
    }));

    // Stats by domain
    const domainMap = new Map<TechnicalDomain, { count: number; totalScore: number }>();
    userInterviews.forEach((i) => {
      const current = domainMap.get(i.domain) || { count: 0, totalScore: 0 };
      domainMap.set(i.domain, {
        count: current.count + 1,
        totalScore: current.totalScore + i.globalScore,
      });
    });

    const domainStats = Array.from(domainMap.entries()).map(([domain, val]) => ({
      domain,
      interviewCount: val.count,
      averageScore: Math.round(val.totalScore / val.count),
    }));

    // Stats by level
    const levelMap = new Map<ExperienceLevel, { count: number; totalScore: number }>();
    userInterviews.forEach((i) => {
      const current = levelMap.get(i.level) || { count: 0, totalScore: 0 };
      levelMap.set(i.level, {
        count: current.count + 1,
        totalScore: current.totalScore + i.globalScore,
      });
    });

    const levelStats = Array.from(levelMap.entries()).map(([level, val]) => ({
      level,
      interviewCount: val.count,
      averageScore: Math.round(val.totalScore / val.count),
    }));

    return {
      totalInterviews,
      averageScore,
      bestScore,
      totalQuestionsAnswered,
      recentProgress,
      scoreHistory,
      domainStats,
      levelStats,
    };
  },

  // Favorites
  getFavorites(userId: string): FavoriteQuestion[] {
    const data = ensureDb();
    return data.favorites
      .filter((f) => f.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addFavorite(
    userId: string,
    favData: {
      questionId: string;
      domain: TechnicalDomain;
      level: ExperienceLevel;
      question: string;
      expectedTopics: string[];
      notes?: string;
    }
  ): FavoriteQuestion {
    const data = ensureDb();
    const existing = data.favorites.find((f) => f.userId === userId && f.questionId === favData.questionId);
    if (existing) {
      return existing;
    }

    const newFav: FavoriteQuestion = {
      id: `fav_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      ...favData,
      createdAt: new Date().toISOString(),
    };

    data.favorites.push(newFav);
    writeDb(data);
    return newFav;
  },

  removeFavorite(userId: string, questionId: string): boolean {
    const data = ensureDb();
    const initialCount = data.favorites.length;
    data.favorites = data.favorites.filter((f) => !(f.userId === userId && (f.questionId === questionId || f.id === questionId)));
    writeDb(data);
    return data.favorites.length < initialCount;
  },

  isQuestionFavorite(userId: string, questionId: string): boolean {
    const data = ensureDb();
    return data.favorites.some((f) => f.userId === userId && f.questionId === questionId);
  },

  // Revision questions (questions where the user scored below 70)
  getRevisionQuestions(userId: string): {
    question: Question;
    interviewDomain: TechnicalDomain;
    interviewLevel: ExperienceLevel;
    userAnswer: string;
    score: number;
    feedback: string;
    improvementTips: string[];
  }[] {
    const data = ensureDb();
    const userInterviews = data.interviews.filter((i) => i.userId === userId);
    const results: any[] = [];

    for (const interview of userInterviews) {
      for (const answer of interview.answers) {
        if (answer.score < 75) {
          const q = interview.questions.find((quest) => quest.id === answer.questionId);
          if (q) {
            results.push({
              question: q,
              interviewDomain: interview.domain,
              interviewLevel: interview.level,
              userAnswer: answer.userAnswer,
              score: answer.score,
              feedback: answer.feedback,
              improvementTips: answer.improvementTips,
            });
          }
        }
      }
    }

    return results;
  },

  // Finance & Treasury (Entrées / Sorties / Comptes étudiants)
  getTransactions(type?: 'INCOME' | 'EXPENSE'): Transaction[] {
    const data = ensureDb();
    let txs = [...(data.transactions || [])];
    if (type) {
      txs = txs.filter((t) => t.type === type);
    }
    return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  recordPayment(params: {
    userId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    description?: string;
  }): { transaction: Transaction; user: User } {
    const data = ensureDb();
    const user = data.users.find((u) => u.id === params.userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    if (!user.subscription) {
      user.subscription = {
        status: 'active',
        monthlyFee: 29,
        nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        totalDeposited: 0,
      };
    }

    user.subscription.status = 'active';
    user.subscription.totalDeposited = (user.subscription.totalDeposited || 0) + params.amount;
    user.subscription.lastPaymentDate = new Date().toISOString();
    user.subscription.nextDueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const tx: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      type: 'INCOME',
      amount: params.amount,
      currency: '€',
      category: 'Cotisation mensuelle cours',
      paymentMethod: params.paymentMethod,
      status: 'COMPLETED',
      description: params.description || `Paiement mensuel cours - Domaine ${user.targetDomain || 'Tech'} (${params.paymentMethod})`,
      date: new Date().toISOString(),
    };

    if (!data.transactions) data.transactions = [];
    data.transactions.unshift(tx);

    // Notification administrateur
    const notif: AdminNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: 'NEW_PAYMENT',
      title: 'Paiement mensuel reçu',
      message: `${user.name} a déposé ${params.amount} € (${params.paymentMethod}) pour la poursuite de ses cours en ${user.targetDomain || 'Informatique'}.`,
      userId: user.id,
      studentName: user.name,
      domain: user.targetDomain,
      level: user.targetLevel,
      amount: params.amount,
      read: false,
      createdAt: new Date().toISOString(),
    };
    if (!data.notifications) data.notifications = [];
    data.notifications.unshift(notif);

    writeDb(data);
    return { transaction: tx, user };
  },

  recordExpense(params: {
    amount: number;
    category: string;
    description: string;
    paymentMethod?: PaymentMethod;
  }): Transaction {
    const data = ensureDb();
    const tx: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: 'usr_admin_01',
      userName: 'Administration TechInterviews',
      userEmail: 'admin@techinterviews.io',
      type: 'EXPENSE',
      amount: params.amount,
      currency: '€',
      category: params.category,
      paymentMethod: params.paymentMethod || 'Virement Bancaire',
      status: 'COMPLETED',
      description: params.description,
      date: new Date().toISOString(),
    };

    if (!data.transactions) data.transactions = [];
    data.transactions.unshift(tx);
    writeDb(data);
    return tx;
  },

  getTreasuryStats(): TreasuryStats {
    const data = ensureDb();
    const transactions = data.transactions || [];
    const users = data.users || [];

    const totalIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = totalIncome - totalExpense;

    const students = users.filter((u) => u.role !== 'admin');
    const activeStudentsCount = students.filter((s) => s.subscription?.status === 'active').length;
    const pendingDueCount = students.filter(
      (s) => s.subscription?.status === 'pending' || s.subscription?.status === 'trial'
    ).length;

    const expectedMonthlyRevenue = students.reduce((sum, s) => sum + (s.subscription?.monthlyFee || 29), 0);

    return {
      totalBalance,
      totalIncome,
      totalExpense,
      activeStudentsCount,
      pendingDueCount,
      expectedMonthlyRevenue,
    };
  },

  getStudentAccounts(): {
    user: Omit<User, 'passwordHash'>;
    interviewsCount: number;
    averageScore: number;
    transactions: Transaction[];
  }[] {
    const data = ensureDb();
    const students = data.users.filter((u) => u.role !== 'admin');

    return students.map((u) => {
      const userInterviews = data.interviews.filter((i) => i.userId === u.id);
      const userTxs = (data.transactions || []).filter((t) => t.userId === u.id);
      const avgScore =
        userInterviews.length > 0
          ? Math.round(userInterviews.reduce((acc, i) => acc + i.globalScore, 0) / userInterviews.length)
          : 0;

      const { passwordHash: _, ...safeUser } = u;
      return {
        user: safeUser,
        interviewsCount: userInterviews.length,
        averageScore: avgScore,
        transactions: userTxs,
      };
    });
  },

  // Notifications
  getNotifications(): AdminNotification[] {
    const data = ensureDb();
    return (data.notifications || []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  markNotificationRead(id: string): boolean {
    const data = ensureDb();
    const notif = (data.notifications || []).find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      writeDb(data);
      return true;
    }
    return false;
  },

  markAllNotificationsRead(): void {
    const data = ensureDb();
    if (data.notifications) {
      data.notifications.forEach((n) => (n.read = true));
      writeDb(data);
    }
  },

  deleteNotification(id: string): boolean {
    const data = ensureDb();
    const initialLen = data.notifications?.length || 0;
    data.notifications = (data.notifications || []).filter((n) => n.id !== id);
    writeDb(data);
    return (data.notifications?.length || 0) < initialLen;
  },
};
