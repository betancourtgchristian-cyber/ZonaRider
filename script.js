// Simulación de base de datos local para almacenar citas ocupadas
let bookedAppointments = {
    // Estructura interna simulada: 'Fecha': ['Hora1', 'Hora2']
};

// Generar los próximos 4 días hábiles de forma automática para el selector
const dateSelector = document.getElementById('date-selector');
const timeSelector = document.getElementById('time-selector');
const bookingFormContainer = document.getElementById('booking-form-container');

const baseHours = ["09:00 AM", "10:30 AM", "12:00 PM", "01:30 PM", "04:00 PM", "05:30 PM"];

function initCalendar() {
    const today = new Date();
    dateSelector.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        
        // Omitir domingos
        if(nextDate.getDay() === 0) continue; 

        const dateString = nextDate.toISOString().split('T')[0];
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        const formattedDate = nextDate.toLocaleDateString('es-MX', options);

        const btn = document.createElement('button');
        btn.className = "w-full text-left bg-zinc-900 border border-zinc-800 p-4 font-bold uppercase transition-all duration-200 hover:border-amber-500 text-zinc-300 flex justify-between items-center date-btn";
        btn.dataset.date = dateString;
        btn.innerHTML = `<span>${formattedDate}</span> <i class="fa-solid fa-chevron-right text-xs text-zinc-600"></i>`;
        
        btn.addEventListener('click', () => selectDate(dateString, btn));
        dateSelector.appendChild(btn);
    }
}

function selectDate(dateString, activeBtn) {
    // Resetear estilos de botones de fecha
    document.querySelectorAll('.date-btn').forEach(b => {
        b.classList.remove('border-amber-500', 'text-amber-500', 'bg-zinc-800');
        b.classList.add('border-zinc-800', 'text-zinc-300', 'bg-zinc-900');
    });
    
    // Activar botón seleccionado
    activeBtn.classList.remove('border-zinc-800', 'text-zinc-300', 'bg-zinc-900');
    activeBtn.classList.add('border-amber-500', 'text-amber-500', 'bg-zinc-800');

    document.getElementById('selected-date-input').value = dateString;
    renderHours(dateString);
    
    // Ocultar formulario al cambiar fecha hasta elegir hora
    bookingFormContainer.classList.add('hidden', 'opacity-0');
}

function renderHours(dateString) {
    timeSelector.innerHTML = '';
    const bookedTimes = bookedAppointments[dateString] || [];

    baseHours.forEach(hour => {
        const isBooked = bookedTimes.includes(hour);
        const btn = document.createElement('button');
        
        if (isBooked) {
            btn.className = "bg-zinc-900 border border-zinc-850 text-zinc-600 line-through p-3 text-center font-medium cursor-not-allowed";
            btn.disabled = true;
            btn.innerHTML = `<i class="fa-solid fa-lock mr-2 text-xs"></i> ${hour}`;
        } else {
            btn.className = "bg-zinc-900 border border-zinc-800 hover:border-amber-500 text-white p-3 text-center font-bold tracking-wider transition-all duration-200 hour-btn";
            btn.innerHTML = `<i class="fa-solid fa-check text-emerald-500 opacity-0 mr-1 text-xs"></i> ${hour}`;
            btn.addEventListener('click', () => selectHour(hour, btn));
        }
        
        timeSelector.appendChild(btn);
    });
}

function selectHour(hour, activeBtn) {
    document.querySelectorAll('.hour-btn').forEach(b => {
        b.classList.remove('border-amber-500', 'bg-amber-500/10');
        b.querySelector('i').classList.add('opacity-0');
    });

    activeBtn.classList.add('border-amber-500', 'bg-amber-500/10');
    activeBtn.querySelector('i').classList.remove('opacity-0');

    document.getElementById('selected-time-input').value = hour;
    
    // Mostrar formulario con transición
    bookingFormContainer.classList.remove('hidden');
    setTimeout(() => {
        bookingFormContainer.classList.remove('opacity-0');
    }, 10);
}

// Envío del Formulario (Actualización en tiempo real)
document.getElementById('appointment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const date = document.getElementById('selected-date-input').value;
    const time = document.getElementById('selected-time-input').value;
    const name = document.getElementById('user-name').value;
    const bike = document.getElementById('bike-model').value;

    if (!bookedAppointments[date]) {
        bookedAppointments[date] = [];
    }
    
    // Bloquear el slot
    bookedAppointments[date].push(time);
    
    alert(`⚡ ¡Slot reservado con éxito para Zona Rider! ⚡\n\nPiloto: ${name}\nMoto: ${bike}\nFecha: ${date} a las ${time}.\n\nTe esperamos.`);

    // Limpiar formulario y refrescar interfaz en tiempo real
    document.getElementById('appointment-form').reset();
    bookingFormContainer.classList.add('hidden', 'opacity-0');
    renderHours(date);
});

// Inicializar el sistema al cargar
initCalendar();