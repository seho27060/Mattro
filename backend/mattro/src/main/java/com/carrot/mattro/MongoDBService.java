package com.carrot.mattro;

public interface MongoDBService {
    public void findPlaceBySubwayName(String SubwayName);
    public void findPlaceByUrl(String Url);
    public void findPlaceListByChoiceList(String ChoiceList);
    public void findPlaceListByUrl(String url);

}
