#!/bin/sh

echo "Script de inicio ejecutado"

echo "---------------"
echo "Esperando a PostgreSQL..."
echo ":D"
echo "---------------"

# Esperar a que PostgreSQL esté disponible
while ! nc -z db 5432; do
  echo "PostgreSQL no disponible, reintentando en 0.3 segundos..."
  sleep 0.3
done

# Verificar que PostgreSQL esté listo para aceptar conexiones
echo "---------------"
echo "Verificando que PostgreSQL esté listo para aceptar conexiones..."
until pg_isready -h db -p 5432 -U postgres; do
  echo "PostgreSQL no está listo, reintentando en 0.3 segundos..."
  sleep 0.3
done
echo "PostgreSQL está listo para aceptar conexiones en el puerto 5432"
echo "---------------"

echo "═══•◉•═════

▂▄▄▓▄▄▂

◢◤ █▀▀████▄▄▄▄◢◤

█▄ █ █▄ ███▀▀▀▀▀▀▀╬

◥█████◤

═╩══╩═

╬═╬

╬═╬

╬═╬ 

╬═╬ PostgreSQL iniciado

╬═╬ ●/

╬═╬/▌

╬═╬/ \ "

# Ejecutar el script Python en segundo plano
echo "---------------"
echo "Ejecutando main.py con los argumentos 'run -h 0.0.0.0'"
echo "---------------"
python main.py &

# Mensaje final para indicar que el script ha terminado
echo "---------------"
echo "Script de inicio completado"
echo ":)"
echo "---------------"
echo "MAY THE FORCE BE WITH YOU"

# Mantener el contenedor en ejecución
wait
