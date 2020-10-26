                                      NodeJS Assignment
•	Using Schema in Mongo DB free cloud service MongoDB Atlas
•	In .env file DB_URL and secret are stored
•	PassportJS and JWT strategy for authentication and authorization
•	Run npm start-dev to start the server
•	Npm test to run test cases
Assumption
•	The input box for status is given to have open closed incase any other status enter the validation error will be there
•	The status at entry cannot be closed if user enter closed he will face error
•	While opening list if the user is manager he/she will see the create opening button and update button for the opening they created
•	For login user need registered username and password.
•	In some cases I have shown flash messages with redirection and in some error messages will be there with back button you can go back to previous screen.
•	Manager cannot apply for an opening

username=parusha pwd=parusha is manager
username=vanshika pwd=vanshika is employee
Database
Models: user, opening and role 
User can be manager, or an employee Role get initialize when we initdatabase 
 
User have one to many relationships with role this scope was not in our assignment but for future use I considered that the user has an array of roles. Opening have all the parameters defined in assignment and have field employeesApplied that have one many relations with user (Employee) means an many employees can apply for a particular opening createdBy field one to one relation.
Database level validations applied* 
User Database have methods like validate password, generateJWTToken methods

API’s
http://localhost:3000/ redirect to express server
http://localhost:3000/login redirect to login page 
http://localhost:3000/register redirect to register page after validating the user register it at api auth/api/signUp
the encrypted password is stored in database
After registering new user, we will be redirected to login page with flash message of being registered
Login Page If no data or wrong data entered flash message shown respectively
If correct data entered session stored and jwt token stored as a cookies for authorization
Other routes are
http://localhost:3000/api/auth/listOfOpening for opening list only Authenticated Employee
http://localhost:3000/api/auth/detailOpening/openingId  for detail of particular opening only Authenticated Employee
http://localhost:3000/api/auth/update/openingId  for updating particular opening only authorized manager
http://localhost:3000/api/auth/createOpening only authorized manager
http://localhost:3000/api/auth/apply/openingId only Authenticated Employee


