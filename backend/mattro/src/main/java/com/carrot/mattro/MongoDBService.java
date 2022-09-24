package com.carrot.mattro;

import java.util.List;

public interface MongoDBService {
    public void findPlaceBySubwayName(String SubwayName);
    public void findPlaceByUrl(String Url);
    public void findPlaceListByChoiceList(String ChoiceList);
    public void findPlaceListByUrl(String url);
    public void findPlaceBySurvey(List<Integer> survey);

}
