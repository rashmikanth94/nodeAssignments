# To run news application with docker


docker pull rashmikanth/customerapplication   
docker pull rashmikanth/adminapplication   
docker pull rashmikanth/newsapp-nginx  

# To start the app

cd CertificationProject/media-nginx 
docker-compose up

# Admin App

http://localhost:9000

Perform Various Actions by following the below steps
1. Register as Admin
2. Login to the Application
3. Add news 
4. Edit News
5. Delate News


# Customer application

http://localhost:4000

1. check latest news by using the scroll buttons.
2. view various sports news in sports tab
3. view about newsApp in aboutUs tab
4. submit any queries in contactUs tab


# to stop the application

docker-compose down




