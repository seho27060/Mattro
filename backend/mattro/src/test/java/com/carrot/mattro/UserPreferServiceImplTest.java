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
}