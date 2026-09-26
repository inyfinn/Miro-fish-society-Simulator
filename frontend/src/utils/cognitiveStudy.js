export const DEFAULT_COGNITIVE_STAGES = [
  { key: 'attention', label: 'Uwaga', description: 'Czy bodziec został zauważony i co przyciągnęło uwagę?', enabled: true },
  { key: 'salience', label: 'Istotność', description: 'Czy bodziec wydaje się ważny, nowy lub wart dalszego przetwarzania?', enabled: true },
  { key: 'recognition', label: 'Rozpoznanie', description: 'Czy odbiorca rozumie, czym jest produkt lub komunikat?', enabled: true },
  { key: 'category_fit', label: 'Dopasowanie do kategorii', description: 'Czy forma zgadza się z oczekiwaniami wobec kategorii?', enabled: true },
  { key: 'emotional_valence', label: 'Walencja emocjonalna', description: 'Jakie emocje wywołuje bodziec i jak silna jest reakcja?', enabled: true },
  { key: 'self_relevance', label: 'Znaczenie dla mnie', description: 'Czy odbiorca widzi związek z własnymi potrzebami i tożsamością?', enabled: true },
  { key: 'trust', label: 'Zaufanie', description: 'Czy komunikat, marka i obietnica wydają się wiarygodne?', enabled: true },
  { key: 'expected_value', label: 'Oczekiwana wartość', description: 'Jakiej jakości, korzyści i doświadczenia odbiorca oczekuje?', enabled: true },
  { key: 'purchase_intent', label: 'Intencja zakupu', description: 'Jak silna jest gotowość do zakupu lub dalszego działania?', enabled: true },
  { key: 'choice', label: 'Wybór', description: 'Który wariant zostaje wybrany po ocenie wszystkich bodźców?', enabled: true }
]

export const DEFAULT_QUESTIONS = [
  { metric: 'attention', prompt: 'Co zauważyłeś jako pierwsze i dlaczego?' },
  { metric: 'recognition', prompt: 'Czym Twoim zdaniem jest ten produkt lub komunikat?' },
  { metric: 'emotional_valence', prompt: 'Jaką pierwszą emocję wywołuje ten wariant?' },
  { metric: 'trust', prompt: 'Na ile ufasz obietnicy produktu i co zwiększa lub obniża wiarygodność?' },
  { metric: 'expected_value', prompt: 'Jakiej jakości i korzyści spodziewasz się po tym produkcie?' },
  { metric: 'purchase_intent', prompt: 'Jak prawdopodobne jest, że rozważyłbyś zakup?' },
  { metric: 'choice', prompt: 'Który wariant wybierasz i jaki był najważniejszy powód?' }
]

const clean = value => String(value ?? '').trim()
const lines = items => items.filter(Boolean).join('\n')

