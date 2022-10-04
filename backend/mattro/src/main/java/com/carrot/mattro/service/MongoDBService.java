package com.carrot.mattro.service;

import com.carrot.mattro.domain.entity.Output;

import java.util.Optional;

public interface MongoDBService {
//    public Output findPlaceByStoreIndex(String storeIndex);
    public Optional<Output> findPlaceBySubwayName(String SubwayName);
    public void findPlaceByUrl(String Url);
    public void findPlaceListByChoiceList(String ChoiceList);
    public void findPlaceListByUrl(String url);

    Output findPlaceByStoreIndex(String storeIndex);
}
