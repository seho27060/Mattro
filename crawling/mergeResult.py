import json
# #
# with open('result0.json', 'r', encoding='utf-8') as f:
#     result = json.load(f)
# print(len(result))
# result = []
# for idx in range(0,20):
#     try:
#         # with open('result'+str(idx)+'.json', 'r', encoding='utf-8') as f:
#         #     reviewData = json.load(f)["reviewData"]
#         with open('resultMerge'+str(idx)+'.json', 'r', encoding='utf-8') as f:
#             reviewData = json.load(f)
#         print(len(reviewData))
#         result += reviewData
#     except:
#         print("파일없음")
#         # break
# print(len(result))
# # # 개인 크롤링 결과 통합
# # with open('resultMerge.json', 'w', encoding='utf-8') as f:
# #     json.dump(result, f, indent=4, ensure_ascii=False)
# # #
# # with open('resultMerge.json', 'r', encoding='utf-8') as f:
# #     result = json.load(f)
#
# ## 개인 통합 결과를 통합
# with open('crawling.json', 'w', encoding='utf-8') as f:
#     json.dump(result, f, indent=4, ensure_ascii=False)
# #
with open('crawling.json', 'r', encoding='utf-8') as f:
    result = json.load(f)
print(len(result))