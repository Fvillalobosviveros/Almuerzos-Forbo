// Selección de elementos
const lunchForm = document.getElementById('lunchForm');
const lunchList = document.getElementById('lunchList');
const generatePDF = document.getElementById('generatePDF');

// Array para almacenar los almuerzos
let lunches = [];

// Manejar el formulario
lunchForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Evitar recarga de la página

  // Obtener valores del formulario
  const name = lunchForm.querySelector('select[name="name"]').value; // Obtener el valor seleccionado del dropdown
  const lunchOption = document.getElementById('lunchOption').value;
  const notes = document.getElementById('notes').value;
  const date = document.getElementById('date').value;

  // Guardar en el array
  const lunch = { name, lunchOption, notes, date };
  lunches.push(lunch);

  // Crear un nuevo elemento de lista
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${name} eligió: ${lunchOption} ${notes ? `(${notes})` : ''} - Fecha: ${date}</span>
    <button class="delete-btn">Eliminar</button>
  `;

  // Agregar funcionalidad para eliminar
  li.querySelector('.delete-btn').addEventListener('click', function () {
    lunches = lunches.filter((l) => l !== lunch); // Eliminar del array
    li.remove();
  });

  // Agregar el elemento a la lista
  lunchList.appendChild(li);

  // Limpiar el formulario
  lunchForm.reset();
});

// Generar PDF
generatePDF.addEventListener('click', function () {
  const doc = new jspdf.jsPDF();
  const pageWidth = doc.internal.pageSize.width; // Ancho de la página
  const margin = 10; // Márgenes
  const maxWidth = pageWidth - margin * 2; // Ancho máximo del texto dentro de los márgenes
  let y = 20; // Posición inicial vertical

  // Agregar título al PDF
  doc.setFontSize(16);
  doc.text('Lista de Almuerzos', margin, y);
  y += 10; // Espacio debajo del título

  // Agregar almuerzos al PDF
  lunches.forEach((lunch, index) => {
    const text = `${index + 1}. ${lunch.name} - ${lunch.lunchOption} - Fecha: ${lunch.date} ${lunch.notes ? `(${lunch.notes})` : ''}`;
    const lines = doc.splitTextToSize(text, maxWidth); // Dividir texto en líneas
    doc.text(lines, margin, y); // Agregar las líneas al PDF
    y += lines.length * 10; // Ajustar posición vertical según el número de líneas

    // Si la posición `y` supera el límite de la página, agregar una nueva página
    if (y > doc.internal.pageSize.height - margin) {
      doc.addPage();
      y = margin; // Resetear posición vertical
    }
  });

  // Guardar el PDF
  doc.save('Lista_de_Almuerzos.pdf');
});
