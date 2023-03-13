import { converter, exibirDisponiveis, historico } from "./conversao.js";

// adiciona partials ao código
$(function () {
  var includes = $("[data-include]");
  $.each(includes, function () {
    var file = "partials/" + $(this).data("include") + ".html";
    $(this).load(file);
  });
});

exibirDisponiveis();

document
  .querySelector("#botaoConversao")
  .addEventListener("click", async () => {
    const valor = +document.querySelector("#valorMoeda").value;
    const select = document.querySelector("#moedasDisponiveis");
    const moeda = select.options[select.selectedIndex].value;
    const valorConvertido = await converter(moeda, valor);
    const nf = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    document.querySelector("#resultado").innerText = nf.format(valorConvertido);
    const variacao = await historico(moeda);
    const diasVariacao = [];
    const variacaoEmReais = [];

    for (const data in variacao) {
      diasVariacao.push(
        `${new Date(data).getDate()}/${new Date(data).getMonth() + 1}`
      );
      variacaoEmReais.push(+variacao[data].BRL.toFixed(2));
    }

    console.log(diasVariacao);
    console.log(variacaoEmReais);
    const contexto = document.querySelector("#grafico");
    new Chart(contexto, {
      type: "line",
      data: {
        labels: diasVariacao,
        datasets: [
          {
            label: "Variação em dias",
            data: variacaoEmReais,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  });
