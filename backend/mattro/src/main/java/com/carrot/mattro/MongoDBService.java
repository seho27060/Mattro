package com.carrot.mattro;

import com.carrot.mattro.DTO.OutputResponse;

public interface MongoDBService {
    public OutputResponse findPlaceBySubwayName(String SubwayName);
    public void findPlaceByUrl(String Url);
    public void findPlaceListByChoiceList(String ChoiceList);
    public void findPlaceListByUrl(String url);

}
