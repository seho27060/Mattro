package com.carrot.mattro.service;

import com.carrot.mattro.domain.entity.Output;
import com.carrot.mattro.domain.entity.Subway;

import java.util.List;

public interface RecommendationService {

    String recommendationStore(String subwayName);

    double[] reviewCountNormalization(double[] standard, List<Output> storeList);
    double[] reviewContentNormalization(double[] standard, List<Output> storeList);
    double[] reviewBlogNormalization(double[] standard, List<Output> storeList);
    double[] reviewRatingNormalization(double[] standard, List<Output> storeList);
    double[] storeDistanceNormalization(double[] standard, List<Output> storeList, Subway subway);
}
