````
craete a .env file in backend
it shd look like this 

DATABASE_URL=postgresql://postgres:your password@localhost:5432/databasename

SECRET_KEY=your_super_secret_key_123456789

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

create a venv
install req
run using this command : uvicorn app.main:app --reload   

Frontend

npm install
npm run dev


git checkout dev
git pull origin dev
git checkout -b feature-ur_name

git add .
git commit -m "commit msg"
git push -u origin feature-ur_name
```
