package com.carrot.mattro;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ResultMongoDBRepository extends MongoRepository<Crawling, String> {

    Optional<Crawling> findByName(String storeName);
}
