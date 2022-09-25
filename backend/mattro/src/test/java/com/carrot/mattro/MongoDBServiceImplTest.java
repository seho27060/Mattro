package com.carrot.mattro;
import static org.assertj.core.api.Assertions.*;

import com.carrot.mattro.Repository.CrawlingRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;


// ctrl + L shift + T 누르면 테스트 코드 작성

@SpringBootTest
class MongoDBServiceImplTest {

    @Autowired
    CrawlingRepository mongoDBRepository;


    // 역 데이터 + 크롤링 데이터
    // 크롤링 데이터 1000개만 미리 넣어놓음.
    // 역 이름, [크롤링 데이터 한줄, 크롤링 데이터 한줄] in spark
    @Test
    void findPlaceBySubwayName() {
        String storeName = "아울림";
        System.out.println(storeName);
        Optional<Crawling> test_result = mongoDBRepository.findByName("아울림");
//        List<Result> list = mongoDBRepository.findAll()
//        System.out.println(test.get(0));
//        assertThat(test_list.get(0).getKeywordReviewList()).isNotNull();
//        System.out.println(list.get(0).getStoreIdx());
//        System.out.println(list.get(0).getKeywordReviewList().getClass().getName());
//        assertThat(list).isNotEmpty();
        // 쿼리 결과가 존재하기를 기대하고 있음
        assertThat(test_result).isNotEmpty();
        // 키워드리뷰리스트가 존재하길 기대하고 있음.
        assertThat(test_result.get().getKeywordReviewList()).isNotNull();
        // org.bson.Document
        // 매핑을 틀리게 하면 안되던데?
        // String
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