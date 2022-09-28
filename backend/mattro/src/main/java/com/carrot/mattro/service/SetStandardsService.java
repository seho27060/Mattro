package com.carrot.mattro.service;

import com.carrot.mattro.Output;
import com.carrot.mattro.domain.entity.Subway;

import java.util.List;

public interface SetStandardsService {

    double[] reviewCountBase(List<Output> storeList);
    double[] reviewContentBase(List<Output> storeList);
    double[] blogBase(List<Output> storeList);
    double[] ratingBase(List<Output> storeList);
    double[] distanceBase(List<Output> storeList, Subway subway);
}
