package com.carrot.mattro;

import com.carrot.mattro.DTO.CrawlingResponse;
import com.carrot.mattro.Repository.CrawlingRepository;
import com.jayway.jsonpath.internal.function.text.Length;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class UserPreferServiceImplTest {

    @Autowired
    CrawlingRepository crawlingRepository;
    @Test
    void userPrefer() {
        String survey = "10111";
        List<String> koreanFoodList = List.of("한식");
        List<Crawling> test_result = crawlingRepository.findByFoodCategoryIn(koreanFoodList);
        assertThat(test_result).isNotEmpty();

        List<CrawlingResponse> outer = new ArrayList<CrawlingResponse>();
        Optional<List<Crawling>> test = Optional.ofNullable(test_result);
        if(test.isPresent()){
            List<Crawling> inner = test.get();
            outer = inner.stream().map(o -> new CrawlingResponse(o)).collect(Collectors.toList());
        }
        System.out.println(outer);
        System.out.println(outer.size());
//        System.out.println(test_result);
//        System.out.println(test_result.getClass());
//        System.out.println(test_result.size());
    }

    @Test
    void testFunc(){
        String input = "10111";
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
        List<Crawling> testResult3 = crawlingRepository.findByUserPrefer(index0,index1,index2,resultFoodCategoryList);
        assertThat(testResult3).isNotEmpty();

        System.out.println(testResult3.subList(0,3));
    }
}