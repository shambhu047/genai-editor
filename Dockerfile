FROM node:18 as frontend

WORKDIR /ui

COPY ui ./
RUN npm install
RUN npm run build

FROM python:3.9
WORKDIR /app
COPY . .
COPY --from=frontend /ui/dist /app/static/ui
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
