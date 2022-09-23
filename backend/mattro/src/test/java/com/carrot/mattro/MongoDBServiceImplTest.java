package com.spark.spark;

import static org.assertj.core.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;



@SpringBootTest
class MongoDBServiceImplTest {

    @Autowired
    ResultMongoDBRepository mongoDBRepository;

    @Test
    void findPlaceBySubwayName() {
        String storeName = "아울림";
        System.out.println(storeName);
        Optional<Result> test_result = mongoDBRepository.findByName("아울림");
//        List<Result> list = mongoDBRepository.findAll()
//        System.out.println(test.get(0));
//        assertThat(test_list.get(0).getKeywordReviewList()).isNotNull();
//        System.out.println(list.get(0).getStoreIdx());
//        System.out.println(list.get(0).getKeywordReviewList().getClass().getName());
//        assertThat(list).isNotEmpty();
        assertThat(test_result).isNotEmpty();
        assertThat(test_result.get().getKeywordReviewList()).isNotNull();
        System.out.println(test_result.get().getKeywordReviewList().getClass().getName());
        System.out.println(test_result.get().getKeywordReviewList());
        System.out.println(test_result.get().getKeywordReviewList().get("1")                                                                                                                                                                                                                                                                                                                                                                                                                                                                        );

    }

    @Test
    void findPlaceByUrl() {
    }

    @Test
    void findPlaceListByChoiceList() {
    }

    @Test
    void findPlaceListByUrl() {
    }
}