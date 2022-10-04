package com.carrot.mattro.service;

import com.carrot.mattro.domain.entity.Output;

import java.util.List;


public interface UserPreferService {
    List<Integer> userPrefer(String choices);

    List<Output> getStoreByStoreIndexList(String storeIdxList);
//    List<Output>
}
