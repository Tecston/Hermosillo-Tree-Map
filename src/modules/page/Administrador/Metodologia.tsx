// src/page/Metodologia.tsx
import React from "react";

const Metodologia: React.FC = () => {
  return (
    <div className="page-container">
      <style>{`
        /* Fallbacks mÃ­nimos para que se vea bien sin depender de CSS externo */
        .page-container { padding: 16px; }
        .page-content { max-width: 1100px; margin: 0 auto; }
        .methodology-content .methodology-header h1 { margin: 0 0 8px; }
        .methodology-content .subtitle { color:#607d8b; margin:0 0 16px; }
        .highlight-box { background:#f5f5f5; border-left:4px solid #2D5016; padding:12px; border-radius:6px; }
        .methodology-section { margin: 24px 0; }
        .benefits-grid, .methodology-grid { display:grid; gap:12px; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); }
        .benefit-card, .grid-item { background:#fff; border:1px solid #e0e0e0; border-radius:8px; padding:12px; }
        .resource-links { display:flex; flex-wrap:wrap; gap:10px; }
        .resource-link { display:inline-block; padding:8px 10px; border-radius:6px; border:1px solid #cfd8dc; text-decoration:none; color:#2D5016; background:#fafafa; }
        .credits { background:#fafafa; border:1px solid #e0e0e0; border-radius:8px; padding:12px; }
      `}</style>

      <main className="page-content">
        <div className="methodology-content">
          <div className="methodology-header">
            <h1>ðŸŒ³ MetodologÃ­a CientÃ­fica</h1>
            <p className="subtitle">
              Comprende los mÃ©todos cientÃ­ficos y tecnologÃ­as utilizadas para el monitoreo y evaluaciÃ³n de la cobertura arbÃ³rea urbana de Hermosillo
            </p>
          </div>

          <div className="methodology-section">
            <h2><span className="icon">ðŸ”¬</span> Marco MetodolÃ³gico</h2>
            <p>
              El proyecto HMO TREE utiliza una metodologÃ­a cientÃ­fica basada en los estÃ¡ndares internacionales de <strong>i-Tree Eco</strong>, desarrollado por el Servicio Forestal de Estados Unidos (USFS). Esta herramienta permite cuantificar la estructura, funciÃ³n y valor de los bosques urbanos.
            </p>
            <div className="highlight-box">
              <strong>i-Tree Eco</strong> es un software de modelado revisado por pares que utiliza datos de campo del bosque urbano local junto con datos meteorolÃ³gicos locales por hora para cuantificar la estructura, funciÃ³n y valor del bosque urbano.
            </div>
          </div>

          <div className="methodology-section">
            <h2><span className="icon">ðŸ“Š</span> RecolecciÃ³n de Datos</h2>

            <h3>1. Inventario de Campo</h3>
            <p>Cada Ã¡rbol es inventariado siguiendo protocolos estandarizados que incluyen:</p>
            <ul>
              <li><strong>IdentificaciÃ³n taxonÃ³mica:</strong> Especie, gÃ©nero y familia</li>
              <li><strong>Mediciones dendromÃ©tricas:</strong> DAP, altura total, diÃ¡metro de copa</li>
              <li><strong>EvaluaciÃ³n de condiciÃ³n:</strong> Estado fitosanitario, % de copa faltante, transparencia</li>
              <li><strong>GeolocalizaciÃ³n:</strong> Coordenadas GPS precisas (Â±3 m)</li>
              <li><strong>Contexto urbano:</strong> Uso de suelo, distancia a edificaciones, tipo de superficie</li>
            </ul>

            <h3>2. Datos Ambientales</h3>
            <div className="methodology-grid">
              <div className="grid-item">
                <h4>ðŸŒ¡ï¸ Datos MeteorolÃ³gicos</h4>
                <p>Temperatura, humedad, precipitaciÃ³n, viento y radiaciÃ³n solar (CONAGUA).</p>
              </div>
              <div className="grid-item">
                <h4>ðŸ­ Calidad del Aire</h4>
                <p>PM2.5, PM10, Oâ‚ƒ, NOâ‚‚, SOâ‚‚ y CO de la Red de Monitoreo AtmosfÃ©rico de Sonora.</p>
              </div>
              <div className="grid-item">
                <h4>ðŸ’° Datos EconÃ³micos</h4>
                <p>Precios locales de CFE, Agua de Hermosillo y costos de manejo pluvial.</p>
              </div>
            </div>
          </div>

          <div className="methodology-section">
            <h2><span className="icon">ðŸ§®</span> Modelos de CÃ¡lculo</h2>

            <h3>AbsorciÃ³n de COâ‚‚</h3>
            <p>La absorciÃ³n anual de COâ‚‚ se calcula con ecuaciones alomÃ©tricas por especie:</p>
            <div className="highlight-box">
              <strong>COâ‚‚ = (Biomasa Ã— 0.5 Ã— 3.67) + Crecimiento_anual</strong>
            </div>

            <h3>IntercepciÃ³n de Agua Pluvial</h3>
            <ul>
              <li>Ãrea de copa y densidad foliar</li>
              <li>Patrones de precipitaciÃ³n locales</li>
              <li>CaracterÃ­sticas de la especie</li>
              <li>DuraciÃ³n e intensidad de eventos</li>
            </ul>

            <h3>Beneficios EcosistÃ©micos</h3>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">ðŸ’§</div>
                <h4>GestiÃ³n HÃ­drica</h4>
                <p>IntercepciÃ³n, menor escorrentÃ­a y mejor infiltraciÃ³n.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">ðŸŒ¡ï¸</div>
                <h4>RegulaciÃ³n TÃ©rmica</h4>
                <p>Menor efecto isla de calor por sombra y evapotranspiraciÃ³n.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">ðŸƒ</div>
                <h4>Calidad del Aire</h4>
                <p>FiltraciÃ³n de contaminantes y producciÃ³n de oxÃ­geno.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">ðŸ¡</div>
                <h4>Eficiencia EnergÃ©tica</h4>
                <p>Ahorro en climatizaciÃ³n de edificios cercanos.</p>
              </div>
            </div>
          </div>

          <div className="methodology-section">
            <h2><span className="icon">ðŸ“š</span> Referencias y Recursos</h2>

            <h3>DocumentaciÃ³n Oficial i-Tree</h3>
            <div className="resource-links">
              <a href="https://www.itreetools.org/tools/i-tree-eco" className="resource-link" target="_blank" rel="noreferrer">ðŸ”— i-Tree Eco - Sitio Oficial</a>
              <a href="https://www.fs.usda.gov/research/treesearch/55635" className="resource-link" target="_blank" rel="noreferrer">ðŸ“„ Manual de Campo i-Tree Eco v6.0</a>
            </div>

            <h3>InvestigaciÃ³n CientÃ­fica</h3>
            <div className="resource-links">
              <a href="https://www.fs.usda.gov/research/treesearch/62021" className="resource-link" target="_blank" rel="noreferrer">ðŸ”¬ MetodologÃ­a EconÃ³mica</a>
              <a href="https://www.fao.org/urban-forestry/en/" className="resource-link" target="_blank" rel="noreferrer">ðŸŒ FAO - Silvicultura Urbana</a>
            </div>

            <h3>Contexto Nacional</h3>
            <div className="resource-links">
              <a href="https://www.conafor.gob.mx/" className="resource-link" target="_blank" rel="noreferrer">ðŸ‡²ðŸ‡½ CONAFOR</a>
              <a href="https://www.gob.mx/semarnat" className="resource-link" target="_blank" rel="noreferrer">ðŸŒ¿ SEMARNAT</a>
            </div>
          </div>

          <div className="methodology-footer">
            <div className="credits">
              <h3>CrÃ©ditos del Proyecto</h3>
              <p><strong>Desarrollado por:</strong> HMOTREE - Hermosillo Urban Forest Initiative</p>
              <p><strong>MetodologÃ­a cientÃ­fica:</strong> i-Tree Eco (USDA Forest Service)</p>
              <p><strong>AdaptaciÃ³n local:</strong> Universidad de Sonora</p>
              <p><strong>Ãšltima actualizaciÃ³n:</strong> Julio 2025</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Metodologia;

