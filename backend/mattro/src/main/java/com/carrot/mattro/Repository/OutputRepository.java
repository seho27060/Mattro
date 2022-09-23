package com.carrot.mattro.Repository;

import com.carrot.mattro.Output;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface OutputRepository extends MongoRepository<Output, String> {

    Optional<Output> findBy역명(String subwayName);
    Optional<Output> findByStoreIdx(String storeIdx);
}
