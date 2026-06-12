import { MVP_COUNTRIES, MVP_PRODUCT_CATEGORIES, MVP_VERSION } from '@varco/shared';

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 720 }}>
      <h1>Varco</h1>
      <p>Copilot AI di compliance per vendere in Europa.</p>
      <p>
        <strong>MVP {MVP_VERSION}</strong> — dashboard in costruzione.
      </p>
      <section>
        <h2>Perimetro v1</h2>
        <p>
          <strong>Categorie:</strong> {MVP_PRODUCT_CATEGORIES.join(', ')}
        </p>
        <p>
          <strong>Paesi:</strong> {MVP_COUNTRIES.join(', ')}
        </p>
      </section>
      <p style={{ marginTop: '2rem', color: '#666', fontSize: '0.9rem' }}>
        Varco supporta la preparazione di documenti e dati strutturati. Non è consulenza legale.
      </p>
    </main>
  );
}
