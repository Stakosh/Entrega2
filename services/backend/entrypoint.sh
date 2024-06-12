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

# Ejecutar el script Python
echo "---------------"
echo "Ejecutando main.py con los argumentos 'run -h 0.0.0.0'"
echo "---------------"
python main.py

# Mensaje final para indicar que el script ha terminado
echo "---------------"
echo "Script de inicio completado"
echo ":)"
echo "---------------"
echo " MAY THE FORCE BE WITH YOU"