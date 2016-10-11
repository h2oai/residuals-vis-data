#############################################
# training data

# read in the 3gb of training data
train = read.csv("input/train.csv")
library(data.table)
setDT(train)

#############################################
# client names

# read in client names metadata
client_names = read.csv("input/cliente_tabla.csv")
library(data.table)
setDT(client_names)

# keep only first instance of each Cliente_ID
reduced_client_names = client_names[!duplicated(client_names$Cliente_ID), ]

# verify that this reduction step worked
# client_names
# length
length(client_names$Cliente_ID)
# unique Cliente_IDs
uniqueN(client_names$Cliente_ID)

# reduced_client_names
# length
length(reduced_client_names$Cliente_ID)
# unique Cliente_IDs
uniqueN(reduced_client_names$Cliente_ID)

# join the reduced client names to the training data 
# left outer join training data to client names
train_clients <- merge(train,reduced_client_names, all.x=TRUE, by="Cliente_ID")

#############################################
# product names

# read in client names metadata
product_names = read.csv("input/producto_tabla.csv")
library(data.table)
setDT(product_names)

# join the reduced product names to the train-clients data 
# left outer join
train_clients_products <- merge(train_clients,product_names, all.x=TRUE, by="Producto_ID")

#############################################
# town (and state) names

# read in town names metadata
town_names = read.csv("input/town_state.csv")
library(data.table)
setDT(town_names)

# join the reduced product names to the train-clients data 
# left outer join
train_clients_products_towns <- merge(train_clients_products,town_names, all.x=TRUE, by="Agencia_ID")

#############################################

# write the combined data.table to csv
write.csv(train_clients_products_towns, file = "input/train-clients-products-towns.csv",row.names=FALSE)
