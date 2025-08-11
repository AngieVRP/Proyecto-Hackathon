

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
    
    // Botón de contacto
    const contactBtn = document.getElementById('contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', handleContactClick);
    }
    
    // Auto-completar campos cuando se selecciona municipio
    setupAutoComplete();

    // Modal para agregar municipio
    setupMunicipioModal();

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
 * Además, configura tooltips matemáticos para cada resultado.
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

    // Tooltips matemáticos estilo Symbolab
    const municipio = formData.municipioData;
    const consumo = results.consumoFinal;
    const costo = results.costoActual;
    const ahorro = results.ahorroMensual;
    const porcentaje = results.porcentajeAhorro;
    const costoRenovable = results.costoConRenovables;
    const kwhAhorro = results.kwhAhorrados;

    // Procesos matemáticos para cada tarjeta
    const tooltips = {
        'card-current': `Costo mensual actual = Consumo mensual × Tarifa\n${consumo} kWh × $${municipio.tarifa_kwh} = ${formatCurrency(consumo * municipio.tarifa_kwh)}`,
        'card-renewable': `Costo con renovables = Costo actual - Ahorro mensual\n${formatCurrency(costo)} - ${formatCurrency(ahorro)} = ${formatCurrency(costoRenovable)}`,
        'card-savings': `Ahorro mensual = Costo actual × %Ahorro\n${formatCurrency(costo)} × ${porcentaje}% = ${formatCurrency(ahorro)}`,
        'card-consumption': `Consumo mensual considerado\n${consumo} kWh`,
        'card-kwh-saved': `kWh ahorrados = Consumo × %Ahorro\n${consumo} × ${porcentaje}% = ${Math.round(kwhAhorro)} kWh`
    };

    Object.entries(tooltips).forEach(([id, text]) => {
        const card = document.getElementById(id);
        if (card) card.setAttribute('data-tooltip', text);
    });

    // Eventos para mostrar/ocultar el tooltip
    const tooltip = document.getElementById('math-tooltip');
    document.querySelectorAll('.result-card').forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const msg = card.getAttribute('data-tooltip');
            if (msg) {
                tooltip.innerText = msg;
                tooltip.style.display = 'block';
            }
        });
        card.addEventListener('mousemove', function(e) {
            tooltip.style.left = (e.clientX + 18) + 'px';
            tooltip.style.top = (e.clientY + 18) + 'px';
        });
        card.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none';
        });
    });
    
    // Proyección anual
    document.getElementById('annual-savings').textContent = formatCurrency(results.ahorroAnual);
    
    // Información del municipio
    displayMunicipalityInfo(municipioData, results);
    
    // Mostrar contenedor de resultados
    resultsContainer.style.display = 'block';
    
    // Mostrar botón de contacto después de un breve retraso
    setTimeout(() => {
        showContactSection();
    }, 800);
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

/**
 * Configura el modal para agregar nuevos municipios.
 * Maneja eventos de abrir, cerrar y guardar municipio.
 */
function setupMunicipioModal() {
    const addBtn = document.getElementById('add-municipio-btn');
    const modal = document.getElementById('municipio-modal');
    const closeBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const form = document.getElementById('new-municipio-form');

    // Configurar lógica de exclusión mutua para los 3 campos
    setupModalFieldLogic();

    // Abrir modal
    addBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // Cerrar modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        form.reset();
        // Rehabilitar todos los campos al cerrar
        enableAllModalFields();
    }

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Cerrar al hacer clic fuera del modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Guardar nuevo municipio
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateModalForm()) {
            saveNewMunicipio();
            closeModal();
        }
    });
}

/**
 * Configura la lógica de exclusión mutua en el modal.
 * Solo permite llenar 2 de los 3 campos: consumo, costo, tarifa.
 * Muestra previsualización temporal del valor calculado.
 */
