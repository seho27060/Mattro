package com.carrot.mattro;

import java.util.List;
import java.util.Optional;


public interface UserPreferService {
    List<Integer> userPrefer(String choices);

    List<Output> getStoreByStoreIndexList(String storeIdxList);
//    List<Output>
}
