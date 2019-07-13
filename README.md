# The Usual

### Share your lunch order

### Test User Login
* email: elli@mailinator.com
* password: password

### Technologies

* Node.js
* Express.js
* Mongoose
* Body-parser
* MD5
* Cookie-parser
* Twilio


### Third Party APIs Used

* Twilio


### Synopsis

Our users are people that like to share what they eat. It makes ordering for friends based on past preferences easy. It keeps track of cuisines favorited by people and allows a different social experience than Yelp by being more specific highlighting individual dishes.

We spent about an hour or two brainstorming the idea and eventually came to it as we were taking a lunch break and couldn't figure out what to get the other team members.


### Model Structure

We have two models consisting of a user model and order. Within user we set up an email, password, name and order which we set up to work with our orders model. Our orders model consists of restaurant name, details, cuisine, img_url, favorite (cuisine) and when it was last created and updated. We are working primarily in the MEN stack.


### User Story

Upon coming to the landing site, the user is asked to sign up or sign in. The user can sign up with their email and once they are signed up they will be taken to their page. They are able to create new meals that they have had and will be asked to put in information such as restaurant name, meal, and img url. This can be sent to someone using email or text. This makes sharing someones order easy.


### Wireframes

![the-usual-1](/images/the-usual-1.jpg)
![the-usual-2](/images/the-usual-2.jpg)
![the-usual-3](/images/the-usual-3.jpg)
