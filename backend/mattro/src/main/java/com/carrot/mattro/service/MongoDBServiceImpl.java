package com.carrot.mattro.service;

import com.carrot.mattro.domain.entity.Output;
import com.carrot.mattro.Repository.OutputRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MongoDBServiceImpl implements MongoDBService{

    private final OutputRepository outputR;
    private final Output none_data = Output.builder()
            .name("none_data").build();
    private final Output too_far = Output.builder()
            .name("too_far").build();
    private final Output too_old = Output.builder()
            .name("too_old").build();

    @Override
    public Optional<Output> findPlaceBySubwayName(String subwayName) {
        Optional<Output> output = Optional.ofNullable(outputR.findBy역명(subwayName));
        if(output.isPresent()){
            return output;
        }
        return null;
    }

    @Override
    public void findPlaceByUrl(String Url) {

    }

    @Override
    public void findPlaceListByChoiceList(String ChoiceList) {

    }

    @Override
    public void findPlaceListByUrl(String url) {

    }
    @Cacheable(value = "layoutCaching")
    @Override
    public Output findPlaceByStoreIndex(String storeIndex) {
        Optional<Output> outputOptional = outputR.findByStoreIdx(storeIndex);
        return outputOptional.orElse(null);
    }
}

// 캐시, optional 클래스를 더 잘 쓰자, OCP를 지킬 수 있도록 초장부터 설계를 잘해보자
