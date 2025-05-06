function validarFormulario(id){
    let qtdeNaoPreenchidos = 0

    $(`#${id} .obrigatorio`).map((index,elemento) => {
        if($(elemento).val() === ""){
            qtdeNaoPreenchidos += 1;
            $(elemento).addClass("naoPreenchido")
        }
        else{
            $(elemento).removeClass("naoPreenchido")
        }
    })

    if(qtdeNaoPreenchidos > 0){
        return false;
    }
    else{
        return true;
    }
}

function ativaMascaras(){
    $(`.cep`).mask("00000-000");
    $(`.telefone`).mask("(00) 00000-0000");
    $(`.dinheiro`).mask('000.000.000.000.000,00', {reverse: true});
    $(`.quantidade`).mask('000', {reverse: true});
    $(`.numero`).mask('00000000000000', {reverse: true});
    $(`.numeroCartao`).mask('0000-0000-0000-0000');
}