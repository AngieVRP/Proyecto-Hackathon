# 📋 Documentación del Simulador de Costos Energéticos

## 🎯 Descripción del Proyecto

El **Simulador de Costos Energéticos para el Caribe Colombiano** es una herramienta web educativa diseñada para ayudar a los usuarios a calcular cuánto podrían ahorrar en su factura de energía eléctrica si migran a energías renovables. La aplicación está enfocada en hogares vulnerables de la región Caribe y utiliza valores predeterminados basados en datos reales de cinco municipios principales.

## 🌟 Objetivo Principal

Reducir las tarifas de energía y concientizar a la población sobre los beneficios de las energías renovables, proporcionando una herramienta simple y visual que permita:

- Simular ahorros económicos potenciales
- Educar sobre energías limpias
- Promover la adopción de tecnologías renovables
- Calcular el impacto ambiental positivo

## 🏗️ Estructura del Proyecto

```
Proyecto-Hackathon/
├── README.md                 # Información general del proyecto
├── css/
│   └── style.css            # Estilos y diseño visual
├── html/
│   ├── index.html           # Página principal
│   └── main.html            # Página de la calculadora
├── js/
│   └── calculator.js        # Lógica de cálculos y funcionalidad
└── DOCUMENTACION.md         # Este archivo
```

## 🚀 Funcionalidades Principales

### 1. **Selección de Municipio**
- Lista desplegable con 5 municipios del Caribe colombiano
- Cada municipio tiene datos específicos:
  - Consumo promedio (kWh)
  - Costo promedio (pesos)
  - Tarifa por kWh
  - Porcentaje de ahorro estimado

### 2. **Input de Datos del Usuario**
- **Consumo actual**: Campo para ingresar kWh mensuales
- **Costo actual**: Campo para ingresar el valor de la factura
- **Lógica de exclusión mutua**: Solo se puede llenar uno de los dos campos

### 3. **Cálculos Automáticos**
- Si se ingresa consumo → calcula y muestra costo estimado
- Si se ingresa costo → calcula y muestra consumo estimado
- Auto-completado con datos promedio del municipio seleccionado

### 4. **Resultados de Simulación**
- **Situación Actual**: Costo mensual actual
- **Con Energías Renovables**: Costo mensual estimado
- **Ahorro Mensual**: Diferencia económica y porcentaje
- **Tu Consumo**: kWh mensuales utilizados
- **kWh Ahorrados**: Energía que se dejaría de consumir de la red
- **Proyección Anual**: Ahorro económico anualizado

### 5. **Información Educativa**
- Datos del municipio seleccionado
- Mensajes aleatorios sobre beneficios de energías renovables
- Información sobre impacto ambiental

## 💻 Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño responsivo y efectos visuales
- **JavaScript Vanilla**: Lógica de negocio y manipulación del DOM
- **Sin frameworks**: Aplicación liviana y de carga rápida

## 📊 Dataset de Municipios

La aplicación incluye datos de 5 municipios del Caribe colombiano:

| Municipio    | Consumo Promedio | Costo Promedio | Ahorro Estimado | Tarifa kWh |
|--------------|------------------|----------------|-----------------|------------|
| Riohacha     | 180 kWh         | $90,000        | 25%             | $500       |
| Barrancas    | 150 kWh         | $75,000        | 30%             | $500       |
| Valledupar   | 220 kWh         | $110,000       | 20%             | $500       |
| Santa Marta  | 170 kWh         | $85,000        | 22%             | $500       |
| Soledad      | 200 kWh         | $100,000       | 28%             | $500       |

## 🔧 Lógica de Funcionamiento

### Flujo Principal:
1. **Selección de municipio** → Carga datos específicos
2. **Input de usuario** → Consumo O costo (mutuamente excluyentes)
3. **Cálculo automático** → Estima el valor faltante
4. **Procesamiento** → Aplica fórmulas de ahorro
5. **Resultados** → Muestra simulación completa

### Fórmulas de Cálculo:

