package com.carrot.mattro;

import com.carrot.mattro.DTO.CrawlingResponse;
import com.carrot.mattro.Repository.CrawlingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
        List<Crawling> byFoodCategoryIn = crawlingRepository.findByFoodCategoryIn(koreanFoodList);
        Optional<List<Crawling>> test = Optional.ofNullable(byFoodCategoryIn);

        List<CrawlingResponse> outer = new ArrayList<CrawlingResponse>();
        if (test.isPresent()){
            List<Crawling> inner = test.get();
            outer = inner.stream().map(o -> new CrawlingResponse(o)).collect(Collectors.toList());
        }
        return outer;

    }
}
