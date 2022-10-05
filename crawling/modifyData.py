import json
from pprint import pprint

for fileNum in range(6):
    with open('resultMerge'+str(fileNum)+'.json', 'r', encoding='utf-8') as f:
        reviewData = json.load(f)
    print(len(reviewData))
    # keywordReviewDict 가 있는지, keywordReviewList가 있는지 확인...
    # List 면 데이터를 그대로 정해진 형식으로 변환
    # dict면 디폴트 정해진 형식으로 변환.

    for idx in range(len(reviewData)):
        # pprint(reviewData[idx])
        defaultKeywordReviewList = {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": 0,
            "10": 0,
            "11": 0,
            "12": 0,
            "13": 0,
            "14": 0,
            "15": 0
        }
        if "keywordReviewList" in reviewData[idx].keys():
            for key, item in reviewData[idx]["keywordReviewList"].items():
                defaultKeywordReviewList[key] = int(item)
            reviewData[idx]["keywordReviewList"] = defaultKeywordReviewList
            # pprint(reviewData[idx]["keywordReviewList"])
        else:
            del reviewData[idx]["keywordReviewDict"]
            reviewData[idx]["keywordReviewList"] = defaultKeywordReviewList
        print(reviewData[idx].keys())
    print("after {}".format(len(reviewData)))
    with open('modifiedResultMerge'+str(fileNum)+'.json', 'w', encoding='utf-8') as f:
        json.dump(reviewData, f, indent=4, ensure_ascii=False)