# Django Ninja REST API with React frontend

Example of using Django Ninja with React, including the use of both bearer token and session authentication.

## Installation

#### Requirements

* Python
* Node.js

### Environment configuration

Create a virtual environment and install the dependencies from `requirements.txt`.

e.g.,

```
python3 -m venv .venv
source .venv/bin/activate
```

or use your IDE.

### Javascript

Now build the frontend Javascript

```
cd ./ninjareact/frontend
npm install
npm run build
```

### Django initialization

Now set up the service

```
cd ..
python manage.py migrate
python manage.py collectstatic --noinput
python createsuperuser
```

## Running the service

Now run the server

```
python manage.py runserver
```

and hit

http://localhost:8000

for API docs, hit

http://localhost:8000/api/docs
