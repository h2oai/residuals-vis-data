library(data.table)
DT <- fread('/home/ops/visualizations/residuals/data/grupo-bimbo-inventory-demand/train-clients-products-towns.csv', header = T, sep = ',')
train <- DT[Semana %in% c(3, 4, 5, 6, 7, 8)]
validation <- DT[Semana %in% c(9)]
fwrite(train, 'train.csv')
fwrite(validation, 'validation.csv')
