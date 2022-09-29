package com.carrot.mattro;

import com.carrot.mattro.DTO.CrawlingResponse;
import com.carrot.mattro.DTO.store;
import com.carrot.mattro.Repository.CrawlingRepository;
import com.carrot.mattro.service.RecommendationService;
import com.carrot.mattro.service.SetStandardsService;
import com.jayway.jsonpath.internal.function.text.Length;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

@RequiredArgsConstructor
@SpringBootTest
class UserPreferServiceImplTest {

    @Autowired
    CrawlingRepository crawlingRepository;
    @Autowired
    private RecommendationService recommendationService;
    @Autowired
    private SetStandardsService setStandardsService;

    @Test
    void testFunc(){
        String input = "00000";
//       1,2,3 은 키워드
//        4,5는 음식 카테고리

        Boolean index0 = false;
        Boolean index1 = false;
        Boolean index2 = false;

        List<String> koreanFoodList = List.of("한식");
        List<String> meetFoodList = List.of("육류,고기요리","족발,보쌈");
        List<String> resultFoodCategoryList = new ArrayList<String>();

        if(input.substring(0,1).equals("1")){
            index0 = true;
        }
        if(input.substring(1,2).equals("1")){
            index1 = true;
        }
        if(input.substring(2,3).equals("1")){
            index2 = true;
        }
        if(input.substring(3,4).equals("1")){
            resultFoodCategoryList.addAll(koreanFoodList);
        }
        if(input.substring(4,5).equals("1")){
            resultFoodCategoryList.addAll(meetFoodList);
        }
        System.out.printf("%b %b %b %s",index0,index1,index2,resultFoodCategoryList.toString());
        List<Output> testResult3 = crawlingRepository.findByUserPrefer(index0,index1,index2,resultFoodCategoryList);
        assertThat(testResult3).isNotEmpty();

        store[] storeZ = new store[testResult3.size()];

        double[] reviewCountZ = recommendationService.reviewCountNormalization(setStandardsService.reviewCountBase(testResult3), testResult3);
        double[] reviewContentZ = recommendationService.reviewContentNormalization(setStandardsService.reviewContentBase(testResult3), testResult3);
        double[] reviewBlogZ = recommendationService.reviewBlogNormalization(setStandardsService.blogBase(testResult3), testResult3);
        double[] reviewRatingZ = recommendationService.reviewRatingNormalization(setStandardsService.ratingBase(testResult3), testResult3);

        for(int i = 0; i < testResult3.size(); i++){
            double z = 0;

            z += reviewCountZ[i] * 0.25;
            z += reviewContentZ[i] * 0.1;
            z += reviewBlogZ[i] * 0.1;
            z += reviewRatingZ[i] * 0.25;

            storeZ[i] = new store(testResult3.get(i).getStoreIdx(), z);
        }

        // z에 따른 정렬
        Arrays.sort(storeZ, (o1, o2) -> Double.compare(o2.getZ(), o1.getZ()));
        System.out.println(storeZ.length);
        Integer limit = Math.min(storeZ.length,20);
        List<Integer> numLst = new ArrayList<>();

        for(int i = 0; i < Math.min(limit,5); i++){
            int num = Integer.parseInt(storeZ[(int)(Math.random() * limit)].getStoreIdx());
            System.out.println(num);
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
        System.out.println(numLst);
    }


}