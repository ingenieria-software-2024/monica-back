Feature: Validación de contraseña de usuario
Se verifica que la contraseña cumpla con los requisitos mínimos de seguridad determinados por "class-validator".
Realizada con PARTICIÓN EQUIVALENTE.
    
    Scenario: La contraseña es demasiado corta
        Given la contraseña del usuario es "12345"
        When el usuario intenta registrarse
        Then el sistema debe rechazar la solicitud y mostrar el mensaje de error "La contraseña debe tener al menos 8 caracteres"

    Scenario: La contraseña no contiene números
        Given la contraseña del usuario es "contraseña"
        When el usuario intenta registrarse
        Then el sistema debe rechazar la solicitud y mostrar el mensaje de error "La contraseña debe contener al menos un número"

    Scenario: La contraseña no contiene letras mayúsculas
        Given la contraseña del usuario es "contraseña123"
        When el usuario intenta registrarse
        Then el sistema debe rechazar la solicitud y mostrar el mensaje de error "La contraseña debe contener al menos una letra mayúscula"

    Scenario: La contraseña no contiene letras minúsculas
        Given la contraseña del usuario es "CONTRASEÑA123"
        When el usuario intenta registrarse
        Then el sistema debe rechazar la solicitud y mostrar el mensaje de error "La contraseña debe contener al menos una letra minúscula"

    Scenario: La contraseña no contiene caracteres especiales
        Given la contraseña del usuario es "Contraseña123"
        When el usuario intenta registrarse
        Then el sistema debe rechazar la solicitud y mostrar el mensaje de error "La contraseña debe contener al menos un caracter especial"

    Scenario: La contraseña está vacía
        Given la contraseña del usuario es ""
        When el usuario intenta registrarse
        Then el sistema debe rechazar la solicitud y mostrar el mensaje de error "La contraseña no puede estar vacía"

    Scenario: La contraseña cumple con los requisitos mínimos de seguridad
        Given la contraseña del usuario es "Contraseña123!"
        When el usuario intenta registrarse
        Then el sistema debe aceptar la solicitud y registrar el usuario
