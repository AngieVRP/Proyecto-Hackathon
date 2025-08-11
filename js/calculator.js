

/**
 * Muestra un mensaje aleatorio de beneficios de energías renovables en la sección correspondiente.
 * Se ejecuta después de calcular el ahorro.
 */
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

/**
 * Inicializa el formulario, listeners y lógica de exclusión mutua de campos.
 * Configura placeholders y efectos visuales.
 */
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
/**
 * Maneja el envío del formulario principal.
 * Valida, obtiene datos, calcula resultados y muestra los resultados y mensaje de beneficio.
 * @param {Event} event - Evento de submit del formulario
 */
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
/**
 * Valida que el municipio haya sido seleccionado.
 * Muestra error si no se selecciona.
 * @returns {boolean} true si es válido, false si no
 */
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
/**
 * Extrae y procesa los datos del formulario.
 * Calcula consumo estimado si solo hay costo, y viceversa.
 * @returns {Object} Objeto con datos del formulario y estimaciones
 */
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
/**
 * Calcula los ahorros y resultados principales de la simulación.
 * Prioriza datos del usuario, calcula kWh ahorrados y proyección anual.
 * @param {Object} formData - Datos del formulario y estimaciones
 * @returns {Object} Resultados de la simulación
 */
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

        // Calcular kWh ahorrados
        const kwhAhorrados = (consumoFinal * porcentajeAhorro) / 100;

    return {
        consumoFinal: consumoFinal,
        costoActual: costoActualFinal,
        costoConRenovables: costoConRenovables,
        ahorroMensual: ahorroMensual,
        ahorroAnual: ahorroAnual,
        porcentajeAhorro: porcentajeAhorro,
        kwhAhorrados: kwhAhorrados
    };
}

// Mostrar resultados
/**
 * Actualiza la interfaz con los resultados calculados.
 * Muestra los valores en las tarjetas y la información del municipio.
 * @param {Object} results - Resultados de la simulación
 * @param {Object} formData - Datos del formulario
 */
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
/**
 * Muestra la información detallada del municipio seleccionado en la interfaz.
 * @param {Object} municipioData - Datos del municipio
 * @param {Object} results - Resultados de la simulación
 */
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
/**
 * Configura el autocompletado de placeholders según el municipio seleccionado.
 * Actualiza los campos de consumo y costo con valores promedio.
 */
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
/**
 * Maneja el cambio de municipio en el formulario.
 * Limpia errores y muestra información contextual.
 * @param {Event} event - Evento de cambio en el select de municipio
 */
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
/**
 * Muestra información contextual del municipio seleccionado (solo en consola).
 * @param {Object} data - Datos del municipio
 */
function showMunicipioInfo(data) {
    // Puedes agregar una notificación temporal o tooltip aquí
    console.log(`Municipio seleccionado: ${data.nombre}`);
    console.log(`Consumo promedio: ${data.consumo_promedio_kwh} kWh`);
    console.log(`Ahorro estimado: ${data.ahorro_estimado_porcentaje}%`);
}


// Utilidades
/**
 * Formatea un número como moneda en pesos colombianos.
 * @param {number} amount - Cantidad a formatear
 * @returns {string} Valor formateado en COP
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Muestra un mensaje de error visual en el formulario para un campo específico.
 * @param {string} fieldId - ID del campo
 * @param {string} message - Mensaje de error
 */
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

/**
 * Limpia todos los mensajes y estilos de error del formulario.
 */
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

/**
 * Valida en tiempo real que los campos numéricos no sean negativos.
 * Aplica corrección automática si se detecta un valor menor a 0.
 */
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
/**
 * Muestra un estado de carga animado en el botón de calcular.
 * Deshabilita el botón temporalmente.
 */
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

/**
 * Agrega efectos de hover dinámicos a las tarjetas de resultados.
 */
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
// Mensajes de beneficio para energías renovables
const benefitMessages = [
    "🌞 Las energías renovables ayudan a reducir tu huella de carbono y proteger el planeta.",
    "💸 Pasarte a energías renovables puede disminuir significativamente tus costos mensuales.",
    "⚡ Con energías limpias, aseguras un suministro más estable y menos dependiente de combustibles fósiles.",
    "🌱 Contribuyes al desarrollo sostenible de tu región y fomentas empleos verdes.",
    "🔋 Aprovecha los recursos naturales del Caribe para generar tu propia energía y ser más independiente."
];
