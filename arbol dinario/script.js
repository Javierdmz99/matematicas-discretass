class Nodo {
    constructor(valor) {
      this.valor = valor;
      this.izquierdo = this.derecho = null;
    }
  }

  let canvas, ctx, raiz = null;
  let offsetX = 0, offsetY = 0, scale = 1, isDragging = false, dragStartX, dragStartY;

  const insertarNodo = (raiz, valor) => {
    if (!raiz) return new Nodo(valor);
    if (valor < raiz.valor) raiz.izquierdo = insertarNodo(raiz.izquierdo, valor);
    else if (valor > raiz.valor) raiz.derecho = insertarNodo(raiz.derecho, valor);
    return raiz;
  };

  const recorridoInorden = (nodo, resultado = []) => {
    if (!nodo) return resultado;
    recorridoInorden(nodo.izquierdo, resultado);
    resultado.push(nodo.valor);
    return recorridoInorden(nodo.derecho, resultado);
  };

  const recorridoPreorden = (nodo, resultado = []) => {
    if (!nodo) return resultado;
    resultado.push(nodo.valor);
    recorridoPreorden(nodo.izquierdo, resultado);
    recorridoPreorden(nodo.derecho, resultado);
    return resultado;
  };

  const recorridoPosorden = (nodo, resultado = []) => {
    if (!nodo) return resultado;
    recorridoPosorden(nodo.izquierdo, resultado);
    recorridoPosorden(nodo.derecho, resultado);
    resultado.push(nodo.valor);
    return resultado;
  };

  const dibujarArbol = (nodo, x, y, nivel, espaciado) => {
    if (!nodo) return;
    const deltaX = espaciado / (nivel + 1);
    if (nodo.izquierdo) {
      dibujarLinea(x, y, x - deltaX, y + 70);
      dibujarArbol(nodo.izquierdo, x - deltaX, y + 70, nivel + 1, espaciado * 0.7);
    }
    if (nodo.derecho) {
      dibujarLinea(x, y, x + deltaX, y + 70);
      dibujarArbol(nodo.derecho, x + deltaX, y + 70, nivel + 1, espaciado * 0.7);
    }
    dibujarNodo(nodo.valor, x, y);
  };

  const dibujarNodo = (valor, x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "#4CAF50";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(valor, x, y);
  };

  const dibujarLinea = (x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  const dibujarCanvas = () => {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    if (raiz) dibujarArbol(raiz, canvas.width / 2, 50, 0, canvas.width / 4);
    ctx.restore();
  };

  const generateTree = () => {
    const input = document.getElementById("numbers").value.trim();
    const valores = input.split(",").map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v));
    raiz = valores.reduce((tree, valor) => insertarNodo(tree, valor), null);
    
    // Mostrar recorridos
    document.getElementById("inorderTraversal").textContent = recorridoInorden(raiz).join(", ");
    document.getElementById("preorderTraversal").textContent = recorridoPreorden(raiz).join(", ");
    document.getElementById("postorderTraversal").textContent = recorridoPosorden(raiz).join(", ");
    
    dibujarCanvas();
  };

  const clearTree = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("inorderTraversal").textContent = "-";
    document.getElementById("preorderTraversal").textContent = "-";
    document.getElementById("postorderTraversal").textContent = "-";
    document.getElementById("numbers").value = "";
    raiz = null;
  };

  const setupCanvasInteractions = () => {
    canvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      dragStartX = e.offsetX - offsetX;
      dragStartY = e.offsetY - offsetY;
      canvas.style.cursor = "grabbing";
    });

    canvas.addEventListener("mousemove", (e) => {
      if (isDragging) {
        offsetX = e.offsetX - dragStartX;
        offsetY = e.offsetY - dragStartY;
        dibujarCanvas();
      }
    });

    canvas.addEventListener("mouseup", () => {
      isDragging = false;
      canvas.style.cursor = "grab";
    });

    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      scale += e.deltaY > 0 ? -0.1 : 0.1;
      scale = Math.min(Math.max(scale, 0.5), 2);
      dibujarCanvas();
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("binaryTreeCanvas");
    ctx = canvas.getContext("2d");
    setupCanvasInteractions();
  });