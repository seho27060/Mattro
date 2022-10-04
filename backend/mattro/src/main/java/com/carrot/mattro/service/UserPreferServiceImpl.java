package com.carrot.mattro.service;

import com.carrot.mattro.DTO.store;
import com.carrot.mattro.domain.entity.Output;
import com.carrot.mattro.Repository.CrawlingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserPreferServiceImpl implements UserPreferService {

    private final CrawlingRepository crawlingRepository;
    private final RecommendationService recommendationService;
    private final SetStandardsService setStandardsService;

    @Override
    public List<Integer> userPrefer(String choices) {
        Boolean index0 = false;
        Boolean index1 = false;
        Boolean index2 = false;

        HashSet<String> basicFoodList = new HashSet<>(Arrays.asList("일식튀김,꼬치","전복요리","급식","스페인음식","방앗간",
                "3성급","고고즉석떡볶이","카레","반찬가게","1성급",
                "장금수부대찌개","국수","향토음식","커피번","오뎅,꼬치","케이크전문",
                "장어,먹장어요리","차","찌개,전골","쌀똑핫도그","족발,보쌈","백숙,삼계탕","떡카페","카페",
                "일본식라면","빙수","베트남음식","미스터빠삭","갈비배달도시락스트릿테이블",
                "냉면","과일,주스전문점","홍차전문점","호텔","한식","일식당","호두과자","브런치",
                "이탈리아음식","김밥","식료품제조","국밥","도시락,컵밥","야식","시장",
                "양꼬치","감자탕","만년닭강정","베이글","핫도그","커피가공,제조","4성급","제사음식","달떡볶이","차,커피","심야오뎅","ABC커피","정육식당","호떡",
                "일식,초밥뷔페","아름다운커피","불닭","수산물","백반,가정식","고기원칙","그리스음식","샤브샤브",
                "스파게티스토리","일석삼조버섯매운탕","햄버거","출장요리","유제품제조",
                "해산물뷔페","인도음식","힐링카페","초밥,롤","죽","육류,고기요리","다이어트,샐러드","닭","막국수","만두",
                "해물,생선요리","바나프레소","전통,민속주점","고기뷔페","돈가스","멕시코,남미음식","푸드트럭","곰탕,설렁탕","아부찌부대찌개","분식",
                "순대,순댓국","음식점","가리미김밥","제과,제빵","오리요리","문래돼지불백","건어물","아귀찜,해물찜",
                "한정식","2성급","보리밥","베이커리","돼지고기구이","뷔페","시골한우시골돼지","태국음식","복어요리","기사식당","우동,소바","밀도","바(BAR)","라면",
                "술집","양갈비","와인","닭요리","바닷가재요리","소고기구이","피자","양식","떡,한과","유흥주점","요리주점","과자,사탕,초코렛",
                "칼국수,만두","이북음식","스테이크,립","밀키트","오니기리","슬라임카페","사철,영양탕","도넛",
                "보드카페","초콜릿전문점","수산물가공,제조","신의주부대찌개","게요리", "덮밥","떡류제조","떡볶이","프랜차이즈본사","생선구이","대게요리","찜닭",
                "닭갈비","식료품","전통식품","후렌치후라이","슈","주꾸미요리","프랑스음식","쌈밥","추어탕","빵류제조","비빔밥","과자류제조","정육점","고양이카페","두부요리",
                "생선회","블루보틀","카페,디저트","주류","101커피컨테이너","갈비탕",
                "맥주,호프","딤섬,중식만두","이자카야","PC방","해장국","푸드코트","일초닭발","오징어요리","낙지요리","토스트","고레카레",
                "중식당","아이스크림","대구형제막창","주류제조","닭볶음탕","아시아음식","매운탕,해물탕","고기한끼",
                "신룽푸마라탕","우유,유제품","조개요리","곱창,막창,양","와플","전,빈대떡","패밀리레스토랑",
                "스파게티,파스타전문","포장마차","일반휴게소", "테이크아웃커피","종합분식","한식뷔페","독일음식","101번지남산돈까스","굴요리","차류가공,제조",
                "단란주점","안경할머니곱창","주먹밥","샌드위치","JVL부대찌개","치킨,닭강정",
                "퓨전음식","닭발","채식,샐러드뷔페","스마일찹쌀꽈배기","도시락,조리식품제조"));
        HashSet<String> koreanFoodList = new HashSet<>(Arrays.asList("전복요리","급식","방앗간","고고즉석떡볶이","반찬가게","장금수부대찌개","국수","향토음식",
                "장어,먹장어요리","찌개,전골","족발,보쌈","백숙,삼계탕","떡카페","미스터빠삭","갈비배달도시락스트릿테이블",
                "냉면","한식","호두과자","김밥","국밥","도시락,컵밥","야식","시장","감자탕","만년닭강정","제사음식",
                "달떡볶이","정육식당","호떡","불닭","수산물","백반,가정식","고기원칙","일석삼조버섯매운탕","죽",
                "육류,고기요리","닭","막국수","만두","해물,생선요리","전통,민속주점","돈가스","곰탕,설렁탕","아부찌부대찌개","분식",
                "순대,순댓국","가리미김밥","오리요리","문래돼지불백","아귀찜,해물찜","한정식","보리밥","돼지고기구이","시골한우시골돼지",
                "복어요리","기사식당","밀도","라면","닭요리","소고기구이","떡,한과","칼국수,만두","이북음식","사철,영양탕",
                "신의주부대찌개","게요리","덮밥","떡류제조","떡볶이","생선구이","대게요리","찜닭",
                "닭갈비","전통식품","주꾸미요리","쌈밥","추어탕","비빔밥","정육점","두부요리","생선회","갈비탕","해장국","일초닭발","오징어요리","낙지요리",
                "대구형제막창","닭볶음탕","매운탕,해물탕","고기한끼","조개요리","곱창,막창,양","전,빈대떡","포장마차","일반휴게소",
                "종합분식","한식뷔페","101번지남산돈까스","굴요리","안경할머니곱창","주먹밥","JVL부대찌개","치킨,닭강정",
                "닭발","스마일찹쌀꽈배기","도시락,조리식품제조"));
        HashSet<String> notKoreanFoodList = new HashSet<>(Arrays.asList("일식튀김,꼬치","스페인음식","퓨전음식","샌드위치","독일음식","스파게티,파스타전문","패밀리레스토랑","와플","신룽푸마라탕",
                "아시아음식","중식당","토스트","고레카레","딤섬,중식만두","이자카야","프랑스음식","후렌치후라이","슈","도넛","오니기리",
                "스테이크,립","피자","양식","바닷가재요리","양갈비","와인","우동,소바","태국음식","멕시코,남미음식","초밥,롤",
                "인도음식","스파게티스토리","그리스음식","샤브샤브","일식,초밥뷔페","심야오뎅","베이글","핫도그","양꼬치","이탈리아음식",
                "브런치","일식당","베트남음식","일본식라면","쌀똑핫도그","오뎅,꼬치","카레","다이어트,샐러드","햄버거"));
        HashSet<String> meatFoodList = new HashSet<>(Arrays.asList("족발,보쌈","백숙,삼계탕",
                "갈비배달도시락스트릿테이블","양꼬치","감자탕","만년닭강정","정육식당","불닭","고기원칙",
                "햄버거","육류,고기요리","닭","만두","고기뷔페","돈가스","곰탕,설렁탕","아부찌부대찌개",
                "순대,순댓국","오리요리","문래돼지불백","돼지고기구이","시골한우시골돼지",
                "양갈비","닭요리","소고기구이","스테이크,립","사철,영양탕","신의주부대찌개",
                "찜닭","닭갈비","정육점","갈비탕","해장국","일초닭발","대구형제막창","닭볶음탕","고기한끼",
                "곱창,막창,양","전,빈대떡","101번지남산돈까스","안경할머니곱창","JVL부대찌개","치킨,닭강정","닭발"));
        HashSet<String> seaFoodList = new HashSet<>(Arrays.asList("전복요리","굴요리","조개요리","매운탕,해물탕","오징어요리","낙지요리","생선회","추어탕"
                ,"주꾸미요리","생선구이","대게요리","바닷가재요리","복어요리","건어물","아귀찜,해물찜",
                "해물,생선요리","초밥,롤","해산물뷔페","수산물","일식,초밥뷔페","심야오뎅","장어,먹장어요리",
                "오뎅,꼬치","게요리","수산물가공,제조"));

        if(choices.charAt(0) == '1'){
            index0 = true;
        }
        if(choices.charAt(1) == '1'){
            index1 = true;
        }
        if(choices.charAt(2) == '1'){
            index2 = true;
        }
        if(choices.charAt(3) == '1'){
            basicFoodList.removeAll(notKoreanFoodList);
        }else{
            basicFoodList.removeAll(koreanFoodList);
        }
        if(choices.charAt(4) == '1'){
            basicFoodList.removeAll(seaFoodList);
        } else{
            basicFoodList.removeAll(meatFoodList);
        }
        List<String> resultFoodList = new ArrayList<>(basicFoodList);
        List<Output> byUserPrefer = crawlingRepository.findByUserPrefer(index0, index1, index2, resultFoodList );
//        추천알고리즘 적용

        if (byUserPrefer.isEmpty()){
            return new ArrayList<>();
        } else{
            store[] storeZ = new store[byUserPrefer.size()];

            double[] reviewCountZ = recommendationService.reviewCountNormalization(setStandardsService.reviewCountBase(byUserPrefer), byUserPrefer);
            double[] reviewContentZ = recommendationService.reviewContentNormalization(setStandardsService.reviewContentBase(byUserPrefer), byUserPrefer);
            double[] reviewBlogZ = recommendationService.reviewBlogNormalization(setStandardsService.blogBase(byUserPrefer), byUserPrefer);
            double[] reviewRatingZ = recommendationService.reviewRatingNormalization(setStandardsService.ratingBase(byUserPrefer), byUserPrefer);

            for(int i = 0; i < byUserPrefer.size(); i++){
                double z = 0;

                z += reviewCountZ[i] * 0.25;
                z += reviewContentZ[i] * 0.1;
                z += reviewBlogZ[i] * 0.1;
                z += reviewRatingZ[i] * 0.25;

                storeZ[i] = new store(byUserPrefer.get(i).getStoreIdx(), z);
            }

            // z에 따른 정렬
            Arrays.sort(storeZ, (o1, o2) -> Double.compare(o2.getZ(), o1.getZ()));
            Integer limit = Math.min(storeZ.length,20);
            List<Integer> numLst = new ArrayList<>();
            for(int i = 0; i < 5; i++){
                int num = Integer.parseInt(storeZ[(int)(Math.random() * limit)].getStoreIdx());

                if(numLst.isEmpty()){
                    numLst.add(num);
                    continue;
                }

                if (!numLst.contains(num)){
                    numLst.add(num);
                } else{
                    i--;
                }
            }
            return numLst;
        }

    }

    @Override
    public List<Output> getStoreByStoreIndexList(String storeIndexStr) {
        String[] storeIndexList = storeIndexStr.split(",");
        // 순서가 뒤죽박죽인 리스트
        List<Output> unOrderedResult = crawlingRepository.findByStoreIdxIn(storeIndexList);
        List<Output> orderedResult = new ArrayList<>();
        for(String str : storeIndexList){
            for(Output output : unOrderedResult){
                if(str.equals(output.getStoreIdx())){
                    orderedResult.add(output);
                    break;
                }
            }
        }
        return orderedResult;
    }
}
