package com.carrot.mattro;

import com.carrot.mattro.DTO.OutputResponse;

import java.util.Optional;

public interface MongoDBService {
    public Optional<Output> findPlaceBySubwayName(String SubwayName);
    public void findPlaceByUrl(String Url);
    public void findPlaceListByChoiceList(String ChoiceList);
    public void findPlaceListByUrl(String url);

    Optional<Output> findPlaceByStoreIndex(String storeIndex);
}
