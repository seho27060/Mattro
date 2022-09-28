package com.carrot.mattro.domain.repository;

import com.carrot.mattro.domain.entity.Subway;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface SubwayRepository extends MongoRepository<Subway, String> {

    boolean existsBy역명(String subwayName);
    Subway findBy역명(String subwayName);
}