function setupModalFieldLogic() {
    const consumoInput = document.getElementById('nuevo-consumo');
    const costoInput = document.getElementById('nuevo-costo');
    const tarifaInput = document.getElementById('nueva-tarifa');

    const previewConsumo = document.getElementById('preview-consumo');
    const previewCosto = document.getElementById('preview-costo');
    const previewTarifa = document.getElementById('preview-tarifa');

    function updateFieldStates() {
        const filledFields = [
            consumoInput.value ? 'consumo' : null,
            costoInput.value ? 'costo' : null,
            tarifaInput.value ? 'tarifa' : null
        ].filter(field => field !== null);

        // Ocultar todas las previsualizaciones
        hideAllPreviews();

        // Si ya hay 2 campos llenos, deshabilitar el tercero y mostrar previsualización
        if (filledFields.length >= 2) {
            const consumo = parseInt(consumoInput.value) || 0;
            const costo = parseInt(costoInput.value) || 0;
            const tarifa = parseInt(tarifaInput.value) || 0;

            if (!consumoInput.value && costo && tarifa) {
                // Calcular y mostrar consumo
                const calculatedConsumo = Math.round(costo / tarifa);
                showCalculationPreview(previewConsumo, 
                    `Consumo calculado: ${calculatedConsumo} kWh`,
                    `${costo} ÷ ${tarifa} = ${calculatedConsumo}`);
                consumoInput.disabled = true;
                consumoInput.classList.add('input-disabled');
            }
            
            if (!costoInput.value && consumo && tarifa) {
                // Calcular y mostrar costo
                const calculatedCosto = consumo * tarifa;
                showCalculationPreview(previewCosto, 
                    `Costo calculado: ${formatCurrency(calculatedCosto)}`,
                    `${consumo} × ${tarifa} = ${calculatedCosto}`);
                costoInput.disabled = true;
                costoInput.classList.add('input-disabled');
            }
            
            if (!tarifaInput.value && consumo && costo) {
                // Calcular y mostrar tarifa
                const calculatedTarifa = Math.round(costo / consumo);
                showCalculationPreview(previewTarifa, 
                    `Tarifa calculada: $${calculatedTarifa}/kWh`,
                    `${costo} ÷ ${consumo} = ${calculatedTarifa}`);
                tarifaInput.disabled = true;
                tarifaInput.classList.add('input-disabled');
            }
        } else {
            // Habilitar todos los campos
            enableAllModalFields();
        }
    }

    function hideAllPreviews() {
        [previewConsumo, previewCosto, previewTarifa].forEach(preview => {
            preview.style.display = 'none';
        });
    }

    function showCalculationPreview(previewElement, mainText, formulaText) {
        previewElement.innerHTML = `
            <div>${mainText}</div>
            <div class="formula">${formulaText}</div>
        `;
        previewElement.style.display = 'block';
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            if (previewElement.style.display === 'block') {
                previewElement.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    previewElement.style.display = 'none';
                    previewElement.style.animation = '';
                }, 300);
            }
        }, 5000);
    }

    consumoInput.addEventListener('input', updateFieldStates);
    costoInput.addEventListener('input', updateFieldStates);
    tarifaInput.addEventListener('input', updateFieldStates);
}

/**
 * Habilita todos los campos del modal y oculta las previsualizaciones.
 */
function enableAllModalFields() {
    const fields = ['nuevo-consumo', 'nuevo-costo', 'nueva-tarifa'];
    const previews = ['preview-consumo', 'preview-costo', 'preview-tarifa'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.disabled = false;
        field.classList.remove('input-disabled');
    });

    previews.forEach(previewId => {
        const preview = document.getElementById(previewId);
        if (preview) {
            preview.style.display = 'none';
        }
    });
}

/**
 * Valida que se hayan llenado exactamente 2 de los 3 campos principales.
 * @returns {boolean} true si es válido, false si no
 */
