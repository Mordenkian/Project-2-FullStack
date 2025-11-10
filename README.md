How to run website for testing:
cd into the Weather App folder in the client side files. Running npm run dev should do the trick.
Reminder that for server functionality you need to cd into the server folder and run node server.js to turn on express. Recommended to open separate terminal to perform this action so that you can have two simultaneous functions. 

Doing these two things should suffice that the testing environment is ready for rendering. 

If the environment is still not working due to something missing try making sure that npm files are installed correctly. 
The ones being used as far as I am aware:
React
Express
Typescript
mongoose
mongodb
cors

React dom and react router dom are technically being used in the main.jsx file, but it wasn't part of the testing environment so its technically never used. If implementing multiple pages these will be necessary. 

Note for website coding: Most of the actual work should be done either in the server.js for backend work or in the App.jsx file for frontend work. Additional pages should be put in the src folder where the App.jsx file is located in. Same with css and other design customization. 
