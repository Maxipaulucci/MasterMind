export function generarNumeroAleatorio(sinRepetir: boolean): number[] {
  const numeros = [];
  
  if (sinRepetir) {
    // Generar número sin cifras repetidas
    const digitos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 4; i++) {
      const indice = Math.floor(Math.random() * digitos.length);
      numeros.push(digitos[indice]);
      digitos.splice(indice, 1);
    }
  } else {
    // Generar número con cifras que pueden repetirse
    for (let i = 0; i < 4; i++) {
      numeros.push(Math.floor(Math.random() * 10));
    }
  }
  
  return numeros;
}

export function verificarIntento(intento: string, numeroSecreto: number[]): { bien: number; regular: number; mal: number } {
  const intentoArray = intento.split('').map(Number);
  let bien = 0;
  let regular = 0;
  let mal = 0;
  
  // Verificar números en posición correcta (Bien)
  for (let i = 0; i < 4; i++) {
    if (intentoArray[i] === numeroSecreto[i]) {
      bien++;
    }
  }
  
  // Verificar números en posición incorrecta (Regular)
  const secretosUsados = new Array(4).fill(false);
  const intentosUsados = new Array(4).fill(false);
  
  // Marcar los que ya están bien
  for (let i = 0; i < 4; i++) {
    if (intentoArray[i] === numeroSecreto[i]) {
      secretosUsados[i] = true;
      intentosUsados[i] = true;
    }
  }
  
  // Buscar números en posición incorrecta
  for (let i = 0; i < 4; i++) {
    if (!intentosUsados[i]) {
      for (let j = 0; j < 4; j++) {
        if (!secretosUsados[j] && intentoArray[i] === numeroSecreto[j]) {
          regular++;
          secretosUsados[j] = true;
          break;
        }
      }
    }
  }
  
  // Los que quedan son malos
  mal = 4 - bien - regular;
  
  return { bien, regular, mal };
} 