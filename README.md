# Calculadora de Comissões e Bônus — G766

Trabalho vivencial da disciplina **G766 – Tecnologia em Analítica de Negócios**: automatização do cálculo mensal de comissão e bônus dos vendedores de uma loja de eletrodomésticos, que hoje é feito à mão pelo setor financeiro.

## Links

| Material | Endereço |
| --- | --- |
| Calculadora online | <https://pablo-rafael.github.io/CALCULADORA-ONLINE-G766/> |
| Notebook no Google Colab | <https://colab.research.google.com/drive/1gUBouomUBOyR33JBOZMMa4pzFseG2eSB?usp=sharing> |
| Fluxogramas (Miro) | [Quadro no Miro](https://miro.com/app/board/uXjVEVKnaa0=/?moveToWidgets=AQA4jdDG0oqFgIAw4bcb97sV9rAKN5feDCAa2QbQ-gODvQlETOPIHCnCA52LC7SUC4wCo4sWmAG6AWEjJaLzCdcDsOgJcqzXCULfAzetvgkTn8odhKIQhJcKHIb7CLnrCywjq4IVjgGivwkBAQEBAV-PAdOHCPzMCB0) |

## O problema

Para cada vendedor, uma pessoa do financeiro soma as vendas do mês, consulta a tabela de faixas, calcula a comissão na calculadora, confere se a meta foi batida para somar o bônus e anota o valor a receber. O procedimento se repete vendedor por vendedor, todos os meses; é demorado e já gerou pagamentos incorretos. Como as regras são sempre as mesmas, o cálculo pode ser executado por um programa.

## Regras de negócio

| Total vendido no mês | Percentual de comissão |
| --- | --- |
| Até R$ 10.000,00 | 2% |
| De R$ 10.000,01 a R$ 30.000,00 | 4% |
| Acima de R$ 30.000,00 | 6% |

- **Bônus por meta:** total vendido **igual ou superior a R$ 20.000,00** recebe bônus fixo de **R$ 300,00**.
- **Valor a receber:** comissão + bônus (quando houver).
- **Validação:** o total vendido não pode ser negativo; valores negativos são recusados e o valor é solicitado novamente.

## Conteúdo do repositório

| Arquivo | Descrição |
| --- | --- |
| `G766_Notebook_Comissao.ipynb` | Notebook em Python (Google Colab) com o programa de cálculo |
| `g766_notebook_comissao.py` | Versão do programa em script Python |
| `index.html`, `script.js`, `styles.css` | Calculadora online (publicada com GitHub Pages) |

## Como usar

**Calculadora online:** abra o link acima, informe a quantidade de vendedores (de 1 a 50), preencha os dados de cada um e clique em *Calcular comissões*.

**Notebook:** abra o link do Colab (ou envie o `.ipynb` ao Google Colab), execute a célula e informe a quantidade de vendedores e, para cada um, o nome e o total vendido.

**Script local:**

```bash
python g766_notebook_comissao.py
```

## Dados de teste e resultados esperados

| Vendedor | Total vendido | % aplicado | Comissão | Bônus | Valor a receber |
| --- | ---: | :---: | ---: | ---: | ---: |
| Ana | R$ 8.500,00 | 2% | R$ 170,00 | R$ 0,00 | R$ 170,00 |
| Bruno | R$ 10.000,00 | 2% | R$ 200,00 | R$ 0,00 | R$ 200,00 |
| Carla | R$ 20.000,00 | 4% | R$ 800,00 | R$ 300,00 | R$ 1.100,00 |
| Diego | R$ 30.000,00 | 4% | R$ 1.200,00 | R$ 300,00 | R$ 1.500,00 |
| Elisa | R$ 42.350,00 | 6% | R$ 2.541,00 | R$ 300,00 | R$ 2.841,00 |

**Resumo final:** 5 vendedores processados; total de comissões R$ 4.911,00; total de bônus R$ 900,00; total geral a pagar R$ 5.811,00; 3 vendedores bateram a meta (Carla, Diego e Elisa).

Os casos de fronteira confirmam as regras: Bruno (R$ 10.000,00) permanece na faixa de 2%, Diego (R$ 30.000,00) permanece na faixa de 4% e Carla (R$ 20.000,00) já recebe o bônus, pois a meta é "igual ou superior" a R$ 20.000,00.

## Desenvolvimento do trabalho

1. **Análise do processo manual:** levantamento dos passos feitos pelo financeiro, das informações consultadas e dos pontos onde ocorrem erros (soma das vendas, escolha da faixa, bônus e anotação do resultado).
2. **Fluxograma do processo manual:** representação do procedimento atual, do início ao fim, para todos os vendedores, desenhada no Miro.
3. **Fluxograma do processo automatizado:** leitura da quantidade de vendedores, repetição por vendedor, validação do valor negativo, decisões das faixas, decisão do bônus e resumo final, correspondendo ao código do notebook.
4. **Programa em Python (Google Colab):** estrutura de repetição para processar todos os vendedores, condicional encadeada (`if / elif / else`) para as faixas, aplicação do bônus, validação de valores negativos, exibição do resultado por vendedor e do resumo final.
5. **Calculadora online:** versão web das mesmas regras, publicada com GitHub Pages.
6. **Testes:** execução com os cinco vendedores obrigatórios, conferência com o cálculo manual, teste dos valores de fronteira (R$ 10.000,00, R$ 20.000,00 e R$ 30.000,00) e da recusa de valor negativo.
7. **Análise do ganho para a empresa:** estimativa de cerca de 5 min por vendedor no processo manual contra cerca de 0,5 min no automatizado; para 30 vendedores, cerca de 155 min contra 17 min, uma economia de aproximadamente 89%. São estimativas, e o ganho real depende de como os dados são organizados.
8. **Documentação:** relatório em PDF seguindo as normas da ABNT, com fluxogramas, capturas de tela, análise e reflexão crítica.

## Limites da solução

- Não corrige dados errados na origem: se o total vendido for digitado incorretamente, o resultado sairá incorreto.
- Os totais ainda são digitados manualmente; não há leitura da planilha de vendas nem integração com sistemas da loja.
- Não gera folha de pagamento e não guarda histórico dos meses anteriores.
- Faixas, percentuais e bônus estão fixos no código; mudanças na política de comissão exigem atualização do código.

## Equipe

- [Nome completo do integrante]
- [Nome completo do integrante]
- [Nome completo do integrante]
- [Nome completo do integrante]

## Uso de IA generativa

Ferramentas de IA generativa foram utilizadas como apoio, e todo o conteúdo foi conferido pela equipe. A declaração completa consta no relatório entregue (seção 8).