function validateModalForm() {
    const consumo = document.getElementById('nuevo-consumo').value;
    const costo = document.getElementById('nuevo-costo').value;
    const tarifa = document.getElementById('nueva-tarifa').value;

    const filledFields = [consumo, costo, tarifa].filter(value => value && value.trim() !== '');

    if (filledFields.length !== 2) {
        alert('Debes llenar exactamente 2 de los 3 campos: Consumo, Costo o Tarifa.');
        return false;
    }

    return true;
}

/**
 * Guarda un nuevo municipio en el dataset y lo agrega al select.
 * Calcula automáticamente el tercer valor basado en los dos campos llenos.
 */
function saveNewMunicipio() {
    const nombre = document.getElementById('nuevo-nombre').value.trim();
    const consumoValue = document.getElementById('nuevo-consumo').value;
    const costoValue = document.getElementById('nuevo-costo').value;
    const tarifaValue = document.getElementById('nueva-tarifa').value;
    const ahorro = parseInt(document.getElementById('nuevo-ahorro').value);

    // Determinar qué valores están llenos
    const consumo = consumoValue ? parseInt(consumoValue) : null;
    const costo = costoValue ? parseInt(costoValue) : null;
    const tarifa = tarifaValue ? parseInt(tarifaValue) : null;

    // Calcular el valor faltante
    let consumoFinal, costoFinal, tarifaFinal;

    if (consumo && costo && !tarifa) {
        // Calcular tarifa: tarifa = costo / consumo
        consumoFinal = consumo;
        costoFinal = costo;
        tarifaFinal = Math.round(costo / consumo);
    } else if (consumo && tarifa && !costo) {
        // Calcular costo: costo = consumo * tarifa
        consumoFinal = consumo;
        tarifaFinal = tarifa;
        costoFinal = consumo * tarifa;
    } else if (costo && tarifa && !consumo) {
        // Calcular consumo: consumo = costo / tarifa
        costoFinal = costo;
        tarifaFinal = tarifa;
        consumoFinal = Math.round(costo / tarifa);
    } else {
        alert('Error en la configuración de campos.');
        return;
    }

    // Crear ID único para el municipio
    const municipioId = nombre.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    // Validar que no exista ya
    if (municipiosData[municipioId]) {
        alert('Este municipio ya existe en la lista.');
        return;
    }

    // Agregar al dataset
    municipiosData[municipioId] = {
        nombre: nombre,
        consumo_promedio_kwh: consumoFinal,
        costo_actual_pesos: costoFinal,
        ahorro_estimado_porcentaje: ahorro,
        tarifa_kwh: tarifaFinal
    };

    // Agregar al select
    const select = document.getElementById('municipio');
    const option = document.createElement('option');
    option.value = municipioId;
    option.textContent = nombre;
    select.appendChild(option);

    // Seleccionar el nuevo municipio
    select.value = municipioId;

    // Disparar evento de cambio para actualizar placeholders
    select.dispatchEvent(new Event('change'));

    // Mostrar mensaje de éxito con valores calculados
    const calculatedField = !consumoValue ? `Consumo: ${consumoFinal} kWh` : 
                          !costoValue ? `Costo: ${formatCurrency(costoFinal)}` : 
                          `Tarifa: $${tarifaFinal}/kWh`;
    
    showSuccessMessage(`Municipio "${nombre}" agregado exitosamente. ${calculatedField} calculado automáticamente.`);
}

/**
 * Muestra un mensaje de éxito temporal.
 * @param {string} message - Mensaje a mostrar
 */
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10001;
        box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 3000);
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
 * Muestra la sección de contacto con animación.
 */
function showContactSection() {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
        contactSection.style.display = 'block';
        
        // Scroll suave hacia la sección de contacto
        setTimeout(() => {
            contactSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 300);
    }
}

/**
 * Maneja el clic del botón de contacto.
 * Abre modal o redirige según la preferencia.
 */
function handleContactClick() {
    const phoneNumber = "+000000000000"; // Cambiar por el número real
    const message = encodeURIComponent("Hola! Me interesa obtener más información sobre energías renovables después de hacer la simulación en su página web.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

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
