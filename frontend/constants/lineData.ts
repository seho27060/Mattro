/* eslint-disable no-plusplus */
import { LineCircleProps } from "../components/subway/LineCircle";
import lineInfos from "./lineInfo";
import { lineDataType, UsedLineIdType } from "./lineType";

const lineData: lineDataType = {
  "1": {
    attr: {
      "data-label": "1호선",
      "data-indicator-text": "1",
      "data-indicator-text-en": "1",
      "data-color": "#052f93"
    },
    stations: [
      {
        id: "1916",
        name: "소요산"
      },
      {
        id: "1915",
        name: "동두천"
      },
      {
        id: "1914",
        name: "보산"
      },
      {
        id: "1913",
        name: "동두천중앙"
      },
      {
        id: "1912",
        name: "지행"
      },
      {
        id: "1911",
        name: "덕정"
      },
      {
        id: "1910",
        name: "덕계"
      },
      {
        id: "1909",
        name: "양주"
      },
      {
        id: "1908",
        name: "녹양"
      },
      {
        id: "1907",
        name: "가능"
      },
      {
        id: "1906",

        name: "의정부"
      },
      {
        id: "1905",

        name: "회룡",

        intertChange: true
      },
      {
        id: "1904",

        name: "망월사"
      },

      {
        id: "1903",
        name: "도봉산",

        intertChange: true
      },
      {
        id: "1902",

        name: "도봉"
      },
      {
        id: "1901",

        name: "방학"
      },
      {
        id: "0412",

        name: "창동",
        intertChange: true
      },
      {
        id: "1021",

        name: "녹천"
      },
      {
        id: "1020",

        name: "월계"
      },
      {
        id: "1019",

        name: "광운대",

        intertChange: true
      },
      {
        id: "1018",

        name: "석계",
        intertChange: true
      },

      {
        id: "1017",

        name: "신이문"
      },
      {
        id: "1016",

        name: "외대앞"
      },

      {
        id: "1015",

        name: "회기",

        intertChange: true
      },
      {
        id: "0158",

        name: "청량리",

        intertChange: true
      },
      {
        id: "0157",

        name: "제기동"
      },
      {
        id: "0156",

        name: "신설동",

        intertChange: true
      },
      {
        id: "0159",

        name: "동묘앞",

        intertChange: true
      },
      {
        id: "0155",

        name: "동대문",

        intertChange: true
      },
      {
        id: "0154",

        name: "종로5가"
      },
      {
        id: "0153",

        name: "종로3가",

        intertChange: true
      },
      {
        id: "0152",

        name: "종각"
      },

      {
        id: "0151",

        name: "시청",

        intertChange: true
      },
      {
        id: "0150",

        name: "서울역",

        intertChange: true
      },
      {
        id: "1002",

        name: "남영"
      },
      {
        id: "1003",

        name: "용산",
        intertChange: true
      },

      {
        id: "1004",

        name: "노량진",
        intertChange: true
      },

      {
        id: "1005",

        name: "대방",
        intertChange: true
      },

      {
        id: "1032",

        name: "신길",
        intertChange: true
      },
      {
        id: "1006",

        name: "영등포"
      },
      {
        id: "1007",

        name: "신도림",
        intertChange: true
      },
      {
        id: "1701",

        name: "구로",
        intertChange: true
      },
      {
        id: "1813",

        name: "구일"
      },

      {
        id: "1801",

        name: "개봉"
      },
      {
        id: "1802",
        name: "오류동"
      },

      {
        id: "1821",
        name: "온수",

        intertChange: true
      },
      {
        id: "1803",
        name: "역곡"
      },
      {
        id: "1814",
        name: "소사",
        intertChange: true
      },

      {
        id: "1804",
        name: "부천"
      },
      {
        id: "1822",
        name: "중동"
      },
      {
        id: "1805",
        name: "송내"
      },
      {
        id: "1815",
        name: "부개"
      },
      {
        id: "1806",
        name: "부평",

        intertChange: true
      },
      {
        id: "1807",
        name: "백운"
      },

      {
        id: "1808",
        name: "동암"
      },
      {
        id: "1816",
        name: "간석"
      },
      {
        id: "1809",
        name: "주안",

        intertChange: true
      },
      {
        id: "1823",
        name: "도화"
      },

      {
        id: "1810",
        name: "제물포"
      },
      {
        id: "1817",
        name: "도원"
      },
      {
        id: "1811",
        name: "동인천"
      },
      {
        id: "1812",
        name: "인천",

        intertChange: true
      },
      {
        id: "1702",

        name: "가산디지털단지",
        intertChange: true
      },
      {
        id: "1714",

        name: "독산"
      },
      {
        id: "1703",

        name: "금천구청",
        intertChange: true
      },
      {
        id: "1750",

        name: "광명"
      },

      {
        id: "1703",

        name: "금천구청",
        intertChange: true
      },
      {
        id: "1704",

        name: "석수"
      },

      {
        id: "1705",

        name: "관악"
      },
      {
        id: "1706",
        name: "안양"
      },
      {
        id: "1707",
        name: "명학"
      },
      {
        id: "1708",

        name: "금정",
        intertChange: true
      },

      {
        id: "1709",
        name: "군포"
      },
      {
        id: "1729",
        name: "당정"
      },

      {
        id: "1710",
        name: "의왕"
      },
      {
        id: "1711",
        name: "성균관대"
      },
      {
        id: "1712",
        name: "화서"
      },
      {
        id: "1713",
        name: "수원",

        intertChange: true
      },
      {
        id: "1715",
        name: "세류"
      },
      {
        id: "1716",
        name: "병점",
        intertChange: true
      },
      {
        id: "1717",
        name: "세마"
      },
      {
        id: "1718",
        name: "오산대"
      },
      {
        id: "1719",
        name: "오산"
      },
      {
        id: "1720",
        name: "진위"
      },
      {
        id: "1721",
        name: "송탄"
      },
      {
        id: "1722",
        name: "서정리"
      },
      {
        id: "1723",
        name: "평택지제"
      },
      {
        id: "1724",
        name: "평택"
      },
      {
        id: "1725",
        name: "성환"
      },
      {
        id: "1726",
        name: "직산"
      },
      {
        id: "1727",
        name: "두정"
      },
      {
        id: "1728",
        name: "천안"
      },
      {
        id: "1401",
        name: "봉명"
      },
      {
        id: "1402",
        name: "쌍용"
      },
      {
        id: "1403",
        name: "아산"
      },
      {
        id: "1404",
        name: "탕정"
      },
      {
        id: "1405",
        name: "배방"
      },
      {
        id: "1407",
        name: "온양온천"
      },
      {
        id: "1408",
        name: "신창"
      },
      {
        id: "1749",
        name: "서동탄"
      }
    ]
  },
  "2": {
    attr: {
      "data-label": "2호선",
      "data-indicator-text": "2",
      "data-indicator-text-en": "2",
      "data-lineWidth": "2",
      "data-color": "#10a643"
    },
    stations: [
      {
        id: "0200",
        name: "까치산",

        intertChange: true
      },
      {
        id: "0249",
        name: "신정네거리"
      },
      {
        id: "0248",
        name: "양천구청"
      },
      {
        id: "0247",
        name: "도림천"
      },

      {
        id: "1007",

        name: "신도림",
        intertChange: true
      },

      {
        id: "0235",
        name: "문래"
      },
      {
        id: "0236",
        name: "영등포구청",

        intertChange: true
      },

      {
        id: "0237",
        name: "당산",

        intertChange: true
      },
      {
        id: "0238",
        name: "합정",

        intertChange: true
      },

      {
        id: "0239",
        name: "홍대입구",

        intertChange: true
      },
      {
        id: "0240",
        name: "신촌"
      },
      {
        id: "0241",
        name: "이대"
      },
      {
        id: "0242",
        name: "아현"
      },

      {
        id: "0243",
        name: "충정로",

        intertChange: true
      },
      {
        id: "0151",

        name: "시청",

        intertChange: true
      },
      {
        id: "0202",
        name: "을지로입구"
      },
      {
        id: "0203",
        name: "을지로3가",

        intertChange: true
      },
      {
        id: "0204",
        name: "을지로4가",

        intertChange: true
      },

      {
        id: "0205",
        name: "동대문역사문화공원",

        intertChange: true
      },

      {
        id: "0206",
        name: "신당",

        intertChange: true
      },

      {
        id: "0207",
        name: "상왕십리"
      },
      {
        id: "0208",
        name: "왕십리",

        intertChange: true
      },
      {
        id: "0209",
        name: "한양대"
      },
      {
        id: "0210",
        name: "뚝섬"
      },
      {
        id: "0211",
        name: "성수",

        intertChange: true
      },

      {
        id: "0212",
        name: "건대입구",

        intertChange: true
      },

      {
        id: "0213",
        name: "구의"
      },
      {
        id: "0214",
        name: "강변"
      },

      {
        id: "0215",
        name: "잠실나루"
      },
      {
        id: "0216",
        name: "잠실",

        intertChange: true
      },

      {
        id: "0217",
        name: "잠실새내"
      },
      {
        id: "0218",
        name: "종합운동장",

        intertChange: true
      },
      {
        id: "0219",
        name: "삼성"
      },
      {
        id: "0220",
        name: "선릉",

        intertChange: true
      },
      {
        id: "0221",
        name: "역삼"
      },
      {
        id: "0222",
        name: "강남",

        intertChange: true
      },
      {
        id: "0223",
        name: "교대",

        intertChange: true
      },
      {
        id: "0224",
        name: "서초"
      },
      {
        id: "0225",
        name: "방배"
      },
      {
        id: "0226",
        name: "사당",

        intertChange: true
      },
      {
        id: "0227",
        name: "낙성대"
      },
      {
        id: "0228",
        name: "서울대입구"
      },
      {
        id: "0229",
        name: "봉천"
      },
      {
        id: "0230",
        name: "신림",

        intertChange: true
      },
      {
        id: "0231",
        name: "신대방"
      },

      {
        id: "0232",
        name: "구로디지털단지"
      },
      {
        id: "0233",
        name: "대림",

        intertChange: true
      },

      // {
      //   id: "1007"
      // },
      // {
      //   id: "0211",
      //   "data-moveTo": "211,91",
      //   "data-changeLineWidth": "2"
      // },
      {
        id: "0244",
        name: "용답"
      },

      {
        id: "0245",
        name: "신답"
      },
      {
        id: "0250",
        name: "용두"
      },

      {
        id: "0156",

        name: "신설동",

        intertChange: true
      }
    ]
  },
  "3": {
    attr: {
      "data-label": "3호선",
      "data-indicator-text": "3",
      "data-indicator-text-en": "3",
      "data-color": "#de6d00"
    },
    stations: [
      {
        id: "1958",

        name: "대화"
      },
      {
        id: "1957",

        name: "주엽"
      },
      {
        id: "1956",

        name: "정발산"
      },
      {
        id: "1955",

        name: "마두"
      },
      {
        id: "1954",

        name: "백석"
      },
      {
        id: "1953",

        name: "대곡",

        intertChange: true
      },
      {
        id: "1952",

        name: "화정"
      },
      {
        id: "1951",

        name: "원당"
      },
      {
        id: "1948",

        name: "원흥"
      },
      {
        id: "1950",

        name: "삼송"
      },
      {
        id: "0309",

        name: "지축"
      },
      {
        id: "0310",

        name: "구파발"
      },
      {
        id: "0311",

        name: "연신내",

        intertChange: true
      },
      {
        id: "0312",

        name: "불광",

        intertChange: true
      },
      {
        id: "0313",

        name: "녹번"
      },
      {
        id: "0314",

        name: "홍제"
      },
      {
        id: "0315",

        name: "무악재"
      },

      {
        id: "0316",

        name: "독립문"
      },
      {
        id: "0317",

        name: "경복궁"
      },
      {
        id: "0318",

        name: "안국"
      },

      {
        id: "0153",

        name: "종로3가",

        intertChange: true
      },

      {
        id: "0203",
        name: "을지로3가",

        intertChange: true
      },
      {
        id: "0321",
        name: "충무로",

        intertChange: true
      },
      {
        id: "0322",
        name: "동대입구"
      },
      {
        id: "0323",
        name: "약수",

        intertChange: true
      },

      {
        id: "0324",
        name: "금호"
      },
      {
        id: "0325",
        name: "옥수",

        intertChange: true
      },
      {
        id: "0326",
        name: "압구정"
      },
      {
        id: "0327",
        name: "신사",

        intertChange: true
      },
      {
        id: "0328",
        name: "잠원"
      },
      {
        id: "0329",
        name: "고속터미널",

        intertChange: true
      },
      {
        id: "0223",
        name: "교대",

        intertChange: true
      },
      {
        id: "0331",
        name: "남부터미널"
      },

      {
        id: "0332",
        name: "양재",

        intertChange: true
      },
      {
        id: "0333",
        name: "매봉"
      },
      {
        id: "0334",
        name: "도곡",

        intertChange: true
      },
      {
        id: "0335",
        name: "대치"
      },
      {
        id: "0336",
        name: "학여울"
      },
      {
        id: "0337",
        name: "대청"
      },
      {
        id: "0338",
        name: "일원"
      },

      {
        id: "0339",
        name: "수서",

        intertChange: true
      },
      {
        id: "2818",
        name: "가락시장",

        intertChange: true
      },
      {
        id: "0341",
        name: "경찰병원"
      },
      {
        id: "2558",
        name: "오금",

        intertChange: true
      }
      // {
      //   "data-moveTo": "278,127"
      // }
    ]
  },
  "4": {
    attr: {
      "data-label": "4호선",
      "data-indicator-text": "4",
      "data-indicator-text-en": "4",
      "data-color": "#0099d1"
    },
    stations: [
      {
        id: "0405",
        name: "진접"
      },
      {
        id: "0406",
        name: "오남"
      },
      {
        id: "0408",
        name: "별내별가람"
      },
      {
        id: "0409",
        name: "당고개"
      },

      {
        id: "0410",
        name: "상계"
      },
      {
        id: "0411",
        name: "노원",

        intertChange: true
      },
      {
        id: "0412",
        name: "창동",

        intertChange: true
      },
      {
        id: "0413",
        name: "쌍문"
      },
      {
        id: "0414",
        name: "수유"
      },
      {
        id: "0415",
        name: "미아"
      },
      {
        id: "0416",
        name: "미아사거리"
      },
      {
        id: "0417",
        name: "길음"
      },
      {
        id: "0418",
        name: "성신여대입구",

        intertChange: true
      },
      {
        id: "0419",
        name: "한성대입구"
      },
      {
        id: "0420",
        name: "혜화"
      },
      {
        id: "0155",
        name: "동대문",

        intertChange: true
      },

      {
        id: "0205",
        name: "동대문역사문화공원",

        intertChange: true
      },

      {
        id: "0321",
        name: "충무로",

        intertChange: true
      },
      {
        id: "0424",
        name: "명동"
      },
      {
        id: "0425",
        name: "회현"
      },
      {
        id: "0150",

        name: "서울역",

        intertChange: true
      },
      {
        id: "0427",
        name: "숙대입구"
      },

      {
        id: "0428",
        name: "삼각지",

        intertChange: true
      },
      {
        id: "0429",
        name: "신용산"
      },
      {
        id: "0430",
        name: "이촌",

        intertChange: true
      },
      {
        id: "0431",
        name: "동작",

        intertChange: true
      },
      {
        id: "0432",
        name: "총신대입구",

        intertChange: true
      },
      {
        id: "0226",
        name: "사당",

        intertChange: true
      },
      {
        id: "0434",
        name: "남태령"
      },
      {
        id: "1450",
        name: "선바위"
      },

      {
        id: "1451",
        name: "경마공원"
      },
      {
        id: "1452",
        name: "대공원"
      },

      {
        id: "1453",
        name: "과천"
      },
      {
        id: "1454",
        name: "정부과천청사"
      },

      {
        id: "1455",
        name: "인덕원"
      },
      {
        id: "1456",
        name: "평촌"
      },
      {
        id: "1457",
        name: "범계"
      },
      {
        id: "1708",

        name: "금정",
        intertChange: true
      },
      {
        id: "1751",
        name: "산본"
      },
      {
        id: "1763",
        name: "수리산"
      },
      {
        id: "1752",
        name: "대야미"
      },

      {
        id: "1753",
        name: "반월"
      },
      {
        id: "1754",
        name: "상록수"
      },
      {
        id: "1755",
        name: "한대앞",

        intertChange: true
      },
      {
        id: "1756",
        name: "중앙",

        intertChange: true
      },
      {
        id: "1757",
        name: "고잔",

        intertChange: true
      },
      {
        id: "1758",
        name: "초지",

        intertChange: true
      },
      {
        id: "1759",
        name: "안산",

        intertChange: true
      },
      {
        id: "1760",
        name: "신길온천",

        intertChange: true
      },
      {
        id: "1761",
        name: "정왕",

        intertChange: true
      },
      {
        id: "1762",
        name: "오이도",

        intertChange: true
      }
      // {
      //   "data-moveTo": "19,192.5"
      // }
    ]
  },
  "5": {
    attr: {
      "data-label": "5호선",
      "data-indicator-text": "5",
      "data-indicator-text-en": "5",
      "data-color": "#a95094"
    },
    stations: [
      {
        id: "2511",

        name: "방화"
      },
      {
        id: "2512",

        name: "개화산"
      },
      {
        id: "2513",

        name: "김포공항",

        intertChange: true
      },
      {
        id: "2514",

        name: "송정"
      },
      {
        id: "2515",

        name: "마곡"
      },
      {
        id: "2516",

        name: "발산"
      },

      {
        id: "2517",

        name: "우장산"
      },
      {
        id: "2518",

        name: "화곡"
      },
      {
        id: "0200",

        name: "까치산",

        intertChange: true
      },
      {
        id: "2520",

        name: "신정"
      },
      {
        id: "2521",

        name: "목동"
      },
      {
        id: "2522",

        name: "오목교"
      },
      {
        id: "2523",

        name: "양평"
      },
      {
        id: "0236",
        name: "영등포구청",

        intertChange: true
      },
      {
        id: "2525",

        name: "영등포시장"
      },
      {
        id: "1032",

        name: "신길",
        intertChange: true
      },

      {
        id: "2527",

        name: "여의도",
        intertChange: true
      },
      {
        id: "2528",

        name: "여의나루"
      },
      {
        id: "2529",

        name: "마포"
      },

      {
        id: "2530",

        name: "공덕",
        intertChange: true
      },
      {
        id: "2531",

        name: "애오개"
      },
      {
        id: "0243",
        name: "충정로",

        intertChange: true
      },
      {
        id: "2533",
        name: "서대문"
      },

      {
        id: "2534",
        name: "광화문"
      },
      {
        id: "0153",

        name: "종로3가",

        intertChange: true
      },
      {
        id: "0204",
        name: "을지로4가",

        intertChange: true
      },
      {
        id: "0205",
        name: "동대문역사문화공원",

        intertChange: true
      },
      {
        id: "2538",
        name: "청구",

        intertChange: true
      },
      {
        id: "2539",
        name: "신금호"
      },
      {
        id: "2540",
        name: "행당"
      },

      {
        id: "0208",
        name: "왕십리",

        intertChange: true
      },

      {
        id: "2542",
        name: "마장"
      },
      {
        id: "2543",
        name: "답십리"
      },
      {
        id: "2544",
        name: "장한평"
      },
      {
        id: "2545",
        name: "군자",

        intertChange: true
      },

      {
        id: "2546",
        name: "아차산"
      },
      {
        id: "2547",
        name: "광나루"
      },
      {
        id: "2548",
        name: "천호",

        intertChange: true
      },
      {
        id: "2549",
        name: "강동",

        intertChange: true
      },
      {
        id: "2550",
        name: "길동"
      },
      {
        id: "2551",
        name: "굽은다리"
      },
      {
        id: "2552",
        name: "명일"
      },
      {
        id: "2553",
        name: "고덕"
      },
      {
        id: "2554",
        name: "상일동"
      },

      {
        id: "2562",
        name: "강일"
      },
      {
        id: "2563",
        name: "미사"
      },
      {
        id: "2564",
        name: "하남풍산"
      },
      {
        id: "2565",
        name: "하남시청"
      },
      {
        id: "2566",
        name: "하남검단산"
      },
      // {
      //   id: "2549",
      //   "data-moveTo": "282,108"
      // },
      {
        id: "2555",
        name: "둔촌동"
      },
      {
        id: "2556",
        name: "올림픽공원",

        intertChange: true
      },
      {
        id: "2557",
        name: "방이"
      },
      {
        id: "2558",
        name: "오금",

        intertChange: true
      },
      {
        id: "2559",
        name: "개롱"
      },
      {
        id: "2560",
        name: "거여"
      },
      {
        id: "2561",
        name: "마천"
      }
    ]
  },
  "6": {
    attr: {
      "data-label": "6호선",
      "data-indicator-text": "6",
      "data-indicator-text-en": "6",
      "data-color": "#d08d1a"
    },
    stations: [
      {
        id: "1311",

        name: "신내",
        intertChange: true
      },
      {
        id: "2648",
        name: "봉화산"
      },

      {
        id: "2647",
        name: "화랑대"
      },
      {
        id: "2646",
        name: "태릉입구",

        intertChange: true
      },
      {
        id: "1018",

        name: "석계",
        intertChange: true
      },
      {
        id: "2644",
        name: "돌곶이"
      },
      {
        id: "2643",
        name: "상월곡"
      },
      {
        id: "2642",
        name: "월곡"
      },
      {
        id: "2641",
        name: "고려대"
      },
      {
        id: "2640",
        name: "안암"
      },

      {
        id: "2639",
        name: "보문",

        intertChange: true
      },
      {
        id: "2638",
        name: "창신"
      },
      {
        id: "0159",

        name: "동묘앞",

        intertChange: true
      },
      {
        id: "0206",
        name: "신당",

        intertChange: true
      },
      {
        id: "2538",
        name: "청구",

        intertChange: true
      },

      {
        id: "0323",
        name: "약수",

        intertChange: true
      },
      {
        id: "2633",
        name: "버티고개"
      },
      {
        id: "2632",
        name: "한강진"
      },
      {
        id: "2631",
        name: "이태원"
      },
      {
        id: "2630",
        name: "녹사평"
      },
      {
        id: "0428",
        name: "삼각지",

        intertChange: true
      },

      {
        id: "2628",
        name: "효창공원앞",

        intertChange: true
      },

      {
        id: "2530",

        name: "공덕",
        intertChange: true
      },
      {
        id: "2626",

        name: "대흥"
      },
      {
        id: "2625",

        name: "광흥창"
      },

      {
        id: "2624",

        name: "상수"
      },
      {
        id: "0238",
        name: "합정",

        intertChange: true
      },
      {
        id: "2622",
        name: "망원"
      },

      {
        id: "2621",
        name: "마포구청"
      },
      {
        id: "2620",
        name: "월드컵경기장"
      },
      {
        id: "2619",
        name: "디지털미디어시티",

        intertChange: true
      },
      {
        id: "2618",
        name: "증산"
      },
      {
        id: "2617",
        name: "새절"
      },
      {
        id: "2611",
        name: "응암"
      },
      {
        id: "2612",
        name: "역촌"
      },
      {
        id: "0312",

        name: "불광",

        intertChange: true
      },
      {
        id: "2614",

        name: "독바위"
      },
      {
        id: "0311",

        name: "연신내",

        intertChange: true
      },
      {
        id: "2616",

        name: "구산"
      }

      // {
      //   "data-moveTo": "243,51"
      // }
    ]
  },
  "7": {
    attr: {
      "data-label": "7호선",
      "data-indicator-text": "7",
      "data-indicator-text-en": "7",
      "data-color": "#657931"
    },
    stations: [
      {
        id: "3213",
        name: "석남",

        intertChange: true
      },

      {
        id: "3762",
        name: "산곡"
      },
      {
        id: "3118",
        name: "부평구청",

        intertChange: true
      },
      {
        id: "3760",
        name: "굴포천"
      },
      {
        id: "3759",
        name: "삼산체육관"
      },
      {
        id: "3758",
        name: "상동"
      },

      {
        id: "3757",
        name: "부천시청"
      },

      {
        id: "3756",
        name: "신중동"
      },
      {
        id: "3755",
        name: "춘의"
      },

      {
        id: "3754",
        name: "부천종합운동장"
      },
      {
        id: "3753",
        name: "까치울"
      },
      {
        id: "1821",
        name: "온수",

        intertChange: true
      },
      {
        id: "2751",
        name: "천왕"
      },
      {
        id: "2750",
        name: "광명사거리"
      },

      {
        id: "2749",
        name: "철산"
      },
      {
        id: "1702",

        name: "가산디지털단지",
        intertChange: true
      },
      {
        id: "2747",
        name: "남구로"
      },
      {
        id: "0233",
        name: "대림",

        intertChange: true
      },
      {
        id: "2745",
        name: "신풍"
      },
      {
        id: "2744",
        name: "보라매",

        intertChange: true
      },
      {
        id: "2743",
        name: "신대방삼거리"
      },
      {
        id: "2742",
        name: "장승배기"
      },
      {
        id: "2741",
        name: "상도"
      },
      {
        id: "2740",
        name: "숭실대입구"
      },
      {
        id: "2739",
        name: "남성"
      },
      {
        id: "0432",
        name: "총신대입구",

        intertChange: true
      },
      {
        id: "2737",
        name: "내방"
      },

      {
        id: "0329",
        name: "고속터미널",

        intertChange: true
      },

      {
        id: "2735",
        name: "반포"
      },
      {
        id: "2734",
        name: "논현",

        intertChange: true
      },
      {
        id: "2733",
        name: "학동"
      },

      {
        id: "2732",

        name: "강남구청",
        intertChange: true
      },
      {
        id: "2731",
        name: "청담"
      },
      {
        id: "2730",
        name: "뚝섬유원지"
      },

      {
        id: "0212",
        name: "건대입구",

        intertChange: true
      },
      {
        id: "2728",
        name: "어린이대공원"
      },
      {
        id: "2545",
        name: "군자",

        intertChange: true
      },
      {
        id: "2726",
        name: "중곡"
      },
      {
        id: "2725",
        name: "용마산"
      },
      {
        id: "2724",
        name: "사가정"
      },
      {
        id: "2723",
        name: "면목"
      },
      {
        id: "2722",
        name: "상봉",

        intertChange: true
      },
      {
        id: "2721",
        name: "중화"
      },
      {
        id: "2720",
        name: "먹골"
      },
      {
        id: "2646",
        name: "태릉입구",

        intertChange: true
      },
      {
        id: "2718",
        name: "공릉"
      },
      {
        id: "2717",
        name: "하계"
      },
      {
        id: "2716",
        name: "중계"
      },
      {
        id: "0411",
        name: "노원",

        intertChange: true
      },
      {
        id: "2714",
        name: "마들"
      },
      {
        id: "2713",
        name: "수락산"
      },

      {
        id: "1903",
        name: "도봉산",

        intertChange: true
      },
      {
        id: "2711",
        name: "장암"
      }
      // {
      //   "data-moveTo": "37,118"
      // }
    ]
  },
  "8": {
    attr: {
      "data-label": "8호선",
      "data-indicator-text": "8",
      "data-indicator-text-en": "8",
      "data-color": "#e74e6d"
    },
    stations: [
      {
        id: "2811",
        name: "암사"
      },
      {
        id: "2548",
        name: "천호",

        intertChange: true
      },
      {
        id: "2813",
        name: "강동구청"
      },
      {
        id: "2814",
        name: "몽촌토성"
      },
      {
        id: "0216",
        name: "잠실",

        intertChange: true
      },
      {
        id: "2816",
        name: "석촌",

        intertChange: true
      },
      {
        id: "2817",
        name: "송파"
      },
      {
        id: "2818",
        name: "가락시장",

        intertChange: true
      },
      {
        id: "2819",
        name: "문정"
      },
      {
        id: "2820",
        name: "장지"
      },
      {
        id: "1031",
        name: "복정",

        intertChange: true
      },
      {
        id: "2828",
        name: "남위례"
      },

      {
        id: "2822",
        name: "산성"
      },
      {
        id: "2823",
        name: "남한산성입구"
      },

      {
        id: "2824",
        name: "단대오거리"
      },
      {
        id: "2825",
        name: "신흥"
      },

      {
        id: "2826",
        name: "수진"
      },
      {
        id: "1853",
        name: "모란",

        intertChange: true
      }
      // {
      //   "data-moveTo": "261,158"
      // }
    ]
  },
  "9": {
    attr: {
      "data-label": "9호선",
      "data-indicator-text": "9",
      "data-indicator-text-en": "9",
      "data-color": "#b58600"
    },
    stations: [
      {
        id: "4101",
        name: "개화"
      },

      {
        id: "2513",

        name: "김포공항",

        intertChange: true
      },
      {
        id: "4103",
        name: "공항시장"
      },

      {
        id: "4104",
        name: "신방화"
      },
      {
        id: "4105",
        name: "마곡나루",
        intertChange: true
      },
      {
        id: "4106",
        name: "양천향교"
      },

      {
        id: "4107",
        name: "가양"
      },
      {
        id: "4108",
        name: "증미"
      },
      {
        id: "4109",
        name: "등촌"
      },
      {
        id: "4110",
        name: "염창"
      },

      {
        id: "4111",
        name: "신목동"
      },
      {
        id: "4112",
        name: "선유도"
      },
      {
        id: "0237",
        name: "당산",

        intertChange: true
      },
      {
        id: "4114",
        name: "국회의사당"
      },
      {
        id: "2527",

        name: "여의도",
        intertChange: true
      },
      {
        id: "4116",
        name: "샛강",

        intertChange: true
      },
      {
        id: "1004",

        name: "노량진",
        intertChange: true
      },
      {
        id: "4118",

        name: "노들"
      },

      {
        id: "4119",

        name: "흑석"
      },
      {
        id: "0431",

        name: "동작",
        intertChange: true
      },
      {
        id: "4121",

        name: "구반포"
      },
      {
        id: "4122",

        name: "신반포"
      },

      {
        id: "0329",

        name: "고속터미널",
        intertChange: true
      },
      {
        id: "4124",

        name: "사평"
      },
      {
        id: "4125",

        name: "신논현",
        intertChange: true
      },
      {
        id: "4126",

        name: "언주"
      },
      {
        id: "1850",

        name: "선정릉",
        intertChange: true
      },
      {
        id: "4128",

        name: "삼성중앙"
      },

      {
        id: "4129",

        name: "봉은사"
      },
      {
        id: "0218",
        name: "종합운동장",

        intertChange: true
      },

      {
        id: "4131",
        name: "삼전"
      },
      {
        id: "4132",
        name: "석촌고분"
      },

      {
        id: "2816",
        name: "석촌",

        intertChange: true
      },
      {
        id: "4134",
        name: "송파나루"
      },
      {
        id: "4135",
        name: "한성백제"
      },

      {
        id: "2556",
        name: "올림픽공원",

        intertChange: true
      },
      {
        id: "4137",
        name: "둔촌오륜"
      },

      {
        id: "4138",
        name: "중앙보훈병원"
      }
    ]
  },
  KP: {
    attr: {
      "data-label": "김포골드라인",
      "data-indicator-text": "김포",
      "data-indicator-text-en": "김포",
      "data-color": "#a18f57"
    },
    stations: [
      {
        id: "2513",

        name: "김포공항",

        intertChange: true
      },
      {
        id: "4928",
        name: "고촌"
      },

      {
        id: "4927",
        name: "풍무"
      },
      {
        id: "4926",
        name: "사우  (김포시청)"
      },
      {
        id: "4925",
        name: "걸포북변"
      },

      {
        id: "4924",
        name: "운양"
      },
      {
        id: "4923",
        name: "장기"
      },

      {
        id: "4922",
        name: "마산"
      },
      {
        id: "4921",
        name: "구래"
      },
      {
        id: "4920",
        name: "양촌"
      }
    ]
  },
  U: {
    attr: {
      "data-label": "의정부경전철",
      "data-indicator-text": "의정부경전철",
      "data-indicator-text-en": "Uijeongbu Lrt",
      "data-color": "#d9750d"
    },
    stations: [
      {
        id: "4601",

        name: "발곡"
      },

      {
        id: "1905",

        name: "회룡",

        intertChange: true
      },

      {
        id: "4603",

        name: "범골"
      },
      {
        id: "4604",

        name: "경전철의정부"
      },
      {
        id: "4605",

        name: "의정부시청"
      },
      {
        id: "4606",

        name: "흥선"
      },
      {
        id: "4607",

        name: "의정부중앙"
      },
      {
        id: "4608",

        name: "동오"
      },
      {
        id: "4609",

        name: "새말"
      },
      {
        id: "4610",

        name: "경기도청북부청사"
      },
      {
        id: "4611",

        name: "효자"
      },
      {
        id: "4612",

        name: "곤제"
      },
      {
        id: "4613",

        name: "어룡"
      },

      {
        id: "4614",

        name: "송산"
      },
      {
        id: "4615",

        name: "탑석"
      }
    ]
  },
  I: {
    attr: {
      "data-label": "인천1호선",
      "data-indicator-text": "인천1",
      "data-indicator-text-en": "Incheon1",
      "data-color": "#6496df"
    },
    stations: [
      {
        id: "3139",
        name: "송도달빛축제공원"
      },
      {
        id: "3138",
        name: "국제업무지구"
      },
      {
        id: "3137",
        name: "센트럴파크"
      },

      {
        id: "3136",
        name: "인천대입구"
      },
      {
        id: "3135",
        name: "지식정보단지"
      },
      {
        id: "3134",
        name: "테크노파크"
      },
      {
        id: "3133",
        name: "캠퍼스타운"
      },
      {
        id: "3132",
        name: "동막"
      },
      {
        id: "3131",
        name: "동춘"
      },
      {
        id: "3130",
        name: "원인재",

        intertChange: true
      },

      {
        id: "3129",
        name: "신연수"
      },
      {
        id: "3128",
        name: "선학"
      },
      {
        id: "3127",
        name: "문학경기장"
      },
      {
        id: "3126",
        name: "인천터미널"
      },
      {
        id: "3125",
        name: "예술회관"
      },
      {
        id: "3124",
        name: "인천시청",

        intertChange: true
      },

      {
        id: "3123",
        name: "간석오거리"
      },
      {
        id: "3122",
        name: "부평삼거리"
      },
      {
        id: "3121",
        name: "동수"
      },

      {
        id: "1806",
        name: "부평",

        intertChange: true
      },
      {
        id: "3119",
        name: "부평시장"
      },
      {
        id: "3118",
        name: "부평구청",

        intertChange: true
      },
      {
        id: "3117",
        name: "갈산"
      },
      {
        id: "3116",
        name: "작전"
      },
      {
        id: "3115",
        name: "경인교대입구"
      },
      {
        id: "3114",
        name: "계산"
      },
      {
        id: "3113",
        name: "임학"
      },
      {
        id: "3112",
        name: "박촌"
      },
      {
        id: "3111",
        name: "귤현"
      },
      {
        id: "3110",
        name: "계양",

        intertChange: true
      }
    ]
  },
  I2: {
    attr: {
      "data-label": "인천2호선",
      "data-indicator-text": "인천2",
      "data-indicator-text-en": "Incheon2",
      "data-color": "#cf843c"
    },
    stations: [
      {
        id: "3201",
        name: "검단오류"
      },
      {
        id: "3202",
        name: "왕길"
      },
      {
        id: "3203",
        name: "검단사거리"
      },
      {
        id: "3204",
        name: "마전"
      },

      {
        id: "3205",
        name: "완정"
      },
      {
        id: "3206",
        name: "독정"
      },
      {
        id: "4209",
        name: "검암",

        intertChange: true
      },
      {
        id: "3208",
        name: "검바위"
      },

      {
        id: "3209",
        name: "아시아드경기장"
      },
      {
        id: "3210",
        name: "서구청"
      },
      {
        id: "3211",
        name: "가정"
      },
      {
        id: "3212",
        name: "가정중앙시장"
      },
      {
        id: "3213",
        name: "석남",

        intertChange: true
      },
      {
        id: "3214",
        name: "서부여성회관"
      },
      {
        id: "3215",
        name: "인천가좌"
      },
      {
        id: "3216",
        name: "가재울"
      },
      {
        id: "3217",
        name: "주안국가산단"
      },

      {
        id: "1809",
        name: "주안",

        intertChange: true
      },
      {
        id: "3219",
        name: "시민공원"
      },
      {
        id: "3220",
        name: "석바위시장"
      },
      {
        id: "3124",
        name: "인천시청",

        intertChange: true
      },
      {
        id: "3222",
        name: "석천사거리"
      },

      {
        id: "3223",
        name: "모래내시장"
      },
      {
        id: "3224",
        name: "만수"
      },
      {
        id: "3225",
        name: "남동구청"
      },

      {
        id: "3226",
        name: "인천대공원"
      },
      {
        id: "3227",
        name: "운연"
      }
    ]
  },
  G: {
    attr: {
      "data-label": "경춘선",
      "data-indicator-text": "경춘",
      "data-indicator-text-en": "GyeongChun",
      "data-color": "#0ba382"
    },
    stations: [
      {
        id: "0158",

        name: "청량리",

        intertChange: true
      },

      {
        id: "1015",

        name: "회기",

        intertChange: true
      },
      {
        id: "1201",

        name: "중랑",

        intertChange: true
      },

      {
        id: "2722",
        name: "상봉",

        intertChange: true
      },
      {
        id: "1203",

        name: "망우",

        intertChange: true
      },
      {
        id: "1311",

        name: "신내",
        intertChange: true
      },
      {
        id: "1312",

        name: "갈매"
      },
      {
        id: "1313",

        name: "별내"
      },
      {
        id: "1314",

        name: "퇴계원"
      },
      {
        id: "1315",

        name: "사릉"
      },
      {
        id: "1316",

        name: "금곡"
      },

      {
        id: "1317",

        name: "평내호평"
      },
      {
        id: "1318",

        name: "천마산"
      },
      {
        id: "1319",

        name: "마석"
      },
      {
        id: "1320",

        name: "대성리"
      },

      {
        id: "1321",

        name: "청평"
      },
      {
        id: "1322",

        name: "상천"
      },
      {
        id: "1323",

        name: "가평"
      },
      {
        id: "1324",

        name: "굴봉산"
      },
      {
        id: "1325",

        name: "백양리"
      },
      {
        id: "1326",

        name: "강촌"
      },
      {
        id: "1327",

        name: "김유정"
      },
      {
        id: "1328",

        name: "남춘천"
      },
      {
        id: "1329",

        name: "춘천"
      },
      // {
      //   "data-nodeLength": 14
      // },
      // {
      //   id: "2722",
      //   "data-moveTo": "233,55",
      //   "data-changeLineWidth": "2"
      // },

      {
        id: "1019",

        name: "광운대",

        intertChange: true
      }
    ]
  },
  K: {
    attr: {
      "data-label": "경의·중앙선",
      "data-indicator-text": "경의·중앙",
      "data-indicator-text-en": "Gyeongui-Joungang",
      "data-color": "#5f9c82"
    },
    stations: [
      {
        id: "1285",
        name: "임진강"
      },
      {
        id: "1284",
        name: "문산",

        intertChange: true
      },
      {
        id: "1283",
        name: "파주"
      },
      {
        id: "1282",
        name: "월롱"
      },
      {
        id: "1280",
        name: "금촌"
      },
      {
        id: "1279",
        name: "금릉"
      },
      {
        id: "1278",
        name: "운정"
      },
      {
        id: "1277",
        name: "야당"
      },
      {
        id: "1276",
        name: "탄현"
      },

      {
        id: "1275",
        name: "일산"
      },
      {
        id: "1274",
        name: "풍산"
      },
      {
        id: "1273",
        name: "백마"
      },
      {
        id: "1272",
        name: "곡산"
      },
      {
        id: "1953",

        name: "대곡",

        intertChange: true
      },

      {
        id: "1271",
        name: "능곡"
      },
      {
        id: "1270",
        name: "행신"
      },
      {
        id: "1269",
        name: "강매"
      },
      {
        id: "1268",
        name: "화전"
      },
      {
        id: "1267",
        name: "수색"
      },

      {
        id: "2619",
        name: "디지털미디어시티",

        intertChange: true
      },

      {
        id: "1265",
        name: "가좌",

        intertChange: true
      },
      {
        id: "1252",
        name: "신촌"
      },

      {
        id: "1251",

        name: "서울역"
      },
      // {
      //   id: "1265",
      //   "data-moveTo": "99,63"
      // },

      {
        id: "0239",
        name: "홍대입구",

        intertChange: true
      },
      {
        id: "1263",
        name: "서강대"
      },

      {
        id: "2530",

        name: "공덕",
        intertChange: true
      },

      {
        id: "2628",
        name: "효창공원앞",

        intertChange: true
      },

      {
        id: "1003",

        name: "용산",
        intertChange: true
      },
      {
        id: "0430",
        name: "이촌",

        intertChange: true
      },
      {
        id: "1009",
        name: "서빙고"
      },
      {
        id: "1010",
        name: "한남"
      },

      {
        id: "0325",
        name: "옥수",

        intertChange: true
      },
      {
        id: "1012",
        name: "응봉"
      },

      {
        id: "0208",
        name: "왕십리",

        intertChange: true
      },

      {
        id: "0158",

        name: "청량리",

        intertChange: true
      },

      {
        id: "1015",

        name: "회기",

        intertChange: true
      },

      {
        id: "1201",

        name: "중랑",

        intertChange: true
      },

      {
        id: "2722",
        name: "상봉",

        intertChange: true
      },

      {
        id: "1203",

        name: "망우",

        intertChange: true
      },
      {
        id: "1204",

        name: "양원"
      },
      {
        id: "1205",

        name: "구리"
      },
      {
        id: "1206",

        name: "도농"
      },
      {
        id: "1207",

        name: "양정"
      },
      {
        id: "1208",

        name: "덕소"
      },
      {
        id: "1209",

        name: "도심"
      },

      {
        id: "1210",

        name: "팔당"
      },
      {
        id: "1211",

        name: "운길산"
      },
      {
        id: "1212",

        name: "양수"
      },
      {
        id: "1213",

        name: "신원"
      },

      {
        id: "1214",

        name: "국수"
      },
      {
        id: "1215",

        name: "아신"
      },
      {
        id: "1216",

        name: "오빈"
      },
      {
        id: "1217",

        name: "양평"
      },
      {
        id: "1218",

        name: "원덕"
      },
      {
        id: "1219",

        name: "용문"
      },
      {
        id: "1220",

        name: "지평"
      }
    ]
  },
  A: {
    attr: {
      "data-label": "공항철도",
      "data-indicator-text": "공항",
      "data-indicator-text-en": "Airport",
      "data-color": "#038fa0"
    },
    stations: [
      {
        id: "4215",
        name: "인천공항2터미널"
      },
      {
        id: "4213",
        name: "인천공항1터미널"
      },
      {
        id: "4212",
        name: "공항화물청사"
      },
      {
        id: "4211",
        name: "운서"
      },
      {
        id: "4217",
        name: "영종"
      },
      {
        id: "4210",
        name: "청라국제도시"
      },
      {
        id: "4209",
        name: "검암",

        intertChange: true
      },

      {
        id: "3110",
        name: "계양",

        intertChange: true
      },
      {
        id: "2513",

        name: "김포공항",

        intertChange: true
      },

      {
        id: "4105",
        name: "마곡나루",

        intertChange: true
      },

      {
        id: "2619",
        name: "디지털미디어시티",

        intertChange: true
      },

      {
        id: "0239",
        name: "홍대입구",

        intertChange: true
      },

      {
        id: "2530",

        name: "공덕",
        intertChange: true
      },

      {
        id: "0150",

        name: "서울역",

        intertChange: true
      }
    ]
  },
  B: {
    attr: {
      "data-label": "수인분당선",
      "data-indicator-text": "수인분당",
      "data-indicator-text-en": "SuinBundang ",
      "data-color": "#a69500"
    },
    stations: [
      {
        id: "1812",
        // "data-moveTo": "44,160",
        name: "인천",

        intertChange: true
      },
      {
        id: "1890",
        name: "신포"
      },

      {
        id: "1889",

        name: "숭의"
      },
      {
        id: "1888",
        name: "인하대"
      },
      {
        id: "1886",
        name: "송도"
      },
      {
        id: "1885",
        name: "연수"
      },
      {
        id: "3130",
        name: "원인재",

        intertChange: true
      },

      {
        id: "1883",
        name: "남동인더스파크"
      },
      {
        id: "1882",
        name: "호구포"
      },
      {
        id: "1881",
        name: "인천논현"
      },
      {
        id: "1880",
        name: "소래포구"
      },
      {
        id: "1879",
        name: "월곶"
      },

      {
        id: "1878",
        name: "달월"
      },
      {
        id: "1762",
        name: "오이도",

        intertChange: true
      },
      {
        id: "1761",
        name: "정왕",

        intertChange: true
      },
      {
        id: "1760",
        name: "신길온천",

        intertChange: true
      },
      {
        id: "1759",
        name: "안산",

        intertChange: true
      },
      {
        id: "1758",
        name: "초지",

        intertChange: true
      },
      {
        id: "1757",
        name: "고잔",

        intertChange: true
      },
      {
        id: "1756",
        name: "중앙",

        intertChange: true
      },
      {
        id: "1755",
        name: "한대앞",

        intertChange: true
      },

      {
        id: "1877",
        name: "사리"
      },
      {
        id: "1876",
        name: "야목"
      },
      {
        id: "1875",
        name: "어천"
      },
      {
        id: "1874",
        name: "오목천"
      },
      {
        id: "1873",
        name: "고색"
      },

      {
        id: "1713",
        name: "수원",

        intertChange: true
      },
      {
        id: "1872",
        name: "매교"
      },
      {
        id: "1871",
        name: "수원시청"
      },

      {
        id: "1870",
        name: "매탄권선"
      },
      {
        id: "1869",
        name: "망포"
      },
      {
        id: "1868",
        name: "영통"
      },
      {
        id: "1867",
        name: "청명"
      },
      {
        id: "1866",
        name: "상갈"
      },
      {
        id: "1865",
        name: "기흥",

        intertChange: true
      },
      {
        id: "1864",
        name: "신갈"
      },
      {
        id: "1863",
        name: "구성"
      },
      {
        id: "1861",
        name: "보정"
      },
      {
        id: "1862",
        name: "죽전"
      },
      {
        id: "1859",
        name: "오리"
      },

      {
        id: "1858",
        name: "미금",

        intertChange: true
      },
      {
        id: "1857",
        name: "정자",

        intertChange: true
      },

      {
        id: "1856",
        name: "수내"
      },
      {
        id: "1855",
        name: "서현"
      },
      {
        id: "1860",
        name: "이매",

        intertChange: true
      },
      {
        id: "1854",
        name: "야탑"
      },
      {
        id: "1853",
        name: "모란",

        intertChange: true
      },
      {
        id: "1852",
        name: "태평"
      },

      {
        id: "1851",
        name: "가천대"
      },

      {
        id: "1031",
        name: "복정",

        intertChange: true
      },
      {
        id: "0339",
        name: "수서",

        intertChange: true
      },
      {
        id: "1028",
        name: "대모산입구"
      },
      {
        id: "1027",
        name: "개포동"
      },
      {
        id: "1026",
        name: "구룡"
      },

      {
        id: "0334",
        name: "도곡",

        intertChange: true
      },
      {
        id: "1024",
        name: "한티"
      },
      {
        id: "0220",
        name: "선릉",

        intertChange: true
      },
      {
        id: "1850",

        name: "선정릉",
        intertChange: true
      },

      {
        id: "2732",

        name: "강남구청",
        intertChange: true
      },
      {
        id: "1848",

        name: "압구정로데오"
      },
      {
        id: "1847",

        name: "서울숲"
      },

      {
        id: "0208",
        name: "왕십리",

        intertChange: true
      },

      {
        id: "0158",

        name: "청량리",

        intertChange: true
      }
    ]
  },
  S: {
    attr: {
      "data-label": "신분당선",
      "data-indicator-text": "신분당",
      "data-indicator-text-en": "Sinbundang",
      "data-color": "#cd2234"
    },
    stations: [
      {
        id: "0327",
        name: "신사",

        intertChange: true
      },

      {
        id: "2734",
        name: "논현",

        intertChange: true
      },
      {
        id: "4125",

        name: "신논현",
        intertChange: true
      },
      {
        id: "0222",
        name: "강남",

        intertChange: true
      },
      {
        id: "0332",
        name: "양재",

        intertChange: true
      },

      {
        id: "4309",
        name: "양재시민의숲"
      },

      {
        id: "4310",
        name: "청계산입구"
      },
      {
        id: "4311",
        name: "판교",

        intertChange: true
      },

      {
        id: "1857",
        name: "정자",

        intertChange: true
      },
      {
        id: "1858",
        name: "미금",

        intertChange: true
      },
      {
        id: "4314",
        name: "동천"
      },
      {
        id: "4315",
        name: "수지구청"
      },
      {
        id: "4316",
        name: "성복"
      },
      {
        id: "4317",
        name: "상현"
      },
      {
        id: "4318",
        name: "광교중앙"
      },
      {
        id: "4319",
        name: "광교"
      }
    ]
  },
  KK: {
    attr: {
      "data-label": "경강선",
      "data-indicator-text": "경강",
      "data-indicator-text-en": "Gyeonggang",
      "data-color": "#004ea7"
    },
    stations: [
      {
        id: "4311",
        name: "판교",

        intertChange: true
      },
      {
        id: "1860",
        name: "이매",

        intertChange: true
      },
      {
        id: "1503",
        name: "삼동"
      },

      {
        id: "1504",
        name: "경기광주"
      },
      {
        id: "1505",
        name: "초월"
      },
      {
        id: "1506",
        name: "곤지암"
      },
      {
        id: "1507",
        name: "신둔도예촌"
      },
      {
        id: "1508",
        name: "이천"
      },
      {
        id: "1509",
        name: "부발"
      },

      {
        id: "1510",
        name: "세종대왕릉"
      },
      {
        id: "1511",
        name: "여주"
      }
    ]
  },
  E: {
    attr: {
      "data-label": "용인경전철",
      "data-indicator-text": "용인경전철",
      "data-indicator-text-en": "Everline",
      "data-color": "#36a805"
    },
    stations: [
      {
        id: "1865",
        name: "기흥",
        intertChange: true
      },
      {
        id: "4502",
        name: "강남대"
      },

      {
        id: "4503",
        name: "지석"
      },
      {
        id: "4504",
        name: "어정"
      },
      {
        id: "4505",
        name: "동백"
      },
      {
        id: "4506",
        name: "초당"
      },
      {
        id: "4508",
        name: "삼가"
      },
      {
        id: "4509",
        name: "시청·용인대"
      },
      {
        id: "4510",
        name: "명지대"
      },
      {
        id: "4511",
        name: "김량장"
      },
      {
        id: "4512",
        name: "운동장·송담대"
      },
      {
        id: "4513",
        name: "고진"
      },
      {
        id: "4514",
        name: "보평"
      },
      {
        id: "4515",
        name: "둔전"
      },
      {
        id: "4517",
        name: "전대·에버랜드"
      }
    ]
  },
  W: {
    attr: {
      "data-label": "우이신설경전철",
      "data-indicator-text": "우이신설경전철",
      "data-indicator-text-en": "Wooe-Sinseul Lrt",
      "data-color": "#878787"
    },
    stations: [
      {
        id: "0156",

        name: "신설동",

        intertChange: true
      },
      {
        id: "2639",
        name: "보문",

        intertChange: true
      },

      {
        id: "0418",
        name: "성신여대입구",

        intertChange: true
      },
      {
        id: "4710",
        name: "정릉"
      },

      {
        id: "4709",
        name: "북한산보국문"
      },
      {
        id: "4708",
        name: "솔샘"
      },
      {
        id: "4707",
        name: "삼양사거리"
      },
      {
        id: "4706",
        name: "삼양"
      },
      {
        id: "4705",
        name: "화계"
      },
      {
        id: "4704",
        name: "가오리"
      },
      {
        id: "4703",
        name: "4·19민주묘지"
      },

      {
        id: "4702",
        name: "솔밭공원"
      },

      {
        id: "4701",
        name: "북한산우이"
      }
    ]
  },
  SH: {
    stations: [
      {
        id: "1814",

        name: "소사",
        intertChange: true
      },
      {
        id: "4805",
        name: "소새울"
      },
      {
        id: "4806",
        name: "시흥대야"
      },
      {
        id: "4807",
        name: "신천"
      },

      {
        id: "4808",
        name: "신현"
      },

      {
        id: "4809",
        name: "시흥시청"
      },
      {
        id: "4810",
        name: "시흥능곡"
      },

      {
        id: "4811",
        name: "달미"
      },
      {
        id: "4812",
        name: "선부"
      },

      {
        id: "1758",
        name: "초지",
        intertChange: true
      },

      {
        id: "4814",
        name: "시우"
      },
      {
        id: "4815",
        name: "원시"
      }
    ],
    attr: {
      "data-label": "서해",
      "data-indicator-text": "서해",
      "data-indicator-text-en": "Seo-Hae",
      "data-color": "#40a607"
    }
  },

  SL: {
    stations: [
      {
        id: "4116",
        name: "샛강",

        intertChange: true
      },
      {
        id: "1005",

        name: "대방",
        intertChange: true
      },
      {
        id: "4403",
        name: "서울지방병무청"
      },

      {
        id: "2744",
        name: "보라매",

        intertChange: true
      },
      {
        id: "4405",
        name: "보라매공원"
      },
      {
        id: "4406",
        name: "보라매병원"
      },
      {
        id: "4407",
        name: "당곡"
      },
      {
        id: "0230",
        name: "신림",
        intertChange: true
      },
      {
        id: "4409",
        name: "서원"
      },
      {
        id: "4410",
        name: "서울대벤처타운"
      },
      {
        id: "4411",
        name: "관악산(서울대)"
      }
    ],
    attr: {
      "data-label": "신림",
      "data-indicator-text": "신림",
      "data-indicator-text-en": "Sin-Lim",
      "data-color": "#0781fa"
    }
  }
};

