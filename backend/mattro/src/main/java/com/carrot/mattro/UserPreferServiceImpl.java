package com.carrot.mattro;

import com.carrot.mattro.Repository.CrawlingRepository;
import com.carrot.mattro.service.RecommendationService;
import com.carrot.mattro.service.SetStandardsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserPreferServiceImpl implements UserPreferService {
    private final List<String> koreanFoodList = List.of("한식");
    private final List<String> MeatFoodList = List.of("돼지고기 구이","소고기 구이","양꼬치","돼지고기 구이");
    private final CrawlingRepository crawlingRepository;
    private final RecommendationService recommendationService;
    private final SetStandardsService setStandardsService;

    @Override
    public List<Output> userPrefer(String choices) {
        Boolean index0 = false;
        Boolean index1 = false;
        Boolean index2 = false;

        List<String> koreanFoodList = List.of("한식");
        List<String> meetFoodList = List.of("육류,고기요리","족발,보쌈");
        List<String> resultFoodCategoryList = new ArrayList<String>();

        if(choices.substring(0,1).equals("1")){
            index0 = true;
        }
        if(choices.substring(1,2).equals("1")){
            index1 = true;
        }
        if(choices.substring(2,3).equals("1")){
            index2 = true;
        }
        if(choices.substring(3,4).equals("1")){
            resultFoodCategoryList.addAll(koreanFoodList);
        }
        if(choices.substring(4,5).equals("1")){
            resultFoodCategoryList.addAll(meetFoodList);
        }
        List<Output> byUserPrefer = crawlingRepository.findByUserPrefer(index0, index1, index2, resultFoodCategoryList);
//        추천알고리즘 적용
        System.out.println(byUserPrefer.size());
        System.out.println(byUserPrefer);
        return byUserPrefer;
    }

    @Override
    public List<Output> getStoreByStoreIndexList(String storeIndexStr) {
        String[] storeIndexList = storeIndexStr.split(",");
        List<Output> result = crawlingRepository.findByStoreIdxIn(storeIndexList);
        return result;
    }
}
