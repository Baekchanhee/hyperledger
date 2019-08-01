#chaincode insall
docker exec cli peer chaincode install -n mycc -v 1.0 -p github.com/fabcar

#chaincode instatiate
docker exec cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n mycc -v 1.0 -c '{"Args":[]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
sleep 5
#chaincode query a
#docker exec cli peer chaincode query -n sacc -C mychannel -c '{"Args":["get","a"]}'
#chaincode invoke b
#docker exec cli peer chaincode invoke -n sacc -C mychannel -c '{"Args":["set","b","200"]}'
#sleep 5
#chaincode query b
#docker exec cli peer chaincode query -n sacc -C mychannel -c '{"Args":["get","b"]}'

echo '-------------------------------------END-------------------------------------'
