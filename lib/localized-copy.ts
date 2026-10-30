export const localizedCopy = {
  fr: {
    homeHeading: "Créer une fiche à partir d’une image",
    homeIntro: "Choisissez une image au sujet bien détaché : un dessin simple sur fond clair facilite le suivi du contour. Le générateur transforme l’image en fiche à imprimer ; il ne s’agit pas d’un jeu de tracé en ligne.",
    steps: ["Importez une image avec le bouton principal ci-dessus.", "Réglez le nombre de points, puis vérifiez l’aperçu et l’ordre des numéros.", "Téléchargez le résultat courant en PNG ou en PDF. Si le traitement échoue, réessayez ou choisissez une autre image."],
    upload: "Aller au bouton d’importation", browse: "Télécharger des fiches PDF", collectionHeading: "Défis en plusieurs segments — fiches en français",
    collectionIntro: "Deux dessins originaux : un hibou de 207 points en 10 segments et un observatoire de 202 points en 9 segments. Chaque fiche possède son propre corrigé, en A4 et au format Lettre US.",
    paper: "Format du papier", preview: "Aperçu", puzzle: "Fiche", answer: "Corrigé", download: "Télécharger", points: "points", segments: "segments", closed: "fermés", open: "ouverts",
    rule: "Suivez les numéros consécutifs de chaque plage, puis levez le crayon. C : reliez le dernier point au premier de cette plage. O : arrêtez-vous au dernier point. Ne reliez jamais deux plages.",
    print: "Imprimez à taille réelle / 100 %, en portrait, avec le format choisi. La ligne de contrôle doit mesurer 50 mm. L’aperçu provient du PDF final correspondant.",
    license: "© 2026 ConnectTheDotsPrintable.online. Téléchargement et impression à usage personnel et éducatif. Usage commercial soumis à autorisation écrite préalable.",
    limitation: "Impression papier et résolution humaine complète indépendante : non testées. Difficulté, âge adapté et durée de résolution : non mesurés.",
    table: "Plages et règles", range: "Plage", part: "Partie", action: "Règle", terms: "Conditions d’utilisation",
  },
  it: {
    homeHeading: "Crea una scheda da un’immagine",
    homeIntro: "Scegli un’immagine con un soggetto ben distinto: un disegno semplice su sfondo chiaro facilita la lettura del contorno. Il risultato è una scheda da scaricare e stampare, non un gioco di tracciamento online.",
    steps: ["Carica un’immagine con il pulsante principale qui sopra.", "Regola il numero di punti e controlla l’anteprima e la sequenza dei numeri.", "Scarica il risultato corrente in PNG o PDF. Se l’elaborazione non riesce, riprova o scegli un’altra immagine."],
    upload: "Vai al caricamento", browse: "Scarica schede PDF", collectionHeading: "Schede in italiano con esattamente 100 punti",
    collectionIntro: "Scegli elefante, mongolfiera o cavalluccio marino. Ogni disegno usa i numeri da 1 a 100 e ha una soluzione separata, in A4 e nel formato Letter USA.",
    paper: "Formato carta", preview: "Anteprima", puzzle: "Scheda", answer: "Soluzione", download: "Scarica", points: "punti", segments: "segmenti", closed: "chiusi", open: "aperti",
    rule: "Collega da 1 a 100 in ordine, poi chiudi il contorno collegando 100 a 1. Alcuni dettagli sono già disegnati. Confronta il risultato con la soluzione corrispondente.",
    print: "Stampa a dimensioni effettive / 100 %, in verticale, sul formato scelto. La linea di controllo deve misurare 50 mm. L’anteprima proviene dal PDF finale corrispondente.",
    license: "© 2026 ConnectTheDotsPrintable.online. Download e stampa gratuiti per uso personale e didattico. L’uso commerciale richiede un’autorizzazione scritta preventiva.",
    limitation: "Stampa fisica e risoluzione umana completa indipendente: non testate. Difficoltà, età consigliata e durata: non misurate.",
    table: "Intervalli e regole", range: "Intervallo", part: "Parte", action: "Regola", terms: "Termini del servizio",
  },
  es: {
    homeHeading: "Crear con una imagen o descargar fichas en PDF",
    homeIntro: "Para crear tu propia ficha, sube una imagen con un sujeto bien definido; un dibujo sencillo sobre fondo claro facilita seguir el contorno. Si prefieres una ficha preparada, abre la colección en español. Estas rutas sirven para crear o descargar una ficha imprimible, no para jugar uniendo puntos en línea.",
    steps: ["Sube una imagen con el botón principal de arriba.", "Ajusta la cantidad de puntos y revisa la vista previa y el orden de los números.", "Descarga el resultado actual en PNG o PDF. Si falla el procesamiento, vuelve a intentarlo o elige otra imagen."],
    upload: "Ir a la carga de imágenes", browse: "Descargar fichas en PDF", collectionHeading: "Fichas en español con exactamente 100 puntos",
    collectionIntro: "Elige un elefante, un globo aerostático o un caballito de mar. Cada dibujo usa los números del 1 al 100 y tiene una solución separada, en A4 y Carta (EE. UU.).",
    paper: "Tamaño del papel", preview: "Vista previa", puzzle: "Ficha", answer: "Solución", download: "Descargar", points: "puntos", segments: "segmentos", closed: "cerrados", open: "abiertos",
    rule: "Une del 1 al 100 en orden y cierra el contorno uniendo el 100 con el 1. Algunos detalles ya están dibujados. Compara con la solución correspondiente.",
    print: "Imprime a tamaño real / 100 %, en vertical y en el tamaño elegido. La línea de control debe medir 50 mm. La vista previa procede del PDF final correspondiente.",
    license: "© 2026 ConnectTheDotsPrintable.online. Descarga e impresión gratuitas para uso personal y educativo. El uso comercial requiere permiso previo por escrito.",
    limitation: "Impresión física y resolución humana completa independiente: no probadas. Dificultad, edad recomendada y tiempo de resolución: no medidos.",
    table: "Intervalos y reglas", range: "Intervalo", part: "Parte", action: "Regla", terms: "Términos del servicio",
  },
} as const;

export function localizedLocale(locale: string): keyof typeof localizedCopy | null {
  return locale === "fr" || locale === "it" || locale === "es" ? locale : null;
}

/** Semantic vocabulary consumed by the Generator UI adapter;
 * these strings do not introduce a new processing state machine or service. */
export const generatorCopy = {
  fr: { upload: "Importer une image", points: "Nombre de points", preparing: "Préparation de l’image…", generating: "Création des points…", ready: "Aperçu prêt", failed: "Le traitement a échoué. Réessayez ou choisissez une autre image.", retry: "Réessayer", changeImage: "Changer d’image", downloadPng: "Télécharger le PNG", downloadPdf: "Télécharger le PDF" },
  it: { upload: "Carica un’immagine", points: "Numero di punti", preparing: "Preparazione dell’immagine…", generating: "Creazione dei punti…", ready: "Anteprima pronta", failed: "Elaborazione non riuscita. Riprova o scegli un’altra immagine.", retry: "Riprova", changeImage: "Cambia immagine", downloadPng: "Scarica PNG", downloadPdf: "Scarica PDF" },
  es: { upload: "Subir una imagen", points: "Cantidad de puntos", preparing: "Preparando la imagen…", generating: "Creando los puntos…", ready: "Vista previa lista", failed: "El procesamiento ha fallado. Inténtalo de nuevo o elige otra imagen.", retry: "Volver a intentar", changeImage: "Cambiar imagen", downloadPng: "Descargar PNG", downloadPdf: "Descargar PDF" },
} as const;
