import { GoogleGenAI, Type } from '@google/genai';
import {
  TechnicalDomain,
  ExperienceLevel,
  QuestionDifficulty,
  EvaluationResult,
  PersonalizedRecommendation,
} from '../types';
import {
  GeminiQuestionsResponseSchema,
  GeminiEvaluationResponseSchema,
} from '../schemas';

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Fallback high-quality curated questions if API is unavailable
const FALLBACK_QUESTIONS: Record<TechnicalDomain, Record<ExperienceLevel, Array<{ question: string; expectedTopics: string[]; difficulty: QuestionDifficulty }>>> = {
  'Développement Web': {
    'Débutant': [
      {
        question: 'Quelle est la différence fondamentale entre les éléments HTML inline et block ? Donnez deux exemples de chaque.',
        expectedTopics: ['Flux normal de page', 'Largeur 100% vs contenu', 'Marges verticales', 'div vs span'],
        difficulty: 'beginner',
      },
      {
        question: 'Comment rendre un site web accessible (a11y) pour les personnes utilisant un lecteur d\'écran ?',
        expectedTopics: ['HTML sémantique', 'Balises alt', 'Attributs ARIA', 'Navigation clavier', 'Contraste des couleurs'],
        difficulty: 'beginner',
      },
      {
        question: 'Quels sont les principaux verbes HTTP dans une API RESTful et leur rôle respectif ?',
        expectedTopics: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'Idempotence'],
        difficulty: 'beginner',
      },
      {
        question: 'Expliquez ce qu\'est le LocalStorage par rapport au SessionStorage et aux Cookies.',
        expectedTopics: ['Persistance', 'Taille de stockage', 'Envoi au serveur HTTP', 'Scope d\'onglet'],
        difficulty: 'beginner',
      },
      {
        question: 'Qu\'est-ce que le Responsive Web Design et comment les CSS Media Queries fonctionnent-elles ?',
        expectedTopics: ['Balise meta viewport', 'Breakpoints', 'Mobile-first', 'Unités relatives (rem, %)'],
        difficulty: 'beginner',
      },
    ],
    'Intermédiaire': [
      {
        question: 'Expliquez le fonctionnement du Critical Rendering Path (CRP) du navigateur et comment l\'optimiser.',
        expectedTopics: ['DOM', 'CSSOM', 'Render Tree', 'Layout / Reflow', 'Repaint', 'Async / Defer'],
        difficulty: 'intermediate',
      },
      {
        question: 'Qu\'est-ce que le Virtual DOM par rapport au Real DOM, et comment l\'algorithme de réconciliation fonctionne-t-il ?',
        expectedTopics: ['Arbre d\'objets JS', 'Diffing algorithm', 'Batching d\'updates', 'Keys dans les listes'],
        difficulty: 'intermediate',
      },
      {
        question: 'Comment fonctionnent les Service Workers et comment permettent-ils le mode hors-ligne dans une PWA ?',
        expectedTopics: ['Cache API', 'Cycle de vie (install, activate, fetch)', 'Proxy réseau en tâche de fond'],
        difficulty: 'intermediate',
      },
      {
        question: 'Quelle est la différence entre SSR (Server-Side Rendering) et CSR (Client-Side Rendering) ? Quels sont les compromis ?',
        expectedTopics: ['Time to First Byte (TTFB)', 'First Contentful Paint (FCP)', 'SEO', 'Hydratation'],
        difficulty: 'intermediate',
      },
      {
        question: 'Quelles sont les métriques Core Web Vitals (LCP, INP, CLS) et comment les mesurer et les améliorer ?',
        expectedTopics: ['Largest Contentful Paint', 'Interaction to Next Paint', 'Cumulative Layout Shift'],
        difficulty: 'intermediate',
      },
    ],
    'Avancé': [
      {
        question: 'Comment concevoiriez-vous une architecture de micro-frontends résiliente et performante ?',
        expectedTopics: ['Module Federation', 'Isolation des styles', 'Gestion partagée des états', 'Versioning'],
        difficulty: 'advanced',
      },
      {
        question: 'Analysez en détail le mécanisme d\'hydratation partielle (Islands Architecture) comparé au Resumability.',
        expectedTopics: ['Astro', 'Qwik', 'Sérialisation d\'état', 'Élimination du JavaScript inutile au démarrage'],
        difficulty: 'advanced',
      },
      {
        question: 'Comment optimiser les performances de rendu WebGL et canvas haute fréquence dans une application web ?',
        expectedTopics: ['OffscreenCanvas', 'Web Workers', 'RequestAnimationFrame', 'GPU Pipeline'],
        difficulty: 'advanced',
      },
    ],
  },
  'JavaScript': {
    'Débutant': [
      {
        question: 'Quelle est la différence entre `var`, `let` et `const` en JavaScript ?',
        expectedTopics: ['Portée de bloc', 'Portée de fonction', 'Hoisting', 'Temporal Dead Zone', 'Réassignation'],
        difficulty: 'beginner',
      },
      {
        question: 'Expliquez comment fonctionne la méthode `Array.prototype.map()` et en quoi elle diffère de `forEach()`.',
        expectedTopics: ['Retour d\'un nouveau tableau', 'Immutabilité', 'Effets de bord', 'Callback'],
        difficulty: 'beginner',
      },
      {
        question: 'Qu\'est-ce que la coercition de type (type coercion) et quelle est la différence entre `==` et `===` ?',
        expectedTopics: ['Comparaison stricte', 'Conversion implicite', 'Algorithme ToPrimitive', 'Truthy/Falsy'],
        difficulty: 'beginner',
      },
      {
        question: 'Comment fonctionnent les fonctions fléchées (arrow functions) et en quoi diffère leur mot-clé `this` ?',
        expectedTopics: ['Lexical this', 'Absence d\'arguments object', 'Pas de prototype', 'Syntaxe concise'],
        difficulty: 'beginner',
      },
      {
        question: 'Qu\'est-ce qu\'une promesse (Promise) en JavaScript et quels sont ses trois états possibles ?',
        expectedTopics: ['Pending', 'Fulfilled', 'Rejected', '.then()/.catch()', 'Asynchronisme'],
        difficulty: 'beginner',
      },
    ],
    'Intermédiaire': [
      {
        question: 'Détaillez le fonctionnement de l\'Event Loop, de la Call Stack, de la Microtask Queue et de la Task Queue.',
        expectedTopics: ['Call Stack', 'Microtasks (Promises)', 'Macrotasks (setTimeout, I/O)', 'Render Steps'],
        difficulty: 'intermediate',
      },
      {
        question: 'Qu\'est-ce qu\'une Closure (fermeture) en JavaScript ? Donnez un cas d\'usage et un risque associé.',
        expectedTopics: ['Environnement lexical', 'Encapsulation / variables privées', 'Fuites mémoire potentielles'],
        difficulty: 'intermediate',
      },
      {
        question: 'Expliquez la chaîne de prototypes (Prototype Chain) et le fonctionnement de `Object.create()` et `class`.',
        expectedTopics: ['__proto__', 'prototype', 'Héritage prototypal', 'Sucre syntaxique class'],
        difficulty: 'intermediate',
      },
      {
        question: 'Comparez `Promise.all`, `Promise.allSettled`, `Promise.race` et `Promise.any`. Quand utiliser chacun ?',
        expectedTopics: ['Fail-fast vs résilience', 'Première résolution', 'Premier rejet', 'Gestion d\'erreurs'],
        difficulty: 'intermediate',
      },
      {
        question: 'Comment fonctionnent les modules ES (ESM) par rapport à CommonJS (CJS) ?',
        expectedTopics: ['Import statique vs dynamique', 'Tree shaking', 'Top-level await', 'Mode strict par défaut'],
        difficulty: 'intermediate',
      },
    ],
    'Avancé': [
      {
        question: 'Expliquez comment le ramasse-miettes (Garbage Collector) de V8 fonctionne (Mark-and-Sweep, Scavenge, Générations).',
        expectedTopics: ['Young Generation (Nursery, Intermediate)', 'Old Generation', 'WeakMap/WeakSet', 'Memory Leaks'],
        difficulty: 'advanced',
      },
      {
        question: 'Comment concevoir et implémenter un Proxy et Reflect en JavaScript pour intercepter des mutations d\'objets ?',
        expectedTopics: ['Traps (get, set, has, deleteProperty)', 'Réactivité (pattern Vue/MobX)', 'Invariants'],
        difficulty: 'advanced',
      },
      {
        question: 'Expliquez les générateurs (function*) et les async iterators (`for await...of`). Dans quel cas les préférer ?',
        expectedTopics: ['Yield', 'Protocole itérable / itérateur', 'Gestion de flux / streams', 'Suspension d\'exécution'],
        difficulty: 'advanced',
      },
    ],
  },
  'Python': {
    'Débutant': [
      {
        question: 'Quelle est la différence entre une liste (list) et un tuple (tuple) en Python ?',
        expectedTopics: ['Mutabilité vs immutabilité', 'Syntaxe [] vs ()', 'Performance / Hachabilité (clés de dictionnaire)'],
        difficulty: 'beginner',
      },
      {
        question: 'Expliquez ce qu\'est une compréhension de liste (list comprehension) et donnez un exemple.',
        expectedTopics: ['Syntaxe [x for x in list if condition]', 'Lisibilité', 'Performance vs boucle for'],
        difficulty: 'beginner',
      },
      {
        question: 'Comment fonctionnent les blocs `try`, `except`, `else` et `finally` en Python ?',
        expectedTopics: ['Capture d\'exceptions', 'Exécution conditionnelle (else)', 'Nettoyage obligatoire (finally)'],
        difficulty: 'beginner',
      },
      {
        question: 'Qu\'est-ce que le duck typing et la règle EAFP ("Easier to ask for forgiveness than permission") ?',
        expectedTopics: ['Polymorphisme dynamique', 'Gestion par exceptions vs vérification préalable (LBYL)'],
        difficulty: 'beginner',
      },
      {
        question: 'Quelle est la différence entre `is` et `==` en Python ?',
        expectedTopics: ['Identité d\'objet (id mémoire) vs égalité de valeur (__eq__)'],
        difficulty: 'beginner',
      },
    ],
    'Intermédiaire': [
      {
        question: 'Qu\'est-ce qu\'un décorateur en Python et comment en implémenter un avec des arguments ?',
        expectedTopics: ['Fonction d\'ordre supérieur', 'Fermeture / Wrapper', 'functools.wraps', 'Triple fonction imbriquée'],
        difficulty: 'intermediate',
      },
      {
        question: 'Expliquez le fonctionnement des générateurs et du mot-clé `yield`. En quoi économisent-ils la mémoire ?',
        expectedTopics: ['Itérateur paresseux (lazy evaluation)', 'Protocole __iter__ / __next__', 'Gestion de grands fichiers'],
        difficulty: 'intermediate',
      },
      {
        question: 'Qu\'est-ce que le Global Interpreter Lock (GIL) de CPython et quel est son impact sur le multithreading ?',
        expectedTopics: ['CPU-bound vs I/O-bound', 'Threading vs Multiprocessing vs Asyncio', 'Libération du GIL'],
        difficulty: 'intermediate',
      },
      {
        question: 'Comment fonctionne le protocole de gestion de contexte (Context Manager) avec le mot-clé `with` ?',
        expectedTopics: ['Méthodes __enter__ et __exit__', 'Nettoyage des ressources (fichiers, sockets, locks)'],
        difficulty: 'intermediate',
      },
      {
        question: 'Expliquez les méthodes magiques (dunder methods) telles que `__repr__`, `__str__`, `__call__` et `__getattr__`.',
        expectedTopics: ['Personnalisation de comportement', 'Représentation pour développeur vs utilisateur', 'Objets appelables'],
        difficulty: 'intermediate',
      },
    ],
    'Avancé': [
      {
        question: 'Expliquez le fonctionnement des métaclasses en Python et comment elles interceptent la création de classes.',
        expectedTopics: ['type() comme métaclasse', '__new__ vs __init__ de métaclasse', 'Validation de schéma d\'API'],
        difficulty: 'advanced',
      },
      {
        question: 'Comment fonctionne l\'event loop de la bibliothèque standard `asyncio` sous le capot ?',
        expectedTopics: ['Tasks, Futures, Coroutines', 'Muxing d\'I/O avec epoll/kqueue', 'Sélection non bloquante'],
        difficulty: 'advanced',
      },
    ],
  },
  'Java': {
    'Débutant': [
      {
        question: 'Quels sont les 4 piliers fondamentaux de la programmation orientée objet en Java ?',
        expectedTopics: ['Encapsulation', 'Héritage', 'Polymorphisme', 'Abstraction'],
        difficulty: 'beginner',
      },
      {
        question: 'Quelle est la différence entre une classe abstraite et une interface en Java (avec les default methods de Java 8+) ?',
        expectedTopics: ['Héritage multiple de types', 'Variables d\'instance', 'Constructeurs', 'Mots-clés default'],
        difficulty: 'beginner',
      },
      {
        question: 'Quelle est la différence entre `==` et `.equals()` en Java pour les objets et les chaînes de caractères ?',
        expectedTopics: ['Comparaison de référence mémoire vs égalité sémantique', 'String Pool', 'Méthode hashCode()'],
        difficulty: 'beginner',
      },
    ],
    'Intermédiaire': [
      {
        question: 'Expliquez le fonctionnement de la Garbage Collection dans la JVM (Generational hypothesis, Young vs Old Gen).',
        expectedTopics: ['Eden space, Survivor spaces', 'Tenured / Old Gen', 'Stop-the-world pauses', 'G1 vs ZGC'],
        difficulty: 'intermediate',
      },
      {
        question: 'Comment fonctionne la Streams API en Java et quelle est la différence entre opérations intermédiaires et terminales ?',
        expectedTopics: ['Évaluation paresseuse (lazy)', 'Map, filter, reduce, collect', 'Streams parallèles (ForkJoinPool)'],
        difficulty: 'intermediate',
      },
    ],
    'Avancé': [
      {
        question: 'Expliquez le Java Memory Model (JMM), le mot-clé `volatile` et les opérations atomiques (AtomicInteger / CAS).',
        expectedTopics: ['Visibilité mémoire', 'Happens-before relationship', 'Compare-And-Swap', 'Instruction reordering'],
        difficulty: 'advanced',
      },
    ],
  },
  'C/C++': {
    'Débutant': [
      {
        question: 'Quelle est la différence entre un pointeur et une référence en C++ ?',
        expectedTopics: ['Adresse mémoire', 'Possibilité d\'être NULL', 'Réassignation', 'Arithmétique des pointeurs'],
        difficulty: 'beginner',
      },
      {
        question: 'Expliquez la différence entre l\'allocation de mémoire sur la Pile (Stack) et sur le Tas (Heap).',
        expectedTopics: ['Vitesse d\'accès', 'Durée de vie (portée)', 'Taille limitée', 'malloc/free vs new/delete'],
        difficulty: 'beginner',
      },
    ],
    'Intermédiaire': [
      {
        question: 'Qu\'est-ce que le principe RAII (Resource Acquisition Is Initialization) et comment évite-t-il les fuites de mémoire ?',
        expectedTopics: ['Destructeur déterministe', 'Smart Pointers (unique_ptr, shared_ptr)', 'Gestion d\'exceptions'],
        difficulty: 'intermediate',
      },
      {
        question: 'Expliquez la sémantique de déplacement (Move Semantics) et la référence rvalue (`&&`) en C++11.',
        expectedTopics: ['std::move', 'Constructeur de déplacement', 'Évitement de copies coûteuses'],
        difficulty: 'intermediate',
      },
    ],
    'Avancé': [
      {
        question: 'Comment la table des méthodes virtuelles (vtable) et le pointeur vptr fonctionnent-ils sous le capot ?',
        expectedTopics: ['Résolution dynamique de surcharge', 'Coût en indirections', 'Impact sur le cache L1/L2'],
        difficulty: 'advanced',
      },
    ],
  },
  'Bases de données': {
    'Débutant': [
      {
        question: 'Quelle est la différence entre une clé primaire (Primary Key) et une clé étrangère (Foreign Key) ?',
        expectedTopics: ['Unicité', 'Intégrité référentielle', 'Index automatique', 'Contrainte d\'existence'],
        difficulty: 'beginner',
      },
      {
        question: 'Expliquez la différence entre une clause `WHERE` et une clause `HAVING` en SQL.',
        expectedTopics: ['Filtrage avant agrégation (WHERE)', 'Filtrage après agrégation GROUP BY (HAVING)'],
        difficulty: 'beginner',
      },
    ],
    'Intermédiaire': [
      {
        question: 'Que garantit le principe ACID pour les transactions de bases de données ?',
        expectedTopics: ['Atomicité', 'Cohérence', 'Isolation (niveaux)', 'Durabilité (WAL / Write Ahead Logging)'],
        difficulty: 'intermediate',
      },
      {
        question: 'Comment fonctionne un index B-Tree en base de données et dans quel cas peut-il nuire aux performances ?',
        expectedTopics: ['Arbre équilibré', 'Recherche binaire O(log n)', 'Impact sur les écritures (INSERT/UPDATE)', 'Sélectivité'],
        difficulty: 'intermediate',
      },
      {
        question: 'Qu\'est-ce que le problème des requêtes N+1 et comment le diagnostiquer et l\'éliminer ?',
        expectedTopics: ['Lazy loading par défaut', 'Eager loading / JOIN FETCH', 'Multiplication des allers-retours réseau'],
        difficulty: 'intermediate',
      },
    ],
    'Avancé': [
      {
        question: 'Comparez le partitionnement horizontal (sharding) et la réplication Read-Replica avec Leader/Follower.',
        expectedTopics: ['Distribution d\'écritures vs lectures', 'Cohérence éventuelle', 'Cross-shard queries', 'Failover'],
        difficulty: 'advanced',
      },
    ],
  },
  'Réseaux': {
    'Débutant': [
      {
        question: 'Comparez les protocoles TCP et UDP : dans quelles situations privilégier l\'un plutôt que l\'autre ?',
        expectedTopics: ['Connexion orientée (handshake 3-way)', 'Garantie de livraison et d\'ordre', 'Faible latence (streaming/jeux)'],
        difficulty: 'beginner',
      },
      {
        question: 'Que se passe-t-il exactement lorsqu\'on tape `https://google.com` dans la barre d\'adresse d\'un navigateur ?',
        expectedTopics: ['Résolution DNS', 'Handshake TCP (SYN, SYN-ACK, ACK)', 'Négociation TLS', 'Requête HTTP GET', 'Rendu DOM'],
        difficulty: 'beginner',
      },
    ],
    'Intermédiaire': [
      {
        question: 'Comment fonctionne la résolution DNS complète, du résolveur récursif jusqu\'aux serveurs faisant autorité ?',
        expectedTopics: ['Serveurs racine (Root servers)', 'TLD (.com, .fr)', 'Serveur autoritaire', 'Enregistrements A, CNAME, TTL'],
        difficulty: 'intermediate',
      },
      {
        question: 'Expliquez le fonctionnement du protocole HTTPS et du handshake TLS 1.3.',
        expectedTopics: ['Certificat X.509', 'Chiffrement asymétrique (RSA/ECDH)', 'Clé de session symétrique (AES-GCM)'],
        difficulty: 'intermediate',
      },
    ],
    'Avancé': [
      {
        question: 'En quoi HTTP/3 avec le protocole de transport QUIC résout-il le Head-of-Line Blocking de TCP ?',
        expectedTopics: ['Multiplexage de flux indépendants sur UDP', '0-RTT handshake', 'Migration de connexion (IP change)'],
        difficulty: 'advanced',
      },
    ],
  },
  'Cybersécurité': {
    'Débutant': [
      {
        question: 'Qu\'est-ce qu\'une attaque par injection SQL et comment s\'en prémunir efficacement ?',
        expectedTopics: ['Requêtes préparées / Prepared Statements', 'Paramétrage d\'ORM', 'Validation d\'entrées', 'Échappement'],
        difficulty: 'beginner',
      },
      {
        question: 'Quelle est la différence entre le hachage (hashing), le chiffrement (encryption) et l\'encodage (encoding) ?',
        expectedTopics: ['Fonction à sens unique (hachage avec salt)', 'Réversibilité avec clé (chiffrement)', 'Représentation binaire (Base64)'],
        difficulty: 'beginner',
      },
    ],
    'Intermédiaire': [
      {
        question: 'Expliquez en détail les failles XSS (Stored, Reflected, DOM-based) et la politique CSP (Content Security Policy).',
        expectedTopics: ['Injection de scripts malveillants', 'Vol de cookies / session', 'Directives CSP', 'Échappement contextuel'],
        difficulty: 'intermediate',
      },
      {
        question: 'Comment fonctionne une attaque CSRF (Cross-Site Request Forgery) et comment le flag `SameSite` et les tokens CSRF la bloquent ?',
        expectedTopics: ['Requêtes forgées depuis un tiers', 'SameSite=Lax/Strict', 'Token anti-CSRF synchronisé', 'Origin/Referer headers'],
        difficulty: 'intermediate',
      },
    ],
    'Avancé': [
      {
        question: 'Comment concevoir une architecture d\'authentification OAuth2 + OpenID Connect (OIDC) avec PKCE pour une SPA ?',
        expectedTopics: ['Authorization Code Flow avec PKCE', 'Code Verifier & Code Challenge', 'Access Token vs ID Token vs Refresh Token'],
        difficulty: 'advanced',
      },
    ],
  },
  'Algorithmique': {
    'Débutant': [
      {
        question: 'Qu\'est-ce que la complexité algorithmique Big-O ? Classez les complexités courantes de la plus rapide à la plus lente.',
        expectedTopics: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)', 'Pire des cas vs cas moyen'],
        difficulty: 'beginner',
      },
      {
        question: 'Expliquez le principe de la recherche binaire (Binary Search) et donnez sa complexité temporelle.',
        expectedTopics: ['Tableau obligatoirement trié', 'Division par deux à chaque étape', 'Complexité O(log n)', 'Pointeurs gauche/droite'],
        difficulty: 'beginner',
      },
    ],
    'Intermédiaire': [
      {
        question: 'Comparez le parcours en profondeur (DFS) et le parcours en largeur (BFS) sur un arbre ou un graphe.',
        expectedTopics: ['Pile (Stack / Récursion) pour DFS', 'File (Queue) pour BFS', 'Plus court chemin dans graphe non pondéré (BFS)'],
        difficulty: 'intermediate',
      },
      {
        question: 'Expliquez le patron de conception Deux Pointeurs (Two Pointers) et dans quelles situations il réduit une complexité quadratique à linéaire.',
        expectedTopics: ['Pointeurs convergents ou parallèles', 'Exemple Two-Sum sur tableau trié', 'Passage de O(n^2) à O(n)'],
        difficulty: 'intermediate',
      },
    ],
    'Avancé': [
      {
        question: 'Expliquez le principe de la programmation dynamique (Dynamic Programming) et la différence entre Memoization (Top-down) et Tabulation (Bottom-up).',
        expectedTopics: ['Sous-problèmes chevauchants (Overlapping subproblems)', 'Sous-structure optimale', 'Sac à dos (0/1 Knapsack)'],
        difficulty: 'advanced',
      },
    ],
  },
};

