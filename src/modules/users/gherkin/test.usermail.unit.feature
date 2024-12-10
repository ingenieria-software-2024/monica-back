Feature: Validación de Email de Usuario
Debe tener formato de email válido según el estándar rfc 5322.
Realizada con PARTICIÓN EQUIVALENTE.
    Scenario: Correo electrónnico no acorde al estándar rfc 5322
        Given el correo electrónico del usuario es "guidoserniotti.com"
        When el usuario intenta registrarse
        Then el sistema debe rechazar la solicitud y mostrar el mensaje de error "El email no es válido"

    Scenario: Correo electrónico acorde al estándar rfc 5322
        Given el correo electrónico del usuario es "guidoserniotti@gmail.com"
        When el usuario intenta registrarse
        Then el sistema debe aceptar la solicitud y registrar el usuario

