package com.carrot.mattro.Repository;
import com.carrot.mattro.Crawling;
import com.carrot.mattro.Output;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CrawlingRepository extends MongoRepository<Crawling, String> {

    Optional<Crawling> findByName(String storeName);
//    List<Crawling> findByFoodCategoryIn(List<String> koreanFoodList);
    List<Crawling> findByFoodCategoryIn(List<String> koreanFoodList);


    @Query("{'keywordReviewList.15' : {$exists : ?0}, 'keywordReviewList.7':{$exists:?1}, 'keywordReviewList.9':{$exists:?2},'foodCategory':{$in:?3}}")
    List<Output> findByUserPrefer(Boolean index0, Boolean index1, Boolean index2, List<String> selectedFoodCategoryList);

//    Optional<Crawling> findByFoodCategoryNotIn(List<String> koreanFoodList);
//    1. 혼밥하기 좋아요(15) 키워드 확인
//    2. 주차하기 좋아요(7) 키워드 확인
//    3, 특별한날 가기 좋아요(9) 키워드 확인

//    4. 한식/ 비한식 -> 이건끝, 분류 리스트만 만들면 됨
//    5. 육류/ 해산물 -> 이것도 끝,분류 리스트만 만들면 됨

}
