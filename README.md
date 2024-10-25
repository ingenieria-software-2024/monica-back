# Monica
Modulo backend monolito para dar soporte a la aplicacion de **MegaStore**.

## Prefacio
Este repositorio aloja el respectivo codigo logico de negocio de **MegaStore**. Este proyecto de software es la culminacion de la catedra de **Ingenieria de Software** en la **UTN FRVM**.

## Instalacion
1. Clonar el repositorio
```sh
$ git clone https://github.com/ingenieria-software-2024/monica-back.git
$ cd monica-back
$ pwd
/home/puntero/monica-back
```

2. Instalar las dependencias del proyecto. 
```sh
$ yarn install
```
*Nota: Si no se tiene `yarn`, instalarlo con el comando `npm i --global yarn` y reiniciar la terminal para utilizar el package manager.*
*Nota II: En caso de que `yarn` siga apareciendo como desconocido, instancielo usando `npx yarn install`*

3. Clonar archivo de ejemplo `.env.example` como `.env` para configurar las variables de entorno de la aplicacion al entorno actual de su sistema (i.e: link a base de datos local, etc)
4. Ejecutar la aplicacion.
```sh
# Modo Desarrollo
$ yarn start:dev
# Modo Normal
$ yarn start
```

## Consideraciones
### Prisma
Al tener el proyecto en mano, cada vez se realizan modificaciones sobre `prisma.schema` o apenas se carga el proyecto por primera vez, ejecutar el comando `yarn prisma generate` para obtener los typings de las entidades.

Para crear la base de datos en el servidor de base de datos por primera vez, ejecutar el comando `yarn prisma migrate reset`.