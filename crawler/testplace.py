import json
import pandas as pd
import time
from pprint import pprint

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import multiprocessing

import re

import requests
from bs4 import BeautifulSoup
from time import sleep

import sys, os

# if  getattr(sys, 'frozen', False):
#     chromedriver_path = os.path.join(sys._MEIPASS, "C:/chromedriver.exe")
#     driver = webdriver.Chrome(chromedriver_path)
# else:
#     driver = webdriver.Chrome()

def blogCrawler(url):
    response = requests.get(url)
    sleep(0.5)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"}
    content = ""
    if response.status_code == 200:
        try:
            res = requests.get(url, headers=headers)
            res.raise_for_status()  # 문제시 프로그램 종료
            soup = BeautifulSoup(res.text, "html.parser")
            src_url = "https://blog.naver.com/" + soup.iframe["src"]
            response = requests.get(src_url, headers=headers)
            html = response.text
            soup = BeautifulSoup(html, 'html.parser')
            # print("phase 1")
            if soup.find(attrs={'class': "se-main-container"}):
                # print("phase2")
                content = soup.find(attrs={'class': "se-main-container"}).get_text()
                content = content.replace("\u200b", "")
                content = content.replace("\n", "")
                content = content.replace("Previous image", "")
                content = content.replace("Next image", "")
            else:
                if soup.find(attrs={'id': "postViewArea"}):
                    # print("phase3")
                    content = soup.find(attrs={'id': "postViewArea"}).get_text()
                    content = content.replace("\u200b", "")
                    content = content.replace("\n", "")
                    content = content.replace("Previous image", "")
                    content = content.replace("Next image", "")
                else:
                    print("본문없음")
        except Exception as e:
            print("블로그 조회 실패 :", e)
    else:
        print(response.status_code)
    content = re.compile('[^가-힣+ ]').sub('', content)
    return content

if __name__ == '__main__':
    multiprocessing.freeze_support()
    
    def crawler(storeIdxGet,name, adress):
        name = name.rstrip()
        adress = adress.rstrip()
        searchWord = name + " " + adress

        # --크롬창을 숨기고 실행-- driver에 options를 추가해주면된다
        options = webdriver.ChromeOptions()
        # options.add_experimental_option("excludeSwitches", ["enable-logging"])
        # options.add_argument('headless')

        url = 'https://map.naver.com/v5/search'
        # driver = webdriver.Chrome('./chromedriver')  # 드라이버 경로
        driver = webdriver.Chrome('./chromedriver.exe',options=options) # 크롬창 옵션 적용
        driver.get(url)

        # xpath 찾을때 까지 num초대기
        def time_wait(num, codeType, code):
            wait = 0
            # codeType = "xpath","class","css"
            if codeType == "xpath":
                try:
                    wait = WebDriverWait(driver, num).until(
                        EC.presence_of_element_located((By.XPATH, code)))
                except:
                    pass
            elif codeType == "class":
                try:
                    wait = WebDriverWait(driver, num).until(
                        EC.presence_of_element_located((By.CLASS_NAME, code)))
                except:
                    pass
            elif codeType == "css":
                try:
                    wait = WebDriverWait(driver, num).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, code)))
                except:
                    pass
            if wait:
                print(code, "찾음")
                return True
            else:
                print(code, '태그를 찾지 못하였습니다.')
                return False

        # frame 변경 메소드
        def switch_frame(frame):
            driver.switch_to.default_content()  # frame 초기화
            driver.switch_to.frame(frame)  # frame 변경


        # css를 찾을때 까지 3초 대기
        time_wait(3, "xpath",
                  '/html/body/app/layout/div[3]/div[2]/shrinkable-layout/div/app-base/search-input-box/div/div/div/input')

        # 검색창 찾기
        search = driver.find_element_by_css_selector('div.input_box > input.input_search')
        search.send_keys(searchWord)  # 검색어 입력
        search.send_keys(Keys.ENTER)  # 엔터버튼 누르기

        storeIdx = storeIdxGet
        storeName = name
        storeRating = ""
        storeTell = ""
        reviewList = []
        reviewCnt = ""
        blogUrlList = []
        blogReviewList = []
        blogCnt = ""
        keywordReviewDict = {}
        foodCategory = ""

        storeTellRegex = re.compile("\d{1,5}-\d{1,5}-\d{1,5}")

        result = {
            "storeIdx" : storeIdx, # 상호 고유 번호
            "searchKeyword": name + " " + adress, # 검색 키워드
            "name": storeName,  # 처음 검색할때 상호명으로 저장
            "foodCategory": foodCategory, # 음식 카테고리
            "rating": storeRating, # 별점
            "tell": storeTell, # 가게 전화번호
            "reviews": reviewList, # 수집된 리뷰 개수
            "reviewCnt": reviewCnt, # 전체 리뷰 개수
            "blogReviews": blogReviewList, # 수집된 블로그 리뷰
            "blogCnt": blogCnt, # 전체 블로그 개수
            "keywordReviewDict": keywordReviewDict, # 키워드 리뷰 해쉬
        }
        # frame 변경
        driver.switch_to.default_content()
        iframes = driver.find_elements_by_css_selector('iframe')  # 창에 있는 모든 iframe 출력
        print("프레임 개수:", len(iframes))
        for iframe in iframes:
            print(iframe.get_attribute('id'))

        # 시작시간
        start = time.time()
        print("크롤링 시도")
        # sleep(3)
        try:
            time_wait(3, 'xpath',
                      '/html/body/app/layout/div[3]/div[2]/shrinkable-layout/div/app-base/search-layout/div[2]/entry-layout/entry-place-bridge/div/nm-external-frame-bridge/nm-iframe/iframe')
            switch_frame("entryIframe")
            print("entryIframe find")
        except:
            print("entryIframe 못찾음")
            driver.quit()  # 작업이 끝나면 창을닫는다.
            return result

        sleep(1)

        # 네이버 지도 변수 searchKeyword로 검색 입력.
        # 크롤링 시작
        try:
            # 검색된 상호명/ 음식 카테고리
            try:
                if time_wait(2, "class","YouOG"):
                    storeTitle = driver.find_element_by_class_name("YouOG")
                    try:
                        storeName = storeTitle.find_element_by_class_name("Fc1rA").text
                    except:
                        storeName = ""
                    try:
                        foodCategory = storeTitle.find_element_by_class_name("DJJvD").text
                    except:
                        foodCategory = ""
            except Exception as e:
                print("검색 상호명/ 음식 카테고리 에러 :", e)

            print("데이터 확인 :", storeName)
            print("별점/ 리뷰 개수/ 블로그 리뷰 개수")
            if time_wait(2, 'xpath', '/html/body/div[3]/div/div/div/div[2]/div[1]/div[2]'):
                ratingReviewBlogCnt = driver.find_elements_by_xpath(
                    '/html/body/div[3]/div/div/div/div[2]/div[1]/div[2]/span')
                for idx in range(len(ratingReviewBlogCnt)):
                    if idx == 0:
                        try:
                            storeRating = driver.find_element_by_xpath("/html/body/div[3]/div/div/div/div[2]/div[1]/div[2]/span[1]/em").text
                        except:
                            pass
                    if idx == 1:
                        try:
                            reviewCnt = driver.find_element_by_xpath("/html/body/div[3]/div/div/div/div[2]/div[1]/div[2]/span[2]/a/em").text
                        except:
                            pass
                    if idx == 2:
                        try:
                            blogCnt = driver.find_element_by_xpath("/html/body/div[3]/div/div/div/div[2]/div[1]/div[2]/span[3]/a/em").text
                        except:
                            pass
            else:
                print("평점 없음")
            print("점수 :", storeRating)

            # -----전화번호 가져오기-----
            print("전화번호")
            if time_wait(1.5, 'xpath', '/html/body/div[3]/div/div/div/div[6]/div/div[2]/div/ul/li[3]/div/span[1]'):
                storeTell = driver.find_element_by_xpath(
                    '/html/body/div[3]/div/div/div/div[6]/div/div[2]/div/ul/li[3]/div/span[1]').text
                storeTellValidation = storeTellRegex.search(storeTell.replace(" ",""))
                if not storeTellValidation:
                    storeTell = ""
            else:
                print("전화번호 없음")
            print("전화번호", storeTell)

            # 방문자 리뷰
            try:
                tabBtns = driver.find_elements_by_xpath("/html/body/div[3]/div/div/div/div[5]/div/div/div/div/a")
                sleep(0.5)
                for tab in tabBtns:
                    if tab.text == "리뷰":
                        tab.click()
                        print("리뷰 탭 클릭")
                        break
                sleep(1)

                for clickIdx in range(5):
                    if time_wait(2, 'xpath', "/html/body/div[3]/div/div/div/div[7]/div[2]/div[3]/div[2]/a"):
                        print("리뷰 리스트 더보기 클릭")
                        driver.find_element_by_xpath("/html/body/div[3]/div/div/div/div[7]/div[2]/div[3]/div[2]/a").click()
                        sleep(0.35)
                    else:
                        print("더보기없음 리뷰 수집시작")
                        break

                sleep(1)

                if time_wait(2,"class","YeINN"):
                    reviews = driver.find_elements_by_class_name("YeINN")
                else:
                    reviews = []

                print("리뷰 개수 :", len(reviews))
                for idx in range(len(reviews)):
                    # 리뷰 찾고, 리뷰 더보기 클릭 후 리뷰 수집
                    review = 0
                    try:
                        reviews[idx].find_element_by_class_name("rvCSr").click()
                        sleep(0.05)
                    except:
                        # print("상세 더보기 없음")
                        pass
                    try:
                        review = reviews[idx].find_element_by_class_name("ZZ4OK").text.replace("\n", " ")
                        review = re.compile('[^가-힣+ ]').sub('', review)
                        # review = reviews[idx].text.replace("\n", " ")
                    except Exception as e:
                        print("리뷰 못찾음 :",e)
                    if review:
                        reviewList.append(review)
                        # print(review)
                print("찾은 리뷰 개수 :", len(reviewList))
            except Exception as e:
                print("방문자 리뷰 에러 :", e)

            try:
                # 키워드 리뷰
                for clickIdx in range(4):
                    if time_wait(2,"class","Tvx37"):
                            keywordBtn = driver.find_element_by_class_name('Tvx37')  # 키워드가 담긴 리스트 클릭
                            print("키워드 더보기 클릭")
                            keywordBtn.send_keys(Keys.ENTER)
                    else:
                        print('키워드리뷰 더보기 없음' )
                        break

                if time_wait(1.5,"class","nbD78"):
                    keywordList = driver.find_elements_by_class_name('nbD78')  # 리뷰 리스트
                    for keywordIdx in range(len(keywordList)):
                        keywordTitle = keywordList[keywordIdx].find_element_by_class_name('nWiXa').text  # 키워드리뷰
                        keywordCount = keywordList[keywordIdx].find_element_by_class_name('TwM9q').text  # 리뷰를 선택한 수

                        # db에 넣을 때 편의를 위해 요청하였음
                        title_re = re.sub('"', '', keywordTitle) \
                            .replace('양이 많아요', '1').replace('음식이 맛있어요', '2').replace('재료가 신선해요', '3') \
                            .replace('가성비가 좋아요', '4').replace('특별한 메뉴가 있어요', '5').replace('화장실이 깨끗해요', '6') \
                            .replace('주차하기 편해요', '7').replace('친절해요', '8').replace('특별한 날 가기 좋아요', '9').replace(
                            '매장이 청결해요',
                            '10') \
                            .replace('인테리어가 멋져요', '11').replace('단체모임 하기 좋아요', '12').replace('뷰가 좋아요', '13').replace(
                            '매장이 넓어요',
                            '14') \
                            .replace('혼밥하기 좋아요', '15')

                        title_num = list(map(str, range(1, 16)))  # 1~15만 리스트에추가 (이외에 다른 키워드들은 추가하지않음)
                        keywordCount = re.sub('이 키워드를 선택한 인원\n', '', keywordCount)
                        if title_re in title_num:
                            keywordReviewDict[str(title_re)] = keywordCount
                        else:
                            pass
                    print("키워드 리뷰 개수", len(keywordList))
                else:
                    print("키워드 리뷰 없음")
            except Exception as e:
                print("키워드 리뷰 에러:", e)


            # 블로그 리뷰
            try:
                reviewTabBtn = driver.find_elements_by_class_name("YGvdM")
                for reviewTab in reviewTabBtn:
                    if reviewTab.text == "블로그리뷰":
                        print(reviewTab.text, "찾았다")
                        reviewTab.send_keys(Keys.ENTER)
                        sleep(0.5)
                        break

                print("블로그 리뷰 탭 전환")
                for clickIdx in range(5):
                    # page_down(40)
                    if time_wait(2, 'xpath', "/html/body/div[3]/div/div/div/div[7]/div[2]/div[2]/div[2]/a"):
                        print("블로그 리스트 더보기 클릭")
                        try:
                            driver.find_element_by_xpath("/html/body/div[3]/div/div/div/div[7]/div[2]/div[2]/div[2]/a").click()
                            sleep(0.35)
                        except Exception as e:
                            print("더보기 클릭 실패 :",e)
                    else:
                        print("더보기없음 블로그 url 수집시작")
                        break

                sleep(1)

                if time_wait(2, "class", "xg2_q"):
                    blogUrls = driver.find_elements_by_class_name("xg2_q")
                else:
                    blogUrls = []
                print("블로그 url 개수: ", len(blogUrls))
                for blogUrlIdx in range(len(blogUrls)):
                    aTag = blogUrls[blogUrlIdx].find_element_by_tag_name("a")
                    getUrl = aTag.get_attribute("href")
                    # print(getUrl)
                    blogUrlList.append(getUrl)
                if blogUrlList:
                    print("multiprocessing")
                    pool = multiprocessing.Pool(processes=multiprocessing.cpu_count())
                    print(pool, multiprocessing.cpu_count())
                    blogReviewList = pool.map(blogCrawler, blogUrlList)
                    print("mulit processing - blog 결과 :",len(result))
                    pool.close()
                    pool.join()
            except Exception as e:
                print("블로그 리뷰 에러 : ",e)

            # ---- dict에 데이터 집어넣기----
            # { 상호명, 별점, 키워드리스트, 지도리뷰리스트, 블로그리뷰리스트}

        except Exception as e:
            print(searchWord,"ERROR ERROR :", e)

        print("수집 결과")
        result = {
            "storeIdx": storeIdx,
            "searchKeyword" : name + " " + adress,
            "name": storeName,
            "foodCategory": foodCategory,
            "rating": storeRating,
            "tell": storeTell,
            "reviews": reviewList,
            "reviewCnt" : reviewCnt,
            "blogReviews": blogReviewList,
            "blogCnt" : blogCnt,
            "keywordReviewList": keywordReviewDict,
        }
        print(f'{searchWord} ...완료')
        print('[데이터 수집 완료]\n소요 시간 :', time.time() - start)
        print(
            f"리뷰 개수 : {len(result['reviews'])} 블로그 url 개수 : {len(blogUrls)} 블로그 리뷰 개수 : {len(result['blogReviews'])}")
        driver.quit()  # 작업이 끝나면 창을닫는다.
        return result



    rawDataList = pd.read_csv("text.csv")
    rawDataList = rawDataList.drop("Unnamed: 0", axis = 1)

    print(rawDataList.columns)
    print(rawDataList.shape)

    reviewData = {"reviewData" : []}
    startIdx = 0
    endIdx = len(rawDataList)
    nowIdx = startIdx
    try:
        with open('result.json', 'r', encoding='utf-8') as f:
            reviewData = json.load(f)
        lastStoreIdx = reviewData['reviewData'][-1]["storeIdx"]
        print(type(str(rawDataList.loc[0, ["상가업소번호"]][0])), type(lastStoreIdx))
        # print(rawDataList.loc[:,["상가업소번호"]].head())
        for idx in range(len(rawDataList.loc[:, ["상가업소번호"]])):
            tempIdx = str(rawDataList.loc[idx, ["상가업소번호"]][0])
            if tempIdx == lastStoreIdx:
                print("last idx", idx)
                startIdx = idx + 1
                break
        print("start idx", startIdx)
    except:
        print("결과 데이터 없음. 새로 생성")
    sumTime = 0

    for idx in range(startIdx,endIdx):
        startTime = time.time()
        searchWord = ""
        rawData = rawDataList.loc[idx, ["상가업소번호", "상호명", "도로명주소"]]
        searchIdx = rawData[0]
        searchName = rawData[1]
        searchAdress = rawData[2]
        print(str(searchIdx) + " " + searchName + " " + searchAdress)
        result = []
        try:
            result = crawler(str(searchIdx),searchName,searchAdress)
            with open('result.json', 'w', encoding='utf-8') as f:
                json.dump(reviewData, f, indent=4, ensure_ascii=False)
            nowIdx = idx
            reviewData['reviewData'].append(result)
            print("@"*50,"저장완료",searchIdx,searchName,searchAdress)
        except Exception as e:
            print(searchWord,"크롤링 실패 :",e)
        sumTime += time.time() - startTime
        print("총 소요시간 : {}, 처리 개수 : {}, 1개당 걸린 평균시간 : {}".format(sumTime, idx-startIdx+1, sumTime /(idx-startIdx+1)))
        print(idx,"="*70)

    pprint(reviewData['reviewData'])


