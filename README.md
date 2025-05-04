# -G2-Proyecto1_201611269



# Paso uno
Se debe agregar el contenido del dataset de elementos para crear el entrenamiento, mientras más datos mejor.

Instalar los apartados de tensorflow

```bash
npm i
```

Una vez subidos se envia el comando, en la carpeta training / numeros

```bash
nodejs train.js
```

Este generará unos archivos .bin y .json que será utilizados por el backend, se guardaran en la carpeta backend/modelos


# Paso dos

cuando se generan los modelos podemos iniciar el backend, el package.json ya tiene la configuracion necesaria, en la carpeta backend/ por lo que solo debemos correr el comando

```bash
node index.js
```

Luego ejecutar el endpoint ya sea con postman o cURL

```bash
curl -X POST http://localhost:3000/predict-number \
  -F "image=@ruta/a/una_imagen.png"
```
