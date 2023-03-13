const API_BASE = "https://api.apilayer.com/fixer";
const fetchBase = async (url) =>
  await fetch(`${API_BASE}/${url}`, {
    headers: { apikey: "RABusSzWZhYGY9vrv4naDlqBgNnngLdz" },
  });

export async function converter(moedaOrigem, valor) {
  const response = await fetchBase(
    `convert?to=BRL&from=${moedaOrigem}&amount=${valor}`
  );

  const result = await response.json();

  return result.result;
}

export async function exibirDisponiveis() {
  const response = await fetchBase("symbols");

  const result = await response.json();

  const select = document.querySelector("#moedasDisponiveis");

  // console.log(result.symbols);
  select.options.length = 0;
  select.options[select.options.length] = new Option("Escolha a moeda", "");

  for (const moeda in result.symbols) {
    select.options[select.options.length] = new Option(
      `${moeda} - ${result.symbols[moeda]}`,
      moeda
    );
  }
}

export async function historico(moedaOrigem) {
  const response = await fetchBase(
    `timeseries?start_date=2023-03-01&end_date=2023-03-12&base=${moedaOrigem}&symbols=BRL`
  );

  const result = await response.json();

  return result.rates;
}
