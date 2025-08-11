// Mensajes de beneficio para energías renovables
const benefitMessages = [
    "🌞 Las energías renovables ayudan a reducir tu huella de carbono y proteger el planeta.",
    "💸 Pasarte a energías renovables puede disminuir significativamente tus costos mensuales.",
    "⚡ Con energías limpias, aseguras un suministro más estable y menos dependiente de combustibles fósiles.",
    "🌱 Contribuyes al desarrollo sostenible de tu región y fomentas empleos verdes.",
    "🔋 Aprovecha los recursos naturales del Caribe para generar tu propia energía y ser más independiente."
];

function showBenefitMessage() {
    const randomIndex = Math.floor(Math.random() * benefitMessages.length);
    const benefitSection = document.getElementById('benefit-message');
    if (benefitSection) {
        benefitSection.textContent = benefitMessages[randomIndex];
    }
}
// Dataset de municipios del Caribe colombiano
const municipiosData = {
    riohacha: {
        nombre: "Riohacha",
        consumo_promedio_kwh: 180,
        costo_actual_pesos: 90000,
        ahorro_estimado_porcentaje: 25,
        tarifa_kwh: 500 // pesos por kWh
    },
    barrancas: {
        nombre: "Barrancas",
        consumo_promedio_kwh: 150,
        costo_actual_pesos: 75000,
        ahorro_estimado_porcentaje: 30,
        tarifa_kwh: 500
    },
    valledupar: {
        nombre: "Valledupar",
        consumo_promedio_kwh: 220,
        costo_actual_pesos: 110000,
        ahorro_estimado_porcentaje: 20,
        tarifa_kwh: 500
    },
    santa_marta: {
        nombre: "Santa Marta",
        consumo_promedio_kwh: 170,
        costo_actual_pesos: 85000,
        ahorro_estimado_porcentaje: 22,
        tarifa_kwh: 500
    },
    soledad: {
        nombre: "Soledad",
        consumo_promedio_kwh: 200,
        costo_actual_pesos: 100000,
        ahorro_estimado_porcentaje: 28,
        tarifa_kwh: 500
    }
};

// Variables globales
let calculatorForm;
let resultsContainer;

// Inicialización cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    calculatorForm = document.getElementById('energyForm');
    resultsContainer = document.getElementById('results');
    
    // Event listeners
    calculatorForm.addEventListener('submit', handleFormSubmit);
    document.getElementById('municipio').addEventListener('change', handleMunicipioChange);
    
    // Auto-completar campos cuando se selecciona municipio
    setupAutoComplete();

    // Lógica para deshabilitar campos mutuamente
    const consumoInput = document.getElementById('consumo_actual');
    const costoInput = document.getElementById('costo_actual');


    consumoInput.addEventListener('input', function() {
        const municipio = document.getElementById('municipio').value;
        if (this.value && this.value.length > 0 && parseFloat(this.value) > 0 && municipio && municipiosData[municipio]) {
            // Calcular costo estimado
            const costoEstimado = parseFloat(this.value) * municipiosData[municipio].tarifa_kwh;
            costoInput.value = '';
            costoInput.placeholder = `Estimado: ${formatCurrency(costoEstimado)}`;
            costoInput.disabled = true;
            costoInput.classList.add('input-disabled');
        } else {
            costoInput.disabled = false;
            costoInput.classList.remove('input-disabled');
            // Restaurar placeholder
            if (municipio && municipiosData[municipio]) {
                costoInput.placeholder = `Promedio ${municipiosData[municipio].nombre}: ${formatCurrency(municipiosData[municipio].costo_actual_pesos)}`;
            } else {
                costoInput.placeholder = 'Costo mensual de tu factura';
            }
        }
    });

    costoInput.addEventListener('input', function() {
        const municipio = document.getElementById('municipio').value;
        if (this.value && this.value.length > 0 && parseFloat(this.value) > 0 && municipio && municipiosData[municipio]) {
            // Calcular consumo estimado
            const consumoEstimado = parseFloat(this.value) / municipiosData[municipio].tarifa_kwh;
            consumoInput.value = '';
            consumoInput.placeholder = `Estimado: ${consumoEstimado.toFixed(1)} kWh`;
            consumoInput.disabled = true;
            consumoInput.classList.add('input-disabled');
        } else {
            consumoInput.disabled = false;
            consumoInput.classList.remove('input-disabled');
            // Restaurar placeholder
            if (municipio && municipiosData[municipio]) {
                consumoInput.placeholder = `Promedio ${municipiosData[municipio].nombre}: ${municipiosData[municipio].consumo_promedio_kwh} kWh`;
            } else {
                consumoInput.placeholder = 'Ingresa tu consumo en kWh';
            }
        }
    });

    // Al resetear, habilitar ambos campos
    calculatorForm.addEventListener('reset', function() {
        setTimeout(() => {
            consumoInput.disabled = false;
            costoInput.disabled = false;
            consumoInput.classList.remove('input-disabled');
            costoInput.classList.remove('input-disabled');
        }, 0);
    });
});