export function slugify(value) {
  return clean(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'cognitive-study'
}

export function buildSimulationRequirement(study) {
  const enabledStages = study.cognitiveStages.filter(stage => stage.enabled).map(stage => stage.label)
  const audience = study.audienceMode === 'targeted'
    ? lines([
        clean(study.audienceDescription),
        study.ageFrom || study.ageTo ? 'Wiek: ' + (study.ageFrom || 'dowolny') + '–' + (study.ageTo || 'dowolny') : '',
        clean(study.market) ? 'Rynek/lokalizacja: ' + clean(study.market) : '',
        clean(study.purchaseContext) ? 'Kontekst decyzji: ' + clean(study.purchaseContext) : ''
      ])
    : 'Otwarta populacja. Zbuduj zróżnicowaną próbę reprezentującą możliwie szeroki przekrój konsumentów.'

  return lines([
    'Przeprowadź symulowane badanie konsumenckie wariantów opisanych w załączonym protokole.',
    'Cel badania: ' + (clean(study.objective) || 'porównanie skuteczności wariantów i zrozumienie procesu decyzji') + '.',
    'Grupa badawcza: ' + audience,
    'Analizowane etapy poznawcze: ' + enabledStages.join(', ') + '.',
    'Najpierw wykonaj niezależny baseline dla każdego agenta i każdego wariantu, bez wpływu opinii innych agentów. Dopiero później dopuść interakcje społeczne i obserwuj, czy opinie się zmieniają.',
    'Nie traktuj deklaracji agenta jako bezpośredniego pomiaru aktywności mózgu. To symulacja zachowania i procesów poznawczych inspirowana neuronauką, nie EEG/fMRI/eye-tracking.',
    'W raporcie porównaj warianty etap po etapie, wskaż miejsca utraty zainteresowania lub zaufania, bariery zakupu, dominujące skojarzenia, segmenty reagujące odmiennie oraz końcowy wybór.',
    'Jeżeli dane pozwalają, podawaj rozkłady i odsetki, ale nie wymyślaj precyzji, której nie daje symulacja.'
  ])
}

export function buildCognitiveStudyMarkdown(study) {
  const audience = study.audienceMode === 'targeted'
    ? lines([
        clean(study.audienceDescription) || 'Nie podano dodatkowego opisu.',
        study.ageFrom || study.ageTo ? '- Wiek: ' + (study.ageFrom || 'dowolny') + '–' + (study.ageTo || 'dowolny') : '',
        clean(study.market) ? '- Rynek/lokalizacja: ' + clean(study.market) : '',
        clean(study.purchaseContext) ? '- Kontekst zakupu: ' + clean(study.purchaseContext) : ''
      ])
    : 'Otwarta populacja. Próbę należy zróżnicować pod względem wieku, potrzeb, poziomu wiedzy, stylu życia i stosunku do kategorii.'

  const variants = study.variants.map((variant, index) => lines([
    '### Wariant ' + (index + 1) + ': ' + (clean(variant.name) || 'Wariant ' + (index + 1)),
    clean(variant.description) ? '- Opis bodźca: ' + clean(variant.description) : '- Opis bodźca: nie podano',
    clean(variant.visualCues) ? '- Kluczowe cechy wizualne: ' + clean(variant.visualCues) : '',
    clean(variant.claim) ? '- Claim / treść: ' + clean(variant.claim) : '',
    clean(variant.price) ? '- Cena / warunek handlowy: ' + clean(variant.price) : '',
    clean(variant.imageUrl) ? '- Referencja obrazu: ' + clean(variant.imageUrl) : '',
    variant.imageFileName ? '- Załączony plik referencyjny: ' + variant.imageFileName : '',
    clean(variant.hypothesis) ? '- Hipoteza projektowa: ' + clean(variant.hypothesis) : ''
  ])).join('\n\n')

  const stages = study.cognitiveStages
    .filter(stage => stage.enabled)
    .map((stage, index) => (index + 1) + '. **' + stage.label + '** — ' + stage.description)
    .join('\n')

  const questions = study.questions
    .filter(question => clean(question.prompt))
    .map((question, index) => (index + 1) + '. [' + (clean(question.metric) || 'custom') + '] ' + clean(question.prompt))
    .join('\n')

  return lines([
    '# ' + (clean(study.projectName) || 'Cognitive Design Study'),
    '',
    '## Cel',
    clean(study.objective) || 'Porównać warianty i zidentyfikować mechanizmy prowadzące od zauważenia bodźca do decyzji.',
    '',
    '## Typ bodźca',
    clean(study.stimulusType) || 'opakowanie / komunikacja marketingowa',
    '',
    '## Grupa badawcza',
    audience,
    '',
    '## Warianty',
    variants,
    '',
    '## Workflow poznawczy',
    stages,
    '',
    '## Pytania badawcze',
    questions || 'Brak dodatkowych pytań.',
    '',
    '## Procedura symulacji',
    '1. Wygeneruj persony zgodne z grupą badawczą i zróżnicuj ich motywacje, doświadczenia, budżet, znajomość kategorii oraz podatność na sygnały społeczne.',
    '2. Każdy agent ocenia każdy wariant najpierw niezależnie. Kolejność wariantów należy mieszać między agentami, aby ograniczyć efekt kolejności.',
    '3. Dla każdego wariantu przejdź przez włączone etapy workflow poznawczego. Zapisuj krótkie uzasadnienie oraz ocenę 0–100 tam, gdzie ma to sens.',
    '4. Po niezależnym baseline można dopuścić interakcje agentów i sprawdzić zmianę opinii, efekt społecznego dowodu słuszności, polaryzację lub konwergencję.',
    '5. Końcowy raport ma pokazywać nie tylko zwycięski wariant, ale również gdzie każdy wariant traci uwagę, znaczenie, zaufanie lub wartość.',
    '',
    '## Minimalny schemat wyniku agenta',
    '- wariant',
    '- pierwszy zauważony element',
    '- rozpoznana kategoria / znaczenie',
    '- dominujące skojarzenia',
    '- emocja i jej kierunek',
    '- self-relevance',
    '- zaufanie',
    '- oczekiwana wartość / jakość',
    '- bariery',
    '- intencja zakupu',
    '- finalny wybór i uzasadnienie',
    '',
    '## Ograniczenie interpretacyjne',
    'To badanie nie jest pomiarem aktywności sieci neuronalnych ani badaniem biologicznym. Wynik należy traktować jako symulację zachowań i procesów poznawczych agentów. Obrazy dołączone w panelu są obecnie referencją dla człowieka; bazowy pipeline MiroFish konsumuje tekst, dlatego opis bodźca jest źródłem używanym przez symulację.'
  ])
}
