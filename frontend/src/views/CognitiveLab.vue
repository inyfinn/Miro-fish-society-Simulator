<template>
  <div class="lab-shell">
    <header class="lab-header">
      <button class="brand" type="button" @click="router.push('/')">MIROFISH</button>
      <div class="header-copy">
        <span class="eyebrow">LABORATORIUM POZNAWCZE / MVP</span>
        <span>Przebieg percepcji konsumenta</span>
      </div>
      <button class="ghost-btn" type="button" @click="router.push('/')">← Wróć</button>
    </header>

    <main class="lab-grid">
      <section class="editor-column">
        <div class="intro-card">
          <div>
            <span class="kicker">SYMULACJA BEHAWIORALNA INSPIROWANA NEURONAUKĄ</span>
            <h1>Od bodźca do decyzji.</h1>
            <p>
              Skonfiguruj warianty, odbiorców i pytania. Panel zbuduje protokół badania i przekaże go
              do istniejącego przepływu MiroFish: ontologia → graf → persony → symulacja → raport.
            </p>
          </div>
          <span class="pipeline-chip">WYKORZYSTUJE SILNIK MIROFISH</span>
        </div>

        <section class="panel-card">
          <div class="section-head">
            <div><span class="section-index">01</span><h2>Badanie</h2></div>
            <span class="section-meta">KONTEKST</span>
          </div>

          <div class="form-grid two">
            <label>
              <span>Nazwa projektu</span>
              <input v-model="study.projectName" type="text" placeholder="np. Test opakowań batonów 2026">
            </label>
            <label>
              <span>Typ bodźca</span>
              <select v-model="study.stimulusType">
                <option>Opakowanie</option>
                <option>Motyw przewodni / reklama</option>
                <option>Hasło / treść</option>
                <option>Strona docelowa</option>
                <option>Koncept produktu</option>
              </select>
            </label>
          </div>

          <label class="full-field">
            <span>Cel badania</span>
            <textarea v-model="study.objective" rows="3" placeholder="Co dokładnie chcesz zrozumieć?"></textarea>
          </label>
        </section>

        <section class="panel-card">
          <div class="section-head">
            <div><span class="section-index">02</span><h2>Grupa badawcza</h2></div>
            <span class="section-meta">PERSONY</span>
          </div>

          <div class="segmented">
            <button type="button" :class="{ active: study.audienceMode === 'targeted' }" @click="study.audienceMode = 'targeted'">
              Określona grupa
            </button>
            <button type="button" :class="{ active: study.audienceMode === 'open' }" @click="study.audienceMode = 'open'">
              Otwarta populacja
            </button>
          </div>

          <template v-if="study.audienceMode === 'targeted'">
            <label class="full-field">
              <span>Opis odbiorcy</span>
              <textarea
                v-model="study.audienceDescription"
                rows="3"
                placeholder="np. osoby kupujące zdrowe przekąski 2–5 razy w tygodniu, aktywne zawodowo, wrażliwe na skład i cenę"
              ></textarea>
            </label>
            <div class="form-grid three">
              <label><span>Wiek od</span><input v-model="study.ageFrom" type="number" min="0" max="100"></label>
              <label><span>Wiek do</span><input v-model="study.ageTo" type="number" min="0" max="100"></label>
              <label><span>Rynek</span><input v-model="study.market" type="text" placeholder="Polska / UE / global"></label>
            </div>
            <label class="full-field">
              <span>Kontekst decyzji</span>
              <input v-model="study.purchaseContext" type="text" placeholder="np. szybki zakup przy półce w supermarkecie">
            </label>
          </template>
          <p v-else class="hint-block">
            MiroFish dostanie instrukcję zbudowania szerokiej populacji i wyszukania różnic pomiędzy segmentami.
          </p>
        </section>

        <section class="panel-card">
          <div class="section-head">
            <div><span class="section-index">03</span><h2>Warianty bodźca</h2></div>
            <button class="tiny-btn" type="button" :disabled="study.variants.length >= 6" @click="addVariant">+ wariant</button>
          </div>

          <div class="variant-list">
            <article v-for="(variant, index) in study.variants" :key="variant.id" class="variant-card">
              <div class="variant-topline">
                <strong>{{ variantLetter(index) }}</strong>
                <input v-model="variant.name" type="text" :placeholder="'Wariant ' + variantLetter(index)">
                <button v-if="study.variants.length > 2" class="icon-btn" type="button" @click="removeVariant(index)">×</button>
              </div>

              <div class="variant-body">
                <div class="image-box">
                  <img v-if="variant.imagePreview" :src="variant.imagePreview" alt="Preview wariantu">
                  <div v-else class="image-placeholder">REFERENCJA<br>OBRAZU</div>
                  <label class="upload-btn">
                    <input type="file" accept="image/png,image/jpeg,image/webp" @change="event => handleImage(event, variant)">
                    {{ variant.imageFileName ? 'Zmień obraz' : 'Dodaj obraz' }}
                  </label>
                  <small v-if="variant.imageFileName" class="file-caption">{{ variant.imageFileName }}</small>
                </div>

                <div class="variant-fields">
                  <label>
                    <span>Opis bodźca dla agentów *</span>
                    <textarea
                      v-model="variant.description"
                      rows="3"
                      placeholder="Opisz układ, kolorystykę, hierarchię, produkt, ilustracje i to, co odbiorca realnie widzi."
                    ></textarea>
                  </label>
                  <div class="form-grid two compact">
                    <label>
                      <span>Kluczowe cechy wizualne</span>
                      <input v-model="variant.visualCues" type="text" placeholder="jasne tło, duże zdjęcie produktu, zielony znacznik">
                    </label>
                    <label>
                      <span>Hasło / treść</span>
                      <input v-model="variant.claim" type="text" placeholder="100% naturalnych składników">
                    </label>
                  </div>
                  <div class="form-grid two compact">
                    <label><span>Cena / warunek</span><input v-model="variant.price" type="text" placeholder="6,99 zł"></label>
                    <label><span>URL referencyjny</span><input v-model="variant.imageUrl" type="url" placeholder="https://…"></label>
                  </div>
                  <label>
                    <span>Hipoteza projektowa</span>
                    <input v-model="variant.hypothesis" type="text" placeholder="np. większy kontrast poprawi zauważalność bez utraty wrażenia premium">
                  </label>
                </div>
              </div>
            </article>
          </div>

          <div class="warning-note">
            <strong>Ważne:</strong> obecny MiroFish przetwarza tekst. Obraz jest tu podglądem i referencją,
            dlatego opis bodźca jest obowiązkowy. Moduł analizy obrazu można dołożyć osobno bez przebudowy reszty przepływu.
          </div>
        </section>

        <section class="panel-card">
          <div class="section-head">
            <div><span class="section-index">04</span><h2>Przebieg poznawczy</h2></div>
            <span class="section-meta">ETAPY POZNAWCZE</span>
          </div>

          <div class="stage-grid">
            <label v-for="stage in study.cognitiveStages" :key="stage.key" class="stage-item" :class="{ enabled: stage.enabled }">
              <input v-model="stage.enabled" type="checkbox">
              <span class="stage-copy">
                <strong>{{ stage.label }}</strong>
                <small>{{ stage.description }}</small>
              </span>
            </label>
          </div>
        </section>

        <section class="panel-card">
          <div class="section-head">
            <div><span class="section-index">05</span><h2>Pytania badawcze</h2></div>
            <button class="tiny-btn" type="button" @click="addQuestion">+ pytanie</button>
          </div>

          <div class="question-list">
            <div v-for="(question, index) in study.questions" :key="index" class="question-row">
              <input v-model="question.metric" class="metric-input" type="text" placeholder="miara">
              <input v-model="question.prompt" type="text" placeholder="Pytanie do agenta">
              <button class="icon-btn" type="button" @click="study.questions.splice(index, 1)">×</button>
            </div>
          </div>
        </section>

        <div v-if="validationError" class="validation-error">{{ validationError }}</div>

        <button class="launch-btn" type="button" @click="launchStudy">
          <span>
            <strong>URUCHOM W MIROFISH</strong>
            <small>zbuduj materiał źródłowy → ontologia → graf → persony → symulacja</small>
          </span>
          <span class="launch-arrow">→</span>
        </button>
      </section>

      <aside class="workflow-column">
        <div class="sticky-panel">
          <div class="side-head">
            <span>PRZEBIEG PERCEPCJI</span>
            <strong>{{ enabledStages.length }}/{{ study.cognitiveStages.length }}</strong>
          </div>

          <div class="workflow-chain">
            <div v-for="(stage, index) in enabledStages" :key="stage.key" class="workflow-node">
              <span class="node-num">{{ String(index + 1).padStart(2, '0') }}</span>
              <div>
                <strong>{{ stage.label }}</strong>
                <small>{{ stage.description }}</small>
              </div>
            </div>
          </div>

          <div class="summary-box">
            <span>PODSUMOWANIE BADANIA</span>
            <dl>
              <div><dt>Warianty</dt><dd>{{ study.variants.length }}</dd></div>
              <div><dt>Pytania</dt><dd>{{ study.questions.filter(q => q.prompt.trim()).length }}</dd></div>
              <div><dt>Grupa</dt><dd>{{ study.audienceMode === 'targeted' ? 'docelowa' : 'otwarta' }}</dd></div>
              <div><dt>Silnik</dt><dd>MiroFish</dd></div>
            </dl>
          </div>

          <div class="model-note">
            <strong>Model interpretacji</strong>
            <p>
              To symulacja poznawczo-behawioralna. DMN / sieć istotności / kontrola wykonawcza są inspiracją funkcjonalną,
              nie deklaracją pomiaru biologicznego.
            </p>
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup>
import { computed, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { setPendingUpload } from '../store/pendingUpload'
import {
  DEFAULT_COGNITIVE_STAGES,
  DEFAULT_QUESTIONS,
  buildCognitiveStudyMarkdown,
  buildSimulationRequirement,
  slugify
} from '../utils/cognitiveStudy'

const router = useRouter()
const validationError = ref('')
let nextVariantId = 1

const variantLetter = index => String.fromCharCode(65 + index)

const makeVariant = index => ({
  id: nextVariantId++,
  name: 'Wariant ' + variantLetter(index),
  description: '',
  visualCues: '',
  claim: '',
  price: '',
  imageUrl: '',
  imageFileName: '',
  imagePreview: '',
  hypothesis: ''
})

const study = reactive({
  projectName: 'Badanie percepcji projektu',
  stimulusType: 'Opakowanie',
  objective: 'Porównać warianty i zrozumieć, co prowadzi od zauważenia bodźca do intencji zakupu i finalnego wyboru.',
  audienceMode: 'targeted',
  audienceDescription: '',
  ageFrom: '',
  ageTo: '',
  market: 'Polska',
  purchaseContext: '',
  variants: Array.from({ length: 4 }, (_, index) => makeVariant(index)),
  cognitiveStages: DEFAULT_COGNITIVE_STAGES.map(stage => ({ ...stage })),
  questions: DEFAULT_QUESTIONS.map(question => ({ ...question }))
})

const enabledStages = computed(() => study.cognitiveStages.filter(stage => stage.enabled))

const addVariant = () => {
  if (study.variants.length < 6) study.variants.push(makeVariant(study.variants.length))
}

const removeVariant = index => {
  const variant = study.variants[index]
  if (variant && variant.imagePreview) URL.revokeObjectURL(variant.imagePreview)
  study.variants.splice(index, 1)
}

const handleImage = (event, variant) => {
  const file = event.target.files && event.target.files[0]
  if (!file) return
  if (variant.imagePreview) URL.revokeObjectURL(variant.imagePreview)
  variant.imageFileName = file.name
  variant.imagePreview = URL.createObjectURL(file)
}

const addQuestion = () => {
  study.questions.push({ metric: 'custom', prompt: '' })
}

const validateStudy = () => {
  if (!study.projectName.trim()) return 'Nadaj projektowi nazwę.'
  if (study.variants.length < 2) return 'Badanie porównawcze wymaga co najmniej dwóch wariantów.'
  const missing = study.variants.findIndex(variant => !variant.description.trim())
  if (missing !== -1) return 'Dodaj opis bodźca dla wariantu ' + variantLetter(missing) + '.'
  if (!enabledStages.value.length) return 'Włącz przynajmniej jeden etap workflow poznawczego.'
  if (study.audienceMode === 'targeted' && !study.audienceDescription.trim()) return 'Opisz grupę badawczą albo wybierz otwartą populację.'
  return ''
}

const launchStudy = () => {
  validationError.value = validateStudy()
  if (validationError.value) return

  const normalizedStudy = {
    ...study,
    variants: study.variants.map(variant => ({ ...variant, imagePreview: undefined })),
    cognitiveStages: study.cognitiveStages.map(stage => ({ ...stage })),
    questions: study.questions.map(question => ({ ...question }))
  }

  const markdown = buildCognitiveStudyMarkdown(normalizedStudy)
  const requirement = buildSimulationRequirement(normalizedStudy)
  const seedFile = new File(
    [markdown],
    slugify(study.projectName) + '-research-seed.md',
    { type: 'text/markdown;charset=utf-8' }
  )

  setPendingUpload([seedFile], requirement, {
    projectName: study.projectName,
    source: 'cognitive-lab'
  })

  router.push({ name: 'Process', params: { projectId: 'new' } })
}

onUnmounted(() => {
  study.variants.forEach(variant => {
    if (variant.imagePreview) URL.revokeObjectURL(variant.imagePreview)
  })
})
</script>

<style scoped>
:global(body) { margin: 0; background: #f4f4f1; }
* { box-sizing: border-box; }
.lab-shell { min-height: 100vh; color: #111; background: #f4f4f1; font-family: 'Space Grotesk', system-ui, sans-serif; }
.lab-header { height: 64px; position: sticky; top: 0; z-index: 20; display: grid; grid-template-columns: 180px 1fr 180px; align-items: center; gap: 24px; padding: 0 32px; background: #0b0b0b; color: #fff; }
.brand,.ghost-btn { border: 0; background: transparent; color: inherit; cursor: pointer; }
.brand { justify-self: start; padding: 0; font: 800 18px/1 'JetBrains Mono', monospace; letter-spacing: 1px; }
.ghost-btn { justify-self: end; font: 700 11px/1 'JetBrains Mono', monospace; color: #aaa; }
.header-copy { display: flex; justify-content: center; gap: 14px; font-size: 13px; color: #aaa; }
.eyebrow,.kicker,.section-meta,.pipeline-chip,.side-head,.summary-box>span { font-family: 'JetBrains Mono', monospace; letter-spacing: .08em; text-transform: uppercase; }
.eyebrow,.kicker,.section-index { color: #ff5315; }
.eyebrow,.kicker,.section-meta,.pipeline-chip,.side-head,.summary-box>span { font-size: 10px; }
.lab-grid { max-width: 1500px; margin: 0 auto; padding: 36px 32px 80px; display: grid; grid-template-columns: minmax(0,1fr) 360px; gap: 28px; }
.intro-card,.panel-card,.sticky-panel { background: #fff; border: 1px solid #dddcd7; }
.intro-card { display: flex; justify-content: space-between; gap: 32px; padding: 38px; margin-bottom: 20px; }
.intro-card h1 { margin: 10px 0 12px; font-size: clamp(34px,4vw,54px); line-height: 1; letter-spacing: -.04em; }
.intro-card p { max-width: 800px; margin: 0; color: #666; line-height: 1.65; }
.pipeline-chip { align-self: flex-start; padding: 9px 10px; background: #111; color: #fff; white-space: nowrap; }
.panel-card { padding: 28px; margin-bottom: 20px; }
.section-head { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 24px; }
.section-head>div { display: flex; align-items: baseline; gap: 12px; }
.section-index { font: 800 12px/1 'JetBrains Mono', monospace; }
.section-head h2 { margin: 0; font-size: 24px; }
.section-meta { color: #aaa; }
.form-grid { display: grid; gap: 14px; }
.form-grid.two { grid-template-columns: repeat(2,minmax(0,1fr)); }
.form-grid.three { grid-template-columns: repeat(3,minmax(0,1fr)); }
.form-grid.compact { gap: 10px; }
label { display: flex; flex-direction: column; gap: 7px; }
label>span { font-size: 11px; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: .04em; }
.full-field { margin-top: 14px; }
input,textarea,select { width: 100%; border: 1px solid #d8d8d3; background: #fbfbf9; color: #111; padding: 12px 13px; font: 500 14px/1.45 inherit; outline: none; }
textarea { resize: vertical; }
input:focus,textarea:focus,select:focus { border-color: #111; background: #fff; }
.segmented { display: inline-grid; grid-template-columns: 1fr 1fr; border: 1px solid #ccc; margin-bottom: 16px; }
.segmented button { border: 0; padding: 11px 15px; background: #f2f2ef; cursor: pointer; font-weight: 700; }
.segmented button+button { border-left: 1px solid #ccc; }
.segmented button.active { background: #111; color: #fff; }
.hint-block { margin: 0; padding: 16px; background: #f7f7f4; color: #666; }
.tiny-btn,.icon-btn,.upload-btn { border: 1px solid #ccc; background: #fff; cursor: pointer; font: 700 11px/1 'JetBrains Mono', monospace; }
.tiny-btn { padding: 9px 11px; }
.tiny-btn:disabled { opacity: .4; cursor: not-allowed; }
.icon-btn { width: 30px; height: 30px; padding: 0; font-size: 16px; }
.variant-list { display: grid; gap: 14px; }
.variant-card { border: 1px solid #d8d8d3; background: #fafaf8; }
.variant-topline { display: grid; grid-template-columns: 38px 1fr 34px; align-items: center; gap: 8px; padding: 10px; border-bottom: 1px solid #deded9; background: #fff; }
.variant-topline>strong { display: grid; place-items: center; width: 34px; height: 34px; background: #111; color: #fff; font: 800 13px/1 'JetBrains Mono', monospace; }
.variant-topline input { border: 0; background: transparent; font-weight: 800; font-size: 16px; padding: 7px 4px; }
.variant-body { display: grid; grid-template-columns: 190px 1fr; gap: 18px; padding: 16px; }
.image-box { display: flex; flex-direction: column; gap: 8px; }
.image-box img,.image-placeholder { width: 100%; aspect-ratio: 1; border: 1px solid #d8d8d3; background: #efefeb; object-fit: contain; }
.image-placeholder { display: grid; place-items: center; text-align: center; color: #aaa; font: 800 12px/1.5 'JetBrains Mono', monospace; }
.upload-btn { display: block; padding: 10px; text-align: center; }
.upload-btn input { display: none; }
.file-caption { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #888; font-size: 10px; }
.variant-fields { display: grid; gap: 10px; }
.warning-note { margin-top: 14px; padding: 14px 16px; border-left: 3px solid #ff5315; background: #fff4ed; color: #74442e; font-size: 12px; line-height: 1.55; }
.stage-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.stage-item { flex-direction: row; align-items: flex-start; gap: 11px; padding: 14px; border: 1px solid #dddcd7; background: #f7f7f4; cursor: pointer; }
.stage-item.enabled { border-color: #111; background: #fff; }
.stage-item input { width: 16px; height: 16px; margin: 2px 0 0; accent-color: #111; }
.stage-copy { display: grid; gap: 4px; }
.stage-copy strong { font-size: 13px; }
.stage-copy small { color: #777; line-height: 1.45; }
.question-list { display: grid; gap: 8px; }
.question-row { display: grid; grid-template-columns: 150px 1fr 34px; gap: 8px; }
.metric-input { font-family: 'JetBrains Mono', monospace; font-size: 11px; }
.validation-error { margin: 0 0 14px; padding: 13px 15px; border: 1px solid #e2a695; background: #fff0eb; color: #8b2d15; font-weight: 700; }
.launch-btn { width: 100%; border: 0; background: #111; color: #fff; padding: 22px 24px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; text-align: left; }
.launch-btn:hover { background: #ff5315; }
.launch-btn span:first-child { display: grid; gap: 5px; }
.launch-btn strong { font: 800 14px/1 'JetBrains Mono', monospace; }
.launch-btn small { color: #aaa; }
.launch-btn:hover small { color: #fff; }
.launch-arrow { font-size: 28px; }
.sticky-panel { position: sticky; top: 88px; padding: 20px; }
.side-head { display: flex; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid #ddd; color: #888; }
.side-head strong { color: #111; }
.workflow-chain { margin: 18px 0; display: grid; }
.workflow-node { position: relative; display: grid; grid-template-columns: 34px 1fr; gap: 11px; padding-bottom: 18px; }
.workflow-node:not(:last-child)::after { content: ''; position: absolute; left: 16px; top: 27px; bottom: 3px; width: 1px; background: #d5d5cf; }
.node-num { display: grid; place-items: center; width: 33px; height: 27px; background: #111; color: #fff; font: 700 10px/1 'JetBrains Mono', monospace; z-index: 1; }
.workflow-node div { display: grid; gap: 4px; }
.workflow-node strong { font-size: 13px; }
.workflow-node small { color: #888; line-height: 1.35; }
.summary-box { border-top: 1px solid #ddd; padding-top: 16px; }
.summary-box>span { color: #999; }
dl { margin: 12px 0 0; display: grid; gap: 7px; }
dl div { display: flex; justify-content: space-between; gap: 20px; font-size: 12px; }
dt { color: #777; } dd { margin: 0; font: 700 11px/1 'JetBrains Mono', monospace; }
.model-note { margin-top: 18px; padding: 14px; background: #f3f3ef; }
.model-note strong { font-size: 12px; }
.model-note p { margin: 8px 0 0; color: #777; font-size: 11px; line-height: 1.5; }
@media (max-width: 1100px) {
  .lab-grid { grid-template-columns: 1fr; }
  .workflow-column { order: -1; }
  .sticky-panel { position: static; }
  .workflow-chain { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px 16px; }
  .workflow-node:not(:last-child)::after { display: none; }
}
@media (max-width: 760px) {
  .lab-header { grid-template-columns: 1fr auto; padding: 0 18px; }
  .header-copy { display: none; }
  .lab-grid { padding: 18px 12px 50px; }
  .intro-card { padding: 24px; flex-direction: column; }
  .pipeline-chip { white-space: normal; }
  .panel-card { padding: 18px; }
  .form-grid.two,.form-grid.three,.stage-grid { grid-template-columns: 1fr; }
  .variant-body { grid-template-columns: 1fr; }
  .image-box { max-width: 220px; }
  .question-row { grid-template-columns: 1fr 34px; }
  .question-row .metric-input { grid-column: 1/-1; }
}
</style>