// Manejar envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (validateForm()) {
        const formData = getFormData();
        const results = calculateSavings(formData);
        displayResults(results, formData);

        // Mostrar mensaje de beneficio después de calcular
        showBenefitMessage();

        // Scroll suave a los resultados
        resultsContainer.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Validar formulario
function validateForm() {
    const municipio = document.getElementById('municipio').value;
    
    if (!municipio) {
        showError('municipio', 'Por favor selecciona un municipio');
        return false;
    }
    
    clearErrors();
    return true;
}

// Obtener datos del formulario
function getFormData() {
    const municipio = document.getElementById('municipio').value;
    const consumoInput = document.getElementById('consumo_actual');
    const costoInput = document.getElementById('costo_actual');
    const consumoActual = parseFloat(consumoInput.value) || null;
    const costoActual = parseFloat(costoInput.value) || null;
    let consumoEstimado = null;
    if (!consumoActual && costoActual && municipio && municipiosData[municipio]) {
        // Si solo hay costo, calcular consumo estimado
        consumoEstimado = costoActual / municipiosData[municipio].tarifa_kwh;
    }
    return {
        municipio: municipio,
        municipioData: municipiosData[municipio],
        consumoActual: consumoActual,
        costoActual: costoActual,
        consumoEstimado: consumoEstimado
    };
}

// Calcular ahorros
function calculateSavings(formData) {
    const { municipioData, consumoActual, costoActual, consumoEstimado } = formData;
    // Determinar consumo a usar (ingresado por usuario, estimado por costo, o promedio del municipio)
    let consumoFinal = consumoActual;
    if (!consumoFinal && consumoEstimado) {
        consumoFinal = consumoEstimado;
    } else if (!consumoFinal) {
        consumoFinal = municipioData.consumo_promedio_kwh;
    }

    // Determinar costo actual
    let costoActualFinal;
    if (costoActual) {
        costoActualFinal = costoActual;
    } else if (consumoActual) {
        // Calcular basado en consumo ingresado
        costoActualFinal = consumoActual * municipioData.tarifa_kwh;
    } else {
        // Usar costo promedio del municipio
        costoActualFinal = municipioData.costo_actual_pesos;
    }

    // Calcular ahorro
    const porcentajeAhorro = municipioData.ahorro_estimado_porcentaje;
    const ahorroMensual = (costoActualFinal * porcentajeAhorro) / 100;
    const costoConRenovables = costoActualFinal - ahorroMensual;

    // Proyección anual
    const ahorroAnual = ahorroMensual * 12;

    // Calcular reducción de CO2 (estimación: 0.5 kg CO2 por kWh ahorrado)
    const kwhAhorrados = (consumoFinal * porcentajeAhorro) / 100;
    const co2Reducido = kwhAhorrados * 0.5 * 12; // kg CO2 por año

    return {
        consumoFinal: consumoFinal,
        costoActual: costoActualFinal,
        costoConRenovables: costoConRenovables,
        ahorroMensual: ahorroMensual,
        ahorroAnual: ahorroAnual,
        porcentajeAhorro: porcentajeAhorro,
        co2Reducido: co2Reducido,
        kwhAhorrados: kwhAhorrados
    };
}

