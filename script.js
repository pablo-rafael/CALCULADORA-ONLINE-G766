// ── Constantes ──────────────────────────────────────────
const META_BONUS  = 20000.00;
const VALOR_BONUS = 300.00;

// ── Utilitários ─────────────────────────────────────────

/** Formata número como moeda BRL: R$ 1.234,56 */
function fmt(v) {
  return 'R$ ' + v.toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** Retorna o percentual de comissão conforme faixa de vendas */
function calcPercentual(total) {
  if (total <= 10000) return 2;
  if (total <= 30000) return 4;
  return 6;
}

/** Escapa caracteres HTML para evitar XSS */
function esc(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Passo 1 → gerar campos dos vendedores ───────────────

function gerarFormulario() {
  const input = document.getElementById('qtd-input');
  const err   = document.getElementById('qtd-error');
  const val   = parseInt(input.value, 10);

  if (!val || val < 1 || val > 50) {
    input.classList.add('error');
    err.classList.add('visible');
    input.focus();
    return;
  }
  input.classList.remove('error');
  err.classList.remove('visible');

  const container = document.getElementById('vendedores-container');
  container.innerHTML = '';

  for (let i = 1; i <= val; i++) {
    const row = document.createElement('div');
    row.className = 'vendedor-row';
    row.innerHTML = `
      <div class="vendedor-num">#${String(i).padStart(2, '0')}</div>
      <div class="field-group">
        <label for="nome-${i}">Nome</label>
        <input type="text" id="nome-${i}" placeholder="Nome do vendedor" autocomplete="off">
        <div class="error-msg" id="nome-err-${i}">Informe o nome.</div>
      </div>
      <div class="field-group">
        <label for="venda-${i}">Total vendido (R$)</label>
        <input type="number" id="venda-${i}" min="0" step="0.01" placeholder="0,00" autocomplete="off">
        <div class="error-msg" id="venda-err-${i}">Valor inválido (≥ 0).</div>
      </div>
    `;
    container.appendChild(row);
  }

  document.getElementById('step2').hidden = false;
  document.getElementById('resultados').classList.remove('visible');
  document.getElementById('step2').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── Voltar ao passo 1 ────────────────────────────────────

function voltarStep1() {
  document.getElementById('step2').hidden = true;
  document.getElementById('resultados').classList.remove('visible');
  document.getElementById('qtd-input').focus();
}

// ── Passo 2 → calcular ───────────────────────────────────

function calcular() {
  const rows = document.querySelectorAll('.vendedor-row');
  let valid = true;

  const dados = Array.from(rows).map((_, i) => {
    const idx     = i + 1;
    const nomeIn  = document.getElementById(`nome-${idx}`);
    const vendaEl = document.getElementById(`venda-${idx}`);
    const nomeErr = document.getElementById(`nome-err-${idx}`);
    const vendaErr= document.getElementById(`venda-err-${idx}`);

    const nome  = nomeIn.value.trim();
    const venda = parseFloat(vendaEl.value);
    let rowValid = true;

    if (!nome) {
      nomeIn.classList.add('error');
      nomeErr.classList.add('visible');
      rowValid = false;
    } else {
      nomeIn.classList.remove('error');
      nomeErr.classList.remove('visible');
    }

    if (isNaN(venda) || venda < 0) {
      vendaEl.classList.add('error');
      vendaErr.classList.add('visible');
      rowValid = false;
    } else {
      vendaEl.classList.remove('error');
      vendaErr.classList.remove('visible');
    }

    if (!rowValid) { valid = false; return null; }
    return { nome, venda };
  });

  if (!valid) return;

  // ── Cálculos ─────────────────────────────────────────
  let totalComissoes = 0, totalBonus = 0, totalPagar = 0, qtdMeta = 0;

  const resultados = dados.map(({ nome, venda }) => {
    const p        = calcPercentual(venda);
    const comissao = venda * p / 100;
    const bonus    = venda >= META_BONUS ? VALOR_BONUS : 0;
    const receber  = comissao + bonus;

    totalComissoes += comissao;
    totalBonus     += bonus;
    totalPagar     += receber;
    if (bonus > 0) qtdMeta++;

    return { nome, venda, p, comissao, bonus, receber };
  });

  // ── Preenche tabela ───────────────────────────────────
  document.getElementById('result-body').innerHTML = resultados.map(r => `
    <tr>
      <td class="td-name">${esc(r.nome)}</td>
      <td class="td-money">${fmt(r.venda)}</td>
      <td><span class="badge-pct pct-${r.p}">${r.p}%</span></td>
      <td class="td-money">${fmt(r.comissao)}</td>
      <td>
        <span class="badge-bonus ${r.bonus > 0 ? 'bonus-sim' : 'bonus-nao'}">
          ${r.bonus > 0 ? '✓ ' + fmt(r.bonus) : '—'}
        </span>
      </td>
      <td class="td-money" style="font-weight:700">${fmt(r.receber)}</td>
    </tr>
  `).join('');

  // ── Preenche tiles de resumo ──────────────────────────
  document.getElementById('summary-tiles').innerHTML = `
    <div class="summary-tile">
      <div class="tile-label">Vendedores</div>
      <div class="tile-value accent">${dados.length}</div>
    </div>
    <div class="summary-tile">
      <div class="tile-label">Total comissões</div>
      <div class="tile-value">${fmt(totalComissoes)}</div>
    </div>
    <div class="summary-tile">
      <div class="tile-label">Total bônus</div>
      <div class="tile-value green">${fmt(totalBonus)}</div>
    </div>
    <div class="summary-tile">
      <div class="tile-label">Total a pagar</div>
      <div class="tile-value accent">${fmt(totalPagar)}</div>
    </div>
    <div class="summary-tile">
      <div class="tile-label">Bateram a meta</div>
      <div class="tile-value green">
        ${qtdMeta}
        <span style="font-size:13px;font-family:Inter,sans-serif;font-weight:500;color:var(--fg-muted)">
          de ${dados.length}
        </span>
      </div>
    </div>
  `;

  const res = document.getElementById('resultados');
  res.classList.add('visible');
  res.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Reiniciar ────────────────────────────────────────────

function novoCalculo() {
  document.getElementById('resultados').classList.remove('visible');
  document.getElementById('step2').hidden = true;
  document.getElementById('qtd-input').value = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Enter no campo de quantidade avança ──────────────────
document.getElementById('qtd-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') gerarFormulario();
});