```javascript
// Cálculo de consumo a partir del costo
consumoEstimado = costoActual / tarifaKwh

// Cálculo de costo a partir del consumo
costoEstimado = consumoActual * tarifaKwh

// Cálculo de ahorro
ahorroMensual = (costoActual * porcentajeAhorro) / 100
costoConRenovables = costoActual - ahorroMensual

// Proyección anual
ahorroAnual = ahorroMensual * 12

// Impacto ambiental (estimación)
kwhAhorrados = (consumoFinal * porcentajeAhorro) / 100
co2Reducido = kwhAhorrados * 0.5 * 12 // kg CO₂ por año
```

## 🎨 Características de UX/UI

### Diseño Visual:
- **Colores**: Paleta verde (sostenibilidad) y azul (confianza)
- **Iconos**: Emojis para mayor accesibilidad y comprensión
- **Tarjetas**: Resultados organizados en cards visualmente atractivas
- **Responsivo**: Adaptable a diferentes tamaños de pantalla

### Interactividad:
- **Efectos hover**: Animaciones en tarjetas de resultados
- **Transiciones suaves**: Scroll automático a resultados
- **Feedback visual**: Estados deshabilitados con transparencia
- **Validación en tiempo real**: Prevención de valores negativos

### Accesibilidad:
- **Labels descriptivos**: Cada campo tiene instrucciones claras
- **Textos de ayuda**: Información contextual para usuarios
- **Mensajes de error**: Retroalimentación clara sobre problemas
- **Navegación por teclado**: Formulario accesible

## 📱 Experiencia de Usuario

### Flujo Típico:
1. **Llegada**: Usuario ve la página principal con información clara
2. **Selección**: Elige su municipio de la lista
3. **Input**: Ingresa su consumo mensual O el costo de su factura
4. **Visualización**: Ve automáticamente el campo contrario calculado
5. **Cálculo**: Presiona "Calcular Ahorro"
6. **Resultados**: Obtiene simulación completa con proyecciones
7. **Educación**: Lee mensaje motivacional sobre energías renovables

### Prevención de Errores:
- Solo un campo de input activo a la vez
- Validación de municipio obligatorio
- Valores mínimos en campos numéricos
- Limpieza automática de campos deshabilitados

## 🔄 Funciones Principales del Código

### `getFormData()`
Extrae y procesa los datos del formulario, calculando valores estimados cuando es necesario.

### `calculateSavings()`
Aplica las fórmulas de ahorro basadas en los datos del municipio y la entrada del usuario.

### `displayResults()`
Actualiza la interfaz con los resultados calculados y formatea los valores monetarios.

### `showBenefitMessage()`
Muestra mensajes educativos aleatorios sobre energías renovables.

### Eventos de Input
Manejan la lógica de exclusión mutua entre campos de consumo y costo.

## 🌱 Impacto Social

### Beneficios Esperados:
- **Educación**: Aumentar conocimiento sobre energías renovables
- **Concientización**: Mostrar beneficios económicos tangibles
- **Accesibilidad**: Herramienta simple para hogares vulnerables
- **Motivación**: Incentivar adopción de tecnologías limpias

### Escalabilidad:
- Fácil adición de nuevos municipios
- Posibilidad de integrar datos reales de APIs
- Extensión a otras regiones de Colombia
- Integración con programas gubernamentales

## 📈 Posibles Mejoras Futuras

1. **Integración con APIs** de datos energéticos reales
2. **Geolocalización** automática del usuario
3. **Calculadora de inversión** para paneles solares
4. **Comparador de proveedores** de energía renovable
5. **Generación de reportes** en PDF
6. **Sistema de alertas** de programas de subsidios
7. **Versión móvil** nativa
8. **Integración con redes sociales** para compartir resultados

## 📞 Información de Contacto

Este proyecto fue desarrollado como parte de un hackathon enfocado en soluciones sostenibles para el Caribe colombiano.

---

*💚 Contribuyendo a un Caribe más sostenible y con menores costos energéticos*
