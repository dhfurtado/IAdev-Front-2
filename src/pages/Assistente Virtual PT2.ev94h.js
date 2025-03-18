$w.onReady(function () {
    // Quando o checkbox for alterado
    // @ts-ignore
    $w("#meuCheckbox").onChange(() => {
        // @ts-ignore
        if ($w("#meuCheckbox").checked) {
            // @ts-ignore
            $w("#meuContainer").expand(); // Expande e empurra os elementos abaixo
        } else {
            // @ts-ignore
            $w("#meuContainer").collapse(); // Recolhe e traz os elementos de volta
        }
    });
});
$w.onReady(function () {
    // @ts-ignore
    $w("#meuCheckbox").onChange(() => {
        // @ts-ignore
        if ($w("#meuCheckbox").checked) {
            // @ts-ignore
            $w("#meuContainer").show("fade", {duration: 500}); // Aparece suavemente
        } else {
            // @ts-ignore
            $w("#meuContainer").hide("fade", {duration: 500}); // Some suavemente
        }
    });
});
