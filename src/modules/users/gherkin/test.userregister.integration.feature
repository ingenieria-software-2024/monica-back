Feature: Registro de usuarios

    Scenario: El usuario se registra con éxito
        Given el usuario con los siguientes detalles
            | username | password  | email |
            | john_doe | password1 | johndoe@example.com |
        When el usuario se registra
        Then la contraseña debe estar hasheada y almacenada en la base de datos
        And el objeto de usuario debe ser retornado

    Scenario: El usuario se loguea con éxito
        Given el usuario con los siguientes detalles
            | username | password  |
            | john_doe | password1 |
        When el usuario envia la solicitud de inicio de sesión
        Then una token JWT válida debe ser retornada
        And la token debe estar firmada digitalmente
        And la token debe tener una fecha de expiración