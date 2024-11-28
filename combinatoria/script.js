
function factorial(num) {
    if (num === 0 || num === 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) {
        result *= i;
    }
    return result;
}


document.getElementById('calculateButton').addEventListener('click', () => {
    const calcType = document.getElementById('calculationType').value;
    const n = parseInt(document.getElementById('nValue').value);
    const r = parseInt(document.getElementById('rValue').value);
    const resultDiv = document.getElementById('result');

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0) {
        resultDiv.textContent = 'Por favor, ingresa valores válidos para n y r.';
        return;
    }

    let result = 0;
    let formula = '';

    switch (calcType) {
        case 'combWithoutRep':
            if (r > n) {
                resultDiv.textContent = 'En combinaciones sin repetición, r no puede ser mayor que n.';
                return;
            }
            result = factorial(n) / (factorial(r) * factorial(n - r));
            formula = `C(n, r) = n! / (r!(n-r)!)`;
            break;

        case 'combWithRep':
            result = factorial(n + r - 1) / (factorial(r) * factorial(n - 1));
            formula = `C'(n, r) = (n+r-1)! / (r!(n-1)!)`;
            break;

        case 'permWithoutRep':
            if (r > n) {
                resultDiv.textContent = 'En permutaciones sin repetición, r no puede ser mayor que n.';
                return;
            }
            result = factorial(n) / factorial(n - r);
            formula = `P(n, r) = n! / (n-r)!`;
            break;

        case 'permWithRep':
            result = Math.pow(n, r);
            formula = `P'(n, r) = n^r`;
            break;

        case 'varWithoutRep':
            if (r > n) {
                resultDiv.textContent = 'En variaciones sin repetición, r no puede ser mayor que n.';
                return;
            }
            result = factorial(n) / factorial(n - r);
            formula = `V(n, r) = n! / (n-r)!`;
            break;

        case 'varWithRep':
            result = Math.pow(n, r);
            formula = `V'(n, r) = n^r`;
            break;

        default:
            resultDiv.textContent = 'Selecciona un tipo de cálculo válido.';
            return;
    }

    resultDiv.innerHTML = `
        <strong>Resultado:</strong> ${result}<br>
        <strong>Fórmula usada:</strong> ${formula}
    `;
});
