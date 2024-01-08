# Foodies - Microservices Food Delivery Application

Foodies is a cutting-edge food delivery application built on a Microservices architecture using Spring Boot, Spring Security, Kafka, MySQL, and Google Maps API. This project offers a scalable, secure, and efficient platform for food enthusiasts, incorporating Mailtrap and Postman for email and API testing.

## Features

- **Microservices Architecture:**
  - Modular design for scalability and maintainability.
  - Independent microservices for distinct functionalities.

- **Spring Boot:**
  - Rapid development and deployment.
  - Lightweight, stand-alone, and production-grade applications.

- **Spring Security:**
  - Authentication and authorization for secure user interactions.

- **Kafka Integration:**
  - Distributed event streaming for real-time communication.
  - Efficient order handling, updates, and notifications.

- **MySQL Database:**
  - Reliable storage for user profiles, order histories, and restaurant details.

- **Google Maps API:**
  - Seamless location-based services for enhanced user experience.

- **Mailtrap for Email Testing:**
  - Testing email functionalities with ease and reliability.

- **Postman for API Testing:**
  - Comprehensive API testing for microservices robustness.

## Getting Started

Follow these steps to set up and run the Foodies application locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/jyotiram7402/Foodies--Food_Delivery_Application.git
   cd Foodies
2. **Set up the necessary configurations:**

Configure application properties,
including database connection details,
Kafka settings, and API keys.
Update Spring Security configurations as needed.

3.**Build and run microservices:**

4.**Access the application:**

Open a web browser or use Postman to hit the api
  for the module (food app) use server.port=5001
  for the module (driver-service) use server.port=4000
  for the module (merchant-service) use server.port=6000
  for the module(notification-service) use server.port=7001

  for Mail testing use website  **https://mailtrap.io/signin** use the username and password 
  provited over there on website;





  for more information refer the following doc

  **Foodies--Food Delivery Application:**
 It’s an app for delivering food like Zomato, Swiggy etc.

 
 -**Step:1**
 Wewill try to understand the basic flow of food delivery.
 1) There should be a panel(API) from where the driver will be logging in.
 2) There should be a panel(API) from where the User will be logging in.
 3) There should be a panel(API) from where the merchant/Restaurant will be logging in.
 First of all, we can have multiple tables for all of these. If we have multiple applications that
 there should be different tables/ or we can keep the same table for all types of users. Both
 approaches are correct depending upon the architecture of the project.
 How are we gonna Proceed for now?
 Wewill be creating 1 service for all users (MODULE : UserService). That means one API will
 do the login for all. And we will be having security in it.
 Once the user is onboarded will be sending the information to the kafka and consumers will be
 receiving this information.
 Who all can be the consumers?
 Notification Service (MODULE:NotificationService): Which will be sending notifications, SMS
 or MAILs. We will be creating this.
 Karma Service : which will check if the user is a robot, or fraud etc.

-**Step:2**
 Try to understand the home pages of all (user ,driver,merchant)
 What User/Driver/Merchant will see?
 User will have a list of restaurants near by him.(API- for user home page which will load
 restaurants near him.) Now the user wants complete information so not everything will not be
 done by UserService. There should be MerchantService which will be keeping all information
 related to restaurants.
 Driver will have one API when he wants to go online and what will be the area he will cover and
 for how many hours. All tasks will be handled by DriverService.
 Merchant will have an API to upload the restaurant details like the location of the restaurants
 and name and classification, Opening timings etc.
 Then he should also get an api to upload dishes and their costs.
 
 -**Step:3**
 What will be the order flow?
 Users will come and order something as cash on delivery because we are not going in the
 payments flow.(OrderService) module will be handling the order and we need to see how this
 order will be assigned to the driver. And publish some data on kafka. Merchant on which the
 order has been placed will listen on MerchantService and start preparing. DriverService will
 listen to it and will start looking for the available drivers. And all the information related to the
 order will be present in the database of OrderService.
 
 -**Step:4**
 How will the order flow from order picked up to Order delivered?
 Once the order has been assigned to some driver. The driver will first accept the order, go to the
 restaurant and pick up the order, move to the user location and this information will get
 published in kafka step by step and whoever wants to listen to this can listen. OrderService in
 our case will be listening to all the details and updating to the user. Once the driver reaches the
 user, He will mark the order as completed and some money which has already been decided
 will be shown up in the My-Earning Section. Later on, This can be settled among the
 application and driver


**for any queries please contact**
Github:https://github.com/jyotiram7402
Mail:jyotiramkamble7402@gmail.com

  
 


    
