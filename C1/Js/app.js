// Constantes para IDs de elementos (centraliza cambios)
const FORM_ID = "registroForm";
const NOMBRE_ID = "nombre";
const EMAIL_ID = "email";
const PASSWORD_ID = "password";
const CONFIRM_PASSWORD_ID = "confirmPassword";
const MENSAJE_ID = "mensaje";
const BACKGROUND_IMAGE_ID = "backgroundImage";
const SET_BACKGROUND_BUTTON_ID = "setBackground";

// Función de validación extensible (ahora incluye validaciones de formato y seguridad)
function validarCamposRequeridos(campos) {
    for (const campo of campos) {
        const elemento = document.getElementById(campo.id);
        if (!elemento) {
            return { mensaje: `Error interno: Campo ${campo.nombre} no encontrado.`, elemento: null };
        }
        elemento.removeAttribute('aria-invalid');
        const valor = elemento.value.trim();
        if (valor === "") {
            elemento.setAttribute('aria-invalid', 'true');
            return { mensaje: `El campo ${campo.nombre} es obligatorio.`, elemento };
        }
        // Validaciones específicas de formato y seguridad
        if (campo.validar && !campo.validar(valor)) {
            elemento.setAttribute('aria-invalid', 'true');
            return { mensaje: campo.mensajeError, elemento };
        }
    }
    return null; // Sin errores
}

// Función para validar email (más robusta)
function esEmailValido(email) {
    // Regex más estricto para emails
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email) && email.length <= 254; // Límite de longitud para seguridad
}

// Función para validar nombre (solo letras, espacios, apóstrofes; sin números o caracteres especiales peligrosos)
function esNombreValido(nombre) {
    const regex = /^[a-zA-ZÀ-ÿ\s'-]+$/; // Permite letras, espacios, apóstrofes, tildes
    return regex.test(nombre) && nombre.length >= 2 && nombre.length <= 50; // Longitud razonable
}

// Función para validar contraseña (fuerte: min 8 chars, mayúscula, minúscula, número, especial)
function esPasswordValido(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password) && password.length <= 128; // Límite para prevenir ataques
}

// Función para validar contraseña (fuerte: min 8 chars, mayúscula, minúscula, número, especial)
function esPasswordValido(confirmPassword) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(confirmPassword) && confirmPassword.length <= 128; // Límite para prevenir ataques
}

// Función para validar URL de imagen (segura y correcta)
function esUrlImagenValida(url) {
    try {
        const parsedUrl = new URL(url);
        // Solo permitir HTTPS para mayor seguridad
        if (parsedUrl.protocol !== 'https:') {
            return false;
        }
        // Verificar que termine en extensión de imagen común (básico)
        const extensionesValidas = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        return extensionesValidas.some(ext => parsedUrl.pathname.toLowerCase().endsWith(ext));
    } catch {
        return false;
    }
}

// Función para manejar envío del formulario
function manejarEnvioFormulario(event) {
    event.preventDefault();

    // Campos requeridos (fácil de extender con validaciones de formato y seguridad)
    const camposRequeridos = [
        { 
            id: NOMBRE_ID, 
            nombre: "Nombre", 
            validar: esNombreValido, 
            mensajeError: "El nombre debe contener solo letras, espacios o apóstrofes, y tener entre 2 y 50 caracteres." 
        },
        { 
            id: CONFIRM_PASSWORD_ID,
            nombre: "Confirmar contraseña",
            validar: esPasswordValido,
            mensajeError: "Las contraseñas no coinciden."
        },
        { 
            id: EMAIL_ID, 
            nombre: "Email", 
            validar: esEmailValido, 
            mensajeError: "Por favor, ingresa un email válido (ej. usuario@dominio.com)." 
        },
        { 
            id: PASSWORD_ID, 
            nombre: "Contraseña", 
            validar: esPasswordValido, 
            mensajeError: "La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo especial." 
        }
        // Agrega más si es necesario, ej. { id: APELLIDO_ID, nombre: "Apellido", validar: esNombreValido, mensajeError: "..." }
    ];

    // Validar campos requeridos
    const errorRequerido = validarCamposRequeridos(camposRequeridos);
    if (errorRequerido) {
        mostrarMensaje(errorRequerido.mensaje);
        if (errorRequerido.elemento) {
            errorRequerido.elemento.focus();
        }
        return;
    }

    // Si todo está bien
    mostrarMensaje("Formulario enviado correctamente.");
}

// Función auxiliar para mostrar mensajes
function mostrarMensaje(texto) {
    const mensajeElemento = document.getElementById(MENSAJE_ID);
    if (mensajeElemento) {
        mensajeElemento.textContent = texto;
    }
}

// Función para establecer imagen de fondo (con validación de URL segura y correcta)
function setBackgroundImage() {
    const imageInput = document.getElementById(BACKGROUND_IMAGE_ID);
    if (!imageInput) return;

    const imageUrl = imageInput.value.trim();
    if (imageUrl) {
        if (!esUrlImagenValida(imageUrl)) {
            mostrarMensaje("Por favor, ingresa una URL válida de imagen con HTTPS y extensión .jpg, .png, etc.");
            return;
        }
        document.body.style.backgroundImage = `url(${imageUrl})`;
        document.body.style.backgroundSize = "auto";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        mostrarMensaje("Imagen de fondo establecida correctamente.");
    } else {
        document.body.style.backgroundImage = "none";
        mostrarMensaje("Imagen de fondo removida.");
    }
}

// Inicialización de event listeners (al final para asegurar que el DOM esté cargado)
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById(FORM_ID);
    if (form) {
        form.addEventListener("submit", manejarEnvioFormulario);
    }

    const setBackgroundButton = document.getElementById(SET_BACKGROUND_BUTTON_ID);
    if (setBackgroundButton) {
        setBackgroundButton.addEventListener("click", setBackgroundImage);
    }
});