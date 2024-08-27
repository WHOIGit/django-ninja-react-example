FROM python:3.12

ENV PYTHONUNBUFFERED=1

RUN mkdir /app
WORKDIR /app

COPY requirements.txt /app/

RUN pip install -r requirements.txt

RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install nodejs

COPY .. .

WORKDIR /app/frontend/

RUN npm install
RUN npm run build

WORKDIR /app/
