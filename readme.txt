Create a simple Angular app
Prerequisites:
1. Install node.js
2. Install Angular CLI 
  npm install -g @angular/cli  

Backend
1. Create a backend folder
2. Initialize a node.js project:
  npm init -y
3. Install dependencies:
  npm install express body-parser cors
4. Create the backend script (server.js)
5. Run server:
  node server.js

Frontend
1. ng new frontend --standalone
2. Modify main.ts to include FormsModule and HttpClient
3. Create the service that gets the data (data.service.ts)
  ng generate service data
4. Update app.component.ts with the concrete code
  4.1. Make app component standalone if it isn't and import FormsModule !
5. Run app (ng serve --host 0.0.0.0)
