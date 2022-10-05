import json
import pandas as pd
#
# data = pd.read_csv("경기도권.csv")
#
# print(data.shape)
# print(data.columns)
#
# for idx in range(5):
#     print(idx*(int(36566//5)),(idx+1)*(int(36566//5)))
#     result = data.iloc[idx*(int(36566//5)):(idx+1)*(int(36566//5)),:]
#     print(result.shape, result.iloc[0,:]["상호명"])
#     result.to_csv("splitData{}.csv".format(idx))
#
# for idx in range(5):
#     data = pd.read_csv("splitData{}.csv".format(idx))
#     print(data.shape, data.iloc[0,:]["상호명"])

text = pd.read_csv("text.csv")
print(text.columns, text.shape)