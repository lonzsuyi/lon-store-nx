#!/bin/sh
# Wait for a service to be available

HOST=$1
PORT=$2
TIMEOUT=${3:-30}

echo "Waiting for $HOST:$PORT to be available..."

for i in $(seq 1 $TIMEOUT); do
  nc -z $HOST $PORT && echo "Service is up!" && exit 0
  echo "Waiting..."
  sleep 2
done

echo "Timeout reached! $HOST:$PORT is still unavailable."
exit 1
