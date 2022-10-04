package com.carrot.mattro.Repository;
import com.carrot.mattro.domain.entity.Crawling;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ResultMongoDBRepository extends MongoRepository<Crawling, String> {

//     JPA -> jpa가 알아서 그 디비에 맞는 쿼리로 변환 시켜줌.
//     mongodb 측에서 지원해주는 기능 -> 몽고디비 전용 쿼리로 날아가서 몽고디비에 적용된다
    Optional<Crawling> findByName(String storeName);
}