// Mostrar resultados
function displayResults(results, formData) {
    const { municipioData } = formData;
    
    // Actualizar valores en las tarjetas
    document.getElementById('current-cost').textContent = formatCurrency(results.costoActual);
    document.getElementById('renewable-cost').textContent = formatCurrency(results.costoConRenovables);
    document.getElementById('monthly-savings').textContent = formatCurrency(results.ahorroMensual);
    document.getElementById('savings-percentage').textContent = `${results.porcentajeAhorro}%`;
    document.getElementById('user-consumption').textContent = `${results.consumoFinal} kWh`;
    document.getElementById('kwh-saved').textContent = `${Math.round(results.kwhAhorrados)} kWh`;
    
    // Proyección anual
    document.getElementById('annual-savings').textContent = formatCurrency(results.ahorroAnual);
    
    // Información del municipio
    displayMunicipalityInfo(municipioData, results);
    
    // Mostrar contenedor de resultados
    resultsContainer.style.display = 'block';
}

// Mostrar información del municipio
function displayMunicipalityInfo(municipioData, results) {
    const municipalityDetails = document.getElementById('municipality-details');
    
    municipalityDetails.innerHTML = `
        <div class="municipality-details">
            <div class="municipality-stat">
                <span class="label">Municipio</span>
                <span class="value">${municipioData.nombre}</span>
            </div>
            <div class="municipality-stat">
                <span class="label">Consumo promedio</span>
                <span class="value">${municipioData.consumo_promedio_kwh} kWh</span>
            </div>
            <div class="municipality-stat">
                <span class="label">Costo promedio</span>
                <span class="value">${formatCurrency(municipioData.costo_actual_pesos)}</span>
            </div>
            <div class="municipality-stat">
                <span class="label">Potencial de ahorro</span>
                <span class="value">${municipioData.ahorro_estimado_porcentaje}%</span>
            </div>
            
        </div>
    `;
}

// Configurar auto-completado
function setupAutoComplete() {
    document.getElementById('municipio').addEventListener('change', function() {
        const municipio = this.value;
        const consumoInput = document.getElementById('consumo_actual');
        const costoInput = document.getElementById('costo_actual');
        
        if (municipio && municipiosData[municipio]) {
            const data = municipiosData[municipio];
            
            // Actualizar placeholders con valores promedio
            consumoInput.placeholder = `Promedio ${data.nombre}: ${data.consumo_promedio_kwh} kWh`;
            costoInput.placeholder = `Promedio ${data.nombre}: ${formatCurrency(data.costo_actual_pesos)}`;
        }
    });
}

// Manejar cambio de municipio
function handleMunicipioChange(event) {
    const municipio = event.target.value;
    
    if (municipio && municipiosData[municipio]) {
        // Limpiar errores previos
        clearErrors();
        
        // Mostrar información contextual
        showMunicipioInfo(municipiosData[municipio]);
    }
}

// Mostrar información del municipio seleccionado
function showMunicipioInfo(data) {
    // Puedes agregar una notificación temporal o tooltip aquí
    console.log(`Municipio seleccionado: ${data.nombre}`);
    console.log(`Consumo promedio: ${data.consumo_promedio_kwh} kWh`);
    console.log(`Ahorro estimado: ${data.ahorro_estimado_porcentaje}%`);
}


// Utilidades
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    // Agregar clase de error
    formGroup.classList.add('error');
    
    // Crear o actualizar mensaje de error
    let errorMsg = formGroup.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        formGroup.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
    
    // Focus en el campo con error
    field.focus();
}

function clearErrors() {
    document.querySelectorAll('.form-group.error').forEach(group => {
        group.classList.remove('error');
    });
    
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.remove();
    });
}

// Funciones adicionales para mejorar la experiencia de usuario

// Validación en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[type="number"]');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });
});

// Animación de carga para el botón
function showLoadingState() {
    const button = document.querySelector('.calculate-btn');
    button.classList.add('loading');
    button.disabled = true;
    
    setTimeout(() => {
        button.classList.remove('loading');
        button.disabled = false;
    }, 1000);
}

// Agregar efectos de hover dinámicos
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.result-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Exportar funciones para testing (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        municipiosData,
        calculateSavings,
        formatCurrency,
        validateForm
    };
}