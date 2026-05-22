/* eslint-disable react/no-unescaped-entities */
import React from "react";

function page() {
  return (
    <div>
      dev
      <section>
        Voici la liste des fonctionnalités essentielles, classées par étapes du
        parcours utilisateur : 1. La recherche et l'inspiration (Avant de
        cuisiner) C'est la porte d'entrée de l'application. Elle doit être
        intuitive et s'adapter aux contraintes de chacun. Recherche par filtres
        avancés : Filtrer par type de plat (entrée, plat, dessert), temps de
        préparation, niveau de difficulté, ou encore coût des ingrédients.
        Gestion des régimes et allergies : Profil utilisateur permettant de
        masquer automatiquement les recettes contenant du gluten, du lactose, de
        la viande (végan/végétarien), ou certains allergènes. Le "Vide-Frigo"
        (Recherche par ingrédients) : L'utilisateur coche ce qu'il a dans son
        frigo (ex: courgettes, poulet, crème), et l'application lui propose les
        recettes réalisables avec ces éléments. Menu de la semaine /
        Planificateur : Permettre de planifier ses repas du lundi au dimanche
        pour mieux s'organiser. 2. L'aide aux courses (La préparation) Une bonne
        application de cuisine fait aussi gagner du temps au supermarché.
        Génération automatique de la liste de courses : En un clic, les
        ingrédients d'une ou plusieurs recettes sélectionnées s'ajoutent à une
        liste de courses. Ajustement des portions : Si une recette est pour 4
        personnes mais qu'ils sont 6, l'application recalcule automatiquement
        les quantités de la recette ET de la liste de courses. Ingrédients
        cochables : Pouvoir rayer de la liste les ingrédients que l'on a déjà
        dans ses placards avant d'aller au magasin. 3. L'expérience en cuisine
        (Pendant la cuisson) C'est le moment critique où l'utilisateur a les
        mains sales et manipule son téléphone ou sa tablette. Mode "Cuisine"
        (Mains-libres) : Un affichage épuré, étape par étape, en gros
        caractères. Idéalement, passage à l'étape suivante par commande vocale
        (ex: "Suivant") ou via un capteur de mouvement pour ne pas toucher
        l'écran avec des mains pleines de farine. Anti-mise en veille de l'écran
        : Bloquer le verrouillage automatique du téléphone tant que le mode
        cuisine est actif. Minuteurs intégrés : Des minuteurs cliquables
        directement dans le texte de la recette (ex: "Laissez mijoter pendant 15
        minutes" - un clic lance le compte à rebours). 4. Aspect communautaire
        et personnalisation Pour fidéliser les utilisateurs et faire vivre
        l'application. Carnet de recettes personnelles : Sauvegarder ses
        recettes préférées dans des dossiers personnalisés (ex: "Repas de fête",
        "Recettes express"). Ajout de notes privées : Pouvoir ajouter un
        commentaire sur une recette existante (ex: "Mettre un peu moins de sucre
        la prochaine fois"). Notes, avis et photos : Permettre à la communauté
        de noter les recettes, de partager leurs astuces en commentaire ou de
        poster la photo de leur propre résultat. Créateur de recettes :
        Permettre aux utilisateurs de rédiger et publier leurs propres créations
        sur la plateforme. La feature "Bonus" qui fait la différence :
        L'intégration avec les drives des supermarchés. En un clic, la liste de
        courses de l'application est envoyée sur le panier de l'enseigne
        préférée de l'utilisateur (Chronodrive, Carrefour Drive, Leclerc
        Drive...) pour n'avoir plus qu'à récupérer ses courses.
      </section>
      <section>
        Voici le parcours utilisateur (UX) idéal, découpé étape par étape, pensé
        pour minimiser les efforts. Étape 1 : L'accès et l'état d'esprit
        L'utilisateur ouvre l'application avec une frustration : "Je ne sais pas
        quoi faire à manger et je ne veux pas faire de courses." Le déclencheur
        UX : Un bouton d'action principal (CTA) visible dès l'écran d'accueil,
        par exemple un onglet dédié ou un bouton flottant illustré par un frigo,
        intitulé "Je vide mon frigo". L'ambiance visuelle : Un écran épuré pour
        réduire la charge mentale. L'accent est mis sur la simplicité. Étape 2 :
        La saisie des ingrédients (Zéro friction) C'est l'étape la plus
        critique. Taper 10 ingrédients au clavier est fastidieux. Il faut
        multiplier les modes de saisie. La barre de recherche prédictive : Dès
        que l'utilisateur tape "Pou...", l'application suggère "Poulet",
        "Poireau", "Pomme de terre". Un clic sur la suggestion ajoute
        l'ingrédient sous forme de "badge" ou de "tag" visuel (avec une petite
        croix pour le supprimer). La grille de sélection rapide (Le "Top
        Ingrédients") : Une liste visuelle (avec icônes) des 15 ou 20
        ingrédients les plus courants (Œufs, Crème, Pâtes, Tomates, Oignons,
        Fromage râpé). L'utilisateur n'a qu'à tapoter pour les sélectionner. La
        reconnaissance vocale : Un bouton micro permettant de dicter sa liste
        d'un coup : "J'ai des courgettes, du saumon et du riz". L'IA de
        l'application segmente les mots et crée les badges automatiquement. Le
        scan du ticket de caisse ou historique (Option avancée) : Si
        l'application gère déjà les listes de courses, elle peut pré-remplir le
        frigo virtuel en fonction des derniers achats. Étape 3 : La
        qualification des ingrédients (Optionnel mais malin) Pour affiner les
        résultats sans alourdir l'écran. L'ingrédient "Star" : Permettre de
        double-cliquer sur un ingrédient pour le marquer comme "À consommer
        d'urgence" (ex: une viande dont la date limite approche). L'algorithme
        priorisera les recettes contenant cet ingrédient précis. Les basiques du
        placard invisibles : L'application part du principe que l'utilisateur a
        du sel, du poivre, de l'huile et de l'eau. Inutile de lui demander de
        les saisir. Un paramètre discret permet de cocher s'il possède les
        "essentiels" (farine, sucre, beurre, lait). Étape 4 : La page de
        résultats (La clarté avant tout) L'utilisateur clique sur "Trouver des
        recettes". L'affichage des résultats doit être ultra-transparent sur ce
        qu'il manque éventuellement. Tri par "Taux de correspondance" :
        Catégorie 1 : "Recettes 100% réalisables" (Aucun achat requis).
        Catégorie 2 : "Il vous manque 1 ou 2 ingrédients" (Ex: Vous avez tout
        sauf du persil). Visualisation des ingrédients manquants : Sur la carte
        de la recette, les ingrédients possédés sont en vert (ou cochés), et
        l'ingrédient manquant est écrit en rouge ou grisé avec un bouton + pour
        l'ajouter à la liste de courses si besoin. Filtres de secours rapides :
        En haut des résultats, des boutons pour filtrer en un clin d'œil :
        "Moins de 20 min", "Pas de cuisson au four" (si on est pressé). Étape 5
        : La flexibilité dans la recette (L'astuce anti-déception) L'utilisateur
        choisit une recette, mais un détail coince (ex: il a de la crème
        fraîche, la recette demande du lait de coco). Le système de substitution
        intelligent : Directement dans la liste des ingrédients de la recette,
        l'application propose des alternatives. Exemple : "Lait de coco (peut
        être remplacé par : Crème fraîche liquide que vous possédez)". Cela
        évite que l'utilisateur abandonne la recette. Résumé des bonnes
        pratiques UX pour cette feature : Donner le contrôle : L'utilisateur
        doit pouvoir ajouter/enlever un ingrédient en un seul clic. Valoriser
        l'effort : Lui montrer visuellement qu'il va économiser de l'argent ou
        éviter le gaspillage (ex: un petit badge "Anti-gaspillage" sur les
        recettes qui utilisent ses ingrédients urgents). Être tolérant : Ne pas
        bloquer la recherche s'il n'y a pas de correspondance exacte, toujours
        proposer des recettes "approchantes".
      </section>
    </div>
  );
}

export default page;
