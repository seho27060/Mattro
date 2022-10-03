package com.carrot.mattro.Repository;

import com.carrot.mattro.Output;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OutputRepository extends MongoRepository<Output, String> {

    List<Output> findAllBy역명(String subwayName);
    Output findBy역명(String subwayName);
    Output findByStoreIdx(String storeIdx);
}
