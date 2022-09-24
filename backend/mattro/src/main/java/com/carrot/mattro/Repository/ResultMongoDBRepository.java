package com.carrot.mattro.Repository;
import com.carrot.mattro.Result;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ResultMongoDBRepository extends MongoRepository<Result, String> {

    Optional<Result> findByName(String storeName);
}
