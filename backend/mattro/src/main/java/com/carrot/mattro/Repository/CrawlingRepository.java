package com.carrot.mattro.Repository;
import com.carrot.mattro.Crawling;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CrawlingRepository extends MongoRepository<Crawling, String> {

    Optional<Crawling> findByName(String storeName);
    List<Crawling> findByFoodCategoryIn(List<String> koreanFoodList);
//    Optional<Crawling> findByFoodCategoryNotIn(List<String> koreanFoodList);
}
