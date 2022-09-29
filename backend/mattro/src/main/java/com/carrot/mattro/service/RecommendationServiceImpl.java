package com.carrot.mattro.service;

import com.carrot.mattro.DTO.store;
import com.carrot.mattro.Output;
import com.carrot.mattro.Repository.OutputRepository;
import com.carrot.mattro.domain.entity.Subway;
import com.carrot.mattro.domain.repository.SubwayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final SubwayRepository subwayRepository;
    private final OutputRepository outputRepository;
    private final SetStandardsService setStandardsService;

    @Override
    public String recommendationStore(String subwayName) {

        List<Output> storeList = outputRepository.findAllBy역명(subwayName);
        Subway subway = subwayRepository.findBy역명(subwayName);

        store[] storeZ = new store[storeList.size()];

        double[] reviewCountZ = reviewCountNormalization(setStandardsService.reviewCountBase(storeList), storeList);
        double[] reviewContentZ = reviewContentNormalization(setStandardsService.reviewContentBase(storeList), storeList);
        double[] reviewBlogZ = reviewBlogNormalization(setStandardsService.blogBase(storeList), storeList);
        double[] reviewRatingZ = reviewRatingNormalization(setStandardsService.ratingBase(storeList), storeList);
        double[] storeDistanceZ = storeDistanceNormalization(setStandardsService.distanceBase(storeList, subway), storeList, subway);

        for(int i = 0; i < storeList.size(); i++){
            double z = 0;

            z += reviewCountZ[i] * 0.25;
            z += reviewContentZ[i] * 0.1;
            z += reviewBlogZ[i] * 0.1;
            z += reviewRatingZ[i] * 0.25;
            z += storeDistanceZ[i] * 0.3;

            storeZ[i] = new store(storeList.get(i).getStoreIdx(), z);
        }

        // z에 따른 정렬
        Arrays.sort(storeZ, (o1, o2) -> Double.compare(o2.getZ(), o1.getZ()));

        storeZ[(int)(Math.random() * 20)].getStoreIdx();

        return storeZ[(int)(Math.random() * 20)].getStoreIdx();
    }

    @Override
    public double[] reviewCountNormalization(double[] standard, List<Output> storeList) {

        double[] reviewCountZ = new double[storeList.size()];
        double maxV = (standard[2] - standard[0]) / Math.sqrt(standard[1]);
        double minV = (standard[3] - standard[0]) / Math.sqrt(standard[1]);

        for(int i = 0; i < storeList.size(); i++){
            double reviewCnt;
            if(!storeList.get(i).getReviewCnt().isEmpty()){
                reviewCnt = Double.parseDouble(storeList.get(i).getReviewCnt().replace(",",""));
            } else {
                reviewCnt = 0;
            }

            standardization(standard, storeList, reviewCountZ, i, reviewCnt, maxV, minV);
        }

        return reviewCountZ;
    }

    @Override
    public double[] reviewContentNormalization(double[] standard, List<Output> storeList) {

        double[] reviewContentZ = new double[storeList.size()];
        double maxV = (standard[2] - standard[0]) / Math.sqrt(standard[1]);
        double minV = (standard[3] - standard[0]) / Math.sqrt(standard[1]);

        for(int i = 0; i < storeList.size(); i++){
            double reviewLength = 0;

            for (String review : storeList.get(i).getReviews()) {
                reviewLength += review.length();
            }

            standardization(standard, storeList, reviewContentZ, i, reviewLength, maxV, minV);
        }

        return reviewContentZ;
    }

    @Override
    public double[] reviewBlogNormalization(double[] standard, List<Output> storeList) {

        double[] reviewBlogZ = new double[storeList.size()];
        double maxV = (standard[2] - standard[0]) / Math.sqrt(standard[1]);
        double minV = (standard[3] - standard[0]) / Math.sqrt(standard[1]);

        for(int i = 0; i < storeList.size(); i++){
            double blogCnt;
            if(!storeList.get(i).getBlogCnt().isEmpty()){
                blogCnt = Double.parseDouble(storeList.get(i).getBlogCnt().replace(",",""));
            } else {
                blogCnt = 0;
            }

            standardization(standard, storeList, reviewBlogZ, i, blogCnt, maxV, minV);
        }

        return reviewBlogZ;
    }

    @Override
    public double[] reviewRatingNormalization(double[] standard, List<Output> storeList) {

        double[] reviewRatingZ = new double[storeList.size()];
        double maxV = (standard[2] - standard[0]) / Math.sqrt(standard[1]);
        double minV = (standard[3] - standard[0]) / Math.sqrt(standard[1]);

        for(int i = 0; i < storeList.size(); i++){
            String sRating = storeList.get(i).getRating();
            double rating;
            if(!sRating.isEmpty()) {
                StringTokenizer st = new StringTokenizer(sRating, "/");
                rating = Double.parseDouble(st.nextToken());
            } else {
                rating = 0;
            }
            StringTokenizer st = new StringTokenizer(sRating, "/");

            standardization(standard, storeList, reviewRatingZ, i, rating, maxV, minV);
        }

        return reviewRatingZ;
    }

    @Override
    public double[] storeDistanceNormalization(double[] standard, List<Output> storeList, Subway subway) {

        double[] storeDistanceZ = new double[storeList.size()];
        double maxV = (standard[2] - standard[0]) / Math.sqrt(standard[1]);
        double minV = (standard[3] - standard[0]) / Math.sqrt(standard[1]);

        double subLongitude = subway.get경도();
        double subLatitude = subway.get위도();

        for(int i = 0; i < storeList.size(); i++){

            double distance = getDistance(subLongitude, subLatitude, storeList.get(i));

            standardization(standard, storeList, storeDistanceZ, i, distance, maxV, minV);
        }

        return storeDistanceZ;
    }

    private double getDistance(double subLongitude, double subLatitude, Output output) {
        double longitude = Double.parseDouble(output.getLongitude());
        double latitude = Double.parseDouble(output.getLatitude());

        double x = subLongitude - longitude;
        double y = subLatitude - latitude;

        return Math.sqrt(x * x + y * y);
    }

    private void standardization(double[] standard, List<Output> storeList, double[] review, int i, double x, double maxV, double minV) {
        double y = (x - standard[0]) / Math.sqrt(standard[1]);
        double z = (y - minV) / (maxV - minV);

        review[i] = z;
    }
}
