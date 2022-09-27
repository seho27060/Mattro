package com.carrot.mattro;

import com.carrot.mattro.DTO.CrawlingResponse;
import com.carrot.mattro.Repository.CrawlingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserPreferServiceImpl implements UserPreferService {
    private final List<String> koreanFoodList = List.of("한식");
    private final List<String> nonKoreanFoodList = List.of("비한식");
    private final CrawlingRepository crawlingRepository;
    @Override
    public List<CrawlingResponse> userPrefer(String choices) {
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
        List<Crawling> byUserPrefer = crawlingRepository.findByUserPrefer(index0,index1,index2,resultFoodCategoryList);
//        키워드기반 리스트
        Optional<List<Crawling>> test = Optional.ofNullable(byUserPrefer);

//        추천알고리즘 적용

        List<CrawlingResponse> outer = new ArrayList<CrawlingResponse>();
        if (test.isPresent()){
            List<Crawling> inner = test.get();
            outer = inner.stream().map(o -> new CrawlingResponse(o)).collect(Collectors.toList());
        }
        return outer;

    }
}