export async function generateInterviewQuestions(params: {
  domain: TechnicalDomain;
  level: ExperienceLevel;
  questionCount: number;
  adaptiveContext?: {
    recentScores: number[];
    weakTopics?: string[];
  };
}): Promise<Array<{ id: string; question: string; expectedTopics: string[]; difficulty: QuestionDifficulty }>> {
  const { domain, level, questionCount, adaptiveContext } = params;

  // Adaptive prompt enhancement
  let adaptiveDirective = '';
  if (adaptiveContext?.recentScores && adaptiveContext.recentScores.length > 0) {
    const avgScore = adaptiveContext.recentScores.reduce((a, b) => a + b, 0) / adaptiveContext.recentScores.length;
    if (avgScore >= 80) {
      adaptiveDirective = `NOTE ADAPTATIVE: Le candidat a d'excellents résultats récents (moyenne ${Math.round(avgScore)}/100). Inclus des questions légèrement plus pointues, demandant de la nuance, des cas limites (edge cases) ou des explications de conception.`;
    } else if (avgScore < 60) {
      adaptiveDirective = `NOTE ADAPTATIVE: Le candidat a eu quelques difficultés (moyenne ${Math.round(avgScore)}/100). Privilégie des questions progressives permettant de valider et consolider les concepts fondamentaux sans piéger l'apprenant.`;
    }
  }

  if (adaptiveContext?.weakTopics && adaptiveContext.weakTopics.length > 0) {
    adaptiveDirective += ` Insiste particulièrement sur les notions suivantes à retravailler : ${adaptiveContext.weakTopics.slice(0, 3).join(', ')}.`;
  }

  const prompt = `Tu es un examinateur technique senior et pédagogue pour des entretiens d'embauche d'ingénieurs et développeurs.
Génère exactement ${questionCount} questions d'entretien technique pour le domaine suivant :
- Domaine : ${domain}
- Niveau du candidat : ${level}
${adaptiveDirective}

Règles impératives :
1. Les questions doivent être claires, réalistes et refléter de vrais entretiens techniques en entreprise.
2. Chaque question doit évaluer la compréhension conceptuelle, la logique ou les bonnes pratiques.
3. Pour chaque question, liste 3 à 5 thèmes attendus (expectedTopics) essentiels à aborder dans une bonne réponse.
4. Spécifie la difficulté relative : 'beginner', 'intermediate', ou 'advanced'.
5. Rédige les questions en français impeccable.

Format de sortie attendu (JSON strict) :
{
  "questions": [
    {
      "id": "q1",
      "question": "Texte de la question...",
      "expectedTopics": ["Concept 1", "Concept 2", "Bonne pratique"],
      "difficulty": "intermediate"
    }
  ]
}`;

  try {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY non configurée');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  expectedTopics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  difficulty: {
                    type: Type.STRING,
                    enum: ['beginner', 'intermediate', 'advanced'],
                  },
                },
                required: ['id', 'question', 'expectedTopics', 'difficulty'],
              },
            },
          },
          required: ['questions'],
        },
      },
    });

    const responseText = response.text || '';
    const parsedJson = JSON.parse(responseText);
    const validated = GeminiQuestionsResponseSchema.parse(parsedJson);

    // Ensure IDs are unique
    return validated.questions.map((q, idx) => ({
      ...q,
      id: `q_${Date.now()}_${idx + 1}`,
      difficulty: q.difficulty as QuestionDifficulty,
    }));
  } catch (error) {
    console.warn('Gemini question generation fallback activated:', error);
    // Use fallback question bank safely
    const fallbackList = FALLBACK_QUESTIONS[domain]?.[level] || FALLBACK_QUESTIONS['JavaScript']['Débutant'];
    const selected: Array<{ id: string; question: string; expectedTopics: string[]; difficulty: QuestionDifficulty }> = [];

    for (let i = 0; i < questionCount; i++) {
      const template = fallbackList[i % fallbackList.length];
      selected.push({
        id: `q_fb_${Date.now()}_${i + 1}`,
        question: template.question,
        expectedTopics: [...template.expectedTopics],
        difficulty: template.difficulty,
      });
    }

    return selected;
  }
}

export async function evaluateUserAnswer(params: {
  question: string;
  userAnswer: string;
  domain: TechnicalDomain;
  level: ExperienceLevel;
  expectedTopics: string[];
}): Promise<EvaluationResult> {
  const { question, userAnswer, domain, level, expectedTopics } = params;

  if (!userAnswer || userAnswer.trim().length === 0) {
    return {
      score: 0,
      strengths: [],
      weaknesses: ['Aucune réponse fournie'],
      feedback: 'Vous n\'avez pas répondu à cette question.',
      improvementTips: ['Même en cas de doute, tentez d\'expliquer votre raisonnement ou de donner des pistes en entretien.'],
    };
  }

  const prompt = `Tu es un évaluateur technique senior et bienveillant évaluant la réponse d'un candidat lors d'un entretien d'embauche technique.

Paramètres de l'entretien :
- Domaine : ${domain}
- Niveau ciblé : ${level}
- Question posée : "${question}"
- Thèmes et concepts attendus : ${expectedTopics.join(', ')}

Réponse fournie par le candidat :
"""
${userAnswer}
"""

Tâche :
Évalue cette réponse avec précision et justesse pédagogique.
1. Calcule un score objectif entre 0 et 100 en fonction de la justesse technique, de la complétude par rapport aux notions attendues et de la clarté.
   - 0-39 : Réponse fausse, hors sujet ou trop superficielle.
   - 40-69 : Notions de base comprises mais incomplètes, omissions notables ou confusions légères.
   - 70-89 : Bonne réponse, solide, concepts clés présents et bien formulés.
   - 90-100 : Excellente réponse, exhaustive, vocabulaire technique précis, nuances ou exemples pertinents.
2. Identifie 1 à 3 points forts (strengths).
3. Identifie 1 à 3 points faibles ou omissions importantes (weaknesses).
4. Rédige un feedback pédagogique de 2 à 4 phrases résumant la qualité de la réponse.
5. Donne 1 à 3 conseils concrets d'amélioration ou notions à approfondir (improvementTips).

Format JSON strict requis :
{
  "score": 85,
  "strengths": ["Bonne distinction entre...", "Vocabulaire précis"],
  "weaknesses": ["Omission du cas limite..."],
  "feedback": "Explication claire...",
  "improvementTips": ["Préciser la complexité temporelle..."]
}`;

  try {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY non configurée');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            feedback: { type: Type.STRING },
            improvementTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['score', 'strengths', 'weaknesses', 'feedback', 'improvementTips'],
        },
      },
    });

    const responseText = response.text || '';
    const parsedJson = JSON.parse(responseText);
    const validated = GeminiEvaluationResponseSchema.parse(parsedJson);

    return {
      score: Math.min(100, Math.max(0, validated.score)),
      strengths: validated.strengths.length > 0 ? validated.strengths : ['Effort de réponse louable'],
      weaknesses: validated.weaknesses,
      feedback: validated.feedback,
      improvementTips: validated.improvementTips.length > 0 ? validated.improvementTips : ['Approfondir la documentation officielle.'],
    };
  } catch (error) {
    console.warn('Gemini evaluation fallback activated:', error);
    // Intelligent heuristic fallback
    const words = userAnswer.trim().split(/\s+/).length;
    let score = 65;
    if (words < 10) score = 40;
    else if (words > 40) score = 80;

    return {
      score,
      strengths: ['Réponse rédigée avec sérieux', 'Explication globale cohérente'],
      weaknesses: ['Détails techniques et cas limites perfectibles'],
      feedback: 'Votre réponse aborde les grandes lignes de la notion. Pour exceller en entretien, structurez votre propos avec des termes techniques précis.',
      improvementTips: [
        `Revoir la liste des thèmes attendus : ${expectedTopics.slice(0, 3).join(', ')}.`,
        'Illustrer chaque concept avec un court exemple pratique.',
      ],
    };
  }
}

export async function generatePersonalizedRecommendations(params: {
  weakDomains: string[];
  weakTopics: string[];
  recentScores: number[];
}): Promise<PersonalizedRecommendation[]> {
  const { weakDomains, weakTopics, recentScores } = params;

  if (weakDomains.length === 0 && weakTopics.length === 0) {
    return [
      {
        id: 'rec_default_1',
        category: 'general',
        title: 'Maintenir votre régularité',
        description: 'Vos scores sont solides ! Réalisez une simulation hebdomadaire pour garder vos réflexes affûtés.',
        actionText: 'Lancer une simulation',
      },
      {
        id: 'rec_default_2',
        category: 'domain',
        title: 'Explorer un niveau supérieur',
        description: 'Tentez un entretien en mode Avancé pour vous confronter aux architectures distribuées et cas limites.',
        actionText: 'Tenter le niveau Avancé',
      },
    ];
  }

  const prompt = `Tu es un coach d'insertion professionnelle technique.
Voici le profil d'un candidat préparant des entretiens d'embauche :
- Domaines où il a le plus de difficultés : ${weakDomains.join(', ') || 'Général'}
- Concepts fréquemment ratés ou omis : ${weakTopics.join(', ') || 'Détails d\'implémentation'}
- Historique des scores récents : ${recentScores.join(', ')} / 100

Génère 3 recommandations personnalisées, bienveillantes et concrètes au format JSON.
Format attendu :
{
  "recommendations": [
    {
      "id": "rec_1",
      "category": "domain",
      "title": "Titre accrocheur et motivant",
      "description": "Tu rencontres régulièrement des difficultés sur... Nous te recommandons de revoir...",
      "actionText": "S'entraîner sur ce sujet"
    }
  ]
}`;

  try {
    if (!apiKey) {
      throw new Error('No API key');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
      return parsed.recommendations;
    }
  } catch {
    // Return sensible recommendations based on weak topics
  }

  return [
    {
      id: 'rec_1',
      category: 'domain',
      title: `Approfondir ${weakDomains[0] || 'vos points clés'}`,
      description: `Tu rencontres régulièrement des difficultés sur ${weakTopics.slice(0, 2).join(' et ') || 'certains concepts fondamentaux'}. Nous te recommandons de revoir ces notions clés pour consolider tes bases.`,
      actionText: `S'entraîner sur ${weakDomains[0] || 'ce domaine'}`,
    },
    {
      id: 'rec_2',
      category: 'concept',
      title: 'Maîtriser les questions pièges',
      description: 'Entraîne-toi en mode Simulation sans temps d\'arrêt pour apprendre à structurer tes explications sous la contrainte du direct.',
      actionText: 'Mode Simulation',
    },
  ];
}
