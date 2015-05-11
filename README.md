curl -v -X GET "http://localhost:3000/order"

curl -v -H "Content-Type: application/json" -H "Accept: application/json" -X POST -d '{"make":"acme","customer_id":"12345","model":"anvil","package":"super"}' "http://localhost:3000/order"
curl -v -H "Content-Type: application/json" -H "Accept: application/json" -X POST -d '{"make":"rainer","customer_id":"12345","model":"pugetsound","package":"ltd"}' "http://localhost:3000/order"