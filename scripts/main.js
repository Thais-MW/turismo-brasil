import { converter, exibirDisponiveis, historico } from "./conversao.js";

function adicionaMenuAtivo() {
  let pagina = $("body").attr("class");
  pagina = "#" + pagina;
  $(".header__menu").find(pagina).addClass("active");
}

$(window).on("load", function () {
  adicionaMenuAtivo();

  $("#botaoModalConversao").on("click", function () {
    $(".modal_conversao").addClass("active");
  });

  $(".close-modal").on("click", function () {
    $(".modal_conversao").removeClass("active");
  });

  $(".culinaria__conteudo_regioes_item").on("click", function () {
    $(this).find(".culinaria__conteudo_regioes_item_texto").slideToggle();
  });

  $(".cultura__conteudo_manifestacoes_item").on("click", function () {
    $(this).find(".cultura__conteudo_manifestacoes_item_texto").slideToggle();
  });
});

// esconde header ao rolar a página
let prevScrollpos = $(window).scrollTop();
$(window).scroll(function () {
  const currentScrollPos = $(window).scrollTop();
  if (prevScrollpos > currentScrollPos) {
    $(".header").removeClass("header-up");
  } else {
    $(".header").addClass("header-up");
  }
  prevScrollpos = currentScrollPos;
});

// exibe resultado da requisão da API Fixer
exibirDisponiveis();

$("#botaoConversao").on("click", async () => {
  const resultado = $("#resultado");
  const grafico = $("#grafico");

  resultado.empty();
  grafico.empty().removeClass("active");

  const valor = +$("#valorMoeda").val();
  const select = $("#moedasDisponiveis");
  const moeda = select.find(":selected").val();

  if (moeda == "" || valor == "") {
    alert("Informe valores válidos");
    return;
  }

  const valorConvertido = await converter(moeda, valor);
  const nf = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  resultado.text(nf.format(valorConvertido));

  const variacao = await historico(moeda);
  const diasVariacao = [];
  const variacaoEmReais = [];

  $.each(variacao, function (data, value) {
    diasVariacao.push(
      `${new Date(data).getDate()}/${new Date(data).getMonth() + 1}`
    );
    variacaoEmReais.push(+value.BRL.toFixed(2));
  });

  grafico.addClass("active");

  new Chart(grafico, {
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
