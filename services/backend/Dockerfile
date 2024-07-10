
# Use the official Python image as the base image
FROM python:3.9-slim-buster



# Set the working directory in the container
WORKDIR /app


# Copy the requirements file into the container
COPY requirements.txt .

# install system dependencies
RUN apt-get update \
    && apt-get -y install gcc g++ python3-dev netcat postgresql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# add and install requirements
COPY ./requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

#ENV UPLOAD_FOLDER=/app/uploads

# Crear la carpeta de uploads
#RUN mkdir -p $UPLOAD_FOLDER && chmod 777 $UPLOAD_FOLDER

# add entrypoint.sh
COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# add app
COPY . .


