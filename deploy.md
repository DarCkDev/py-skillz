# Guía de Despliegue Local

Esta guía te ayudará a desplegar el proyecto en tu máquina local utilizando Docker y Docker Compose.

---

## Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas en tu sistema:

* [Git](https://git-scm.com/downloads)
* [Docker](https://www.docker.com/products/docker-desktop)
* [Docker Compose](https://docs.docker.com/compose/install/)
  (En versiones modernas de Docker ya viene incluido)

Puedes verificar que estén instalados con estos comandos:

```bash
git --version
docker --version
docker compose version
```

---

## Pasos para el Despliegue

### 1. Clonar el repositorio

Abre una terminal y ejecuta:

```bash
git clone https://github.com/DarCkDev/py-skillz.git
cd py-skillz
```

---

### 2. Construir y levantar los servicios

Dentro de la raíz del proyecto (donde se encuentra el archivo `docker-compose.yml`), ejecuta:

```bash
docker compose up --build
```

Esto realizará lo siguiente:

* Construirá las imágenes del **frontend**, **backend** y **base de datos**.
* Levantará los contenedores necesarios.
* Conectará todos los servicios entre sí.

> ⚠️ La primera vez puede tardar unos minutos dependiendo de tu conexión y sistema.

---

### 3. Acceder a la aplicación

Una vez que el despliegue esté completo, abre tu navegador en:

```
http://localhost:3000
```

Este será el punto de entrada del **frontend**. Desde ahí podrás interactuar con el sistema.

---

## Detener los servicios

Cuando quieras detener la aplicación, presiona `Ctrl + C` en la terminal o bien en otra terminal:

```bash
docker compose down
```

Esto apagará los contenedores y liberará los recursos.

---

## Limpiar imágenes (opcional)

Si deseas limpiar las imágenes y contenedores completamente:

```bash
docker compose down --volumes --rmi all
```

---

## Troubleshooting

* Si tienes errores con puertos ocupados, asegúrate de que no haya otros servicios usando el `3000`, `3003` o `5432`.
* Revisa los logs con:

```bash
docker compose logs -f
```

---

## Confirmación del despliegue

Cuando la aplicación esté corriendo correctamente:

* El **frontend** responderá en `http://localhost:3000`.
* El **backend** estará en `http://localhost:3003`.
* La base de datos PostgreSQL estará disponible internamente para los contenedores en `postgres:5432`.

---