export const searchByName = (name: string) => {
  const result: {
    id: string;
    name: string;
    line: LineCircleProps;
  }[] = [];
  const newResult: {
    id: string;
    name: string;
    lines: LineCircleProps[];
  }[] = [];
  lineInfos.forEach((lineInfo) => {
    const { stations } = lineData[lineInfo.id.slice(1)];
    stations.forEach((station) => {
      if (station.name.includes(name)) {
        result.push({ id: station.id, name: station.name, line: lineInfo });
      }
    });
  });

  for (let i = 0; i < result.length; i++) {
    let dupliInd = -1;
    for (let j = 0; j < newResult.length; j++) {
      if (result[i].id === newResult[j].id) {
        dupliInd = j;
        break;
      }
    }
    if (dupliInd !== -1 && newResult.length !== 0) {
      newResult[dupliInd].lines = [
        ...newResult[dupliInd].lines,
        result[i].line
      ];
    } else {
      newResult.push({
        id: result[i].id,
        name: result[i].name,
        lines: [result[i].line]
      });
    }
  }

  return newResult;
};

export const getLoadingData = (
  lineId: UsedLineIdType,
  stationId: string
): string[] => {
  const id = lineId.replace("L", "");
  const result = [];
  let stationInd = -1;
  lineData[id].stations.forEach((station, ind) => {
    if (station.id === stationId) {
      stationInd = ind;
    }
  });
  const longLindata = [...lineData[id].stations, ...lineData[id].stations];
  for (
    let i = lineData[id].stations.length + stationInd - 6;
    i < lineData[id].stations.length + stationInd;
    i++
  ) {
    result.push(longLindata[i + 1].name);
  }
  return result;
};
export default lineData;
