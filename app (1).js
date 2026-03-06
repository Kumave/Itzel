let movimientos = [];

const lista = document.getElementById("listaMovimientos");
const saldoEl = document.getElementById("saldo");
const ingresosEl = document.getElementById("totalIngresos");
const gastosEl = document.getElementById("totalGastos");

document.getElementById("formMovimiento")
    .addEventListener("submit", agregarMovimiento);

function agregarMovimiento(e) {
    e.preventDefault();

    const descripcion = document.getElementById("descripcion").value;
    const monto = parseFloat(document.getElementById("monto").value);
    const tipo = document.getElementById("tipo").value;
    const categoria = document.getElementById("categoria").value;

    const movimiento = {
        id: Date.now(),
        descripcion,
        monto,
        tipo,
        categoria
    };

    movimientos.push(movimiento);
    guardarEnLocalStorage();
    calcularResumen();
    mostrarMovimientos("todos");

    e.target.reset();
}

function calcularResumen() {
    let ingresos = 0;
    let gastos = 0;

    movimientos.forEach(m => {
        if (m.tipo === "ingreso") {
            ingresos += m.monto;
        } else {
            gastos += m.monto;
        }
    });

    ingresosEl.textContent = ingresos.toFixed(2);
    gastosEl.textContent = gastos.toFixed(2);
    saldoEl.textContent = (ingresos - gastos).toFixed(2);
}

function mostrarMovimientos(filtro) {
    lista.innerHTML = "";

    let filtrados = movimientos;

    if (filtro !== "todos") {
        filtrados = movimientos.filter(m => m.tipo === filtro);
    }

    filtrados.forEach(m => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span>${m.descripcion} (${m.categoria}) - 
            <span class="${m.tipo}">
            $${m.monto.toFixed(2)} - ${m.tipo}
            </span>
            </span>
            <button onclick="eliminarMovimiento(${m.id})">Eliminar</button>
        `;

        lista.appendChild(li);
    });
}

function eliminarMovimiento(id) {
    movimientos = movimientos.filter(m => m.id !== id);
    guardarEnLocalStorage();
    calcularResumen();
    mostrarMovimientos("todos");
}

function borrarTodos() {
    if (confirm("¿Seguro que deseas borrar todos los movimientos?")) {
        movimientos = [];
        guardarEnLocalStorage();
        calcularResumen();
        mostrarMovimientos("todos");
    }
}

function guardarEnLocalStorage() {
    localStorage.setItem("movimientos", JSON.stringify(movimientos));
}

function cargarDeLocalStorage() {
    const data = localStorage.getItem("movimientos");
    if (data) {
        movimientos = JSON.parse(data);
    }
}

window.onload = function () {
    cargarDeLocalStorage();
    calcularResumen();
    mostrarMovimientos("todos");
};