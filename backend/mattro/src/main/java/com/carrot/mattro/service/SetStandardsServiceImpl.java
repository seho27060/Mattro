package com.carrot.mattro.service;

import com.carrot.mattro.domain.entity.Output;
import com.carrot.mattro.domain.entity.Subway;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.StringTokenizer;

@Service
@RequiredArgsConstructor
public class SetStandardsServiceImpl implements SetStandardsService{

    // return 1. 평균, 2. 분산, 3. 최대값, 4. 최소값
    
    @Override
    public double[] reviewCountBase(List<Output> storeList) {

        double average;
        double dispersion;
        double sumDeviation = 0;
        double max = 0;
        double min = 1.7976931348623157E308;

        double size = storeList.size();
        double sumCnt = 0;

        for (Output store : storeList) {
            double reviewCnt;
            if(!store.getReviewCnt().isEmpty()){
                reviewCnt = Double.parseDouble(store.getReviewCnt().replace(",",""));
            } else {
                reviewCnt = 0;
            }
            sumCnt += reviewCnt;
            max = Math.max(max, reviewCnt);
            min = Math.min(min, reviewCnt);
        }

        average = sumCnt / size;

        for (Output store : storeList) {
            double reviewCnt;
            if(!store.getReviewCnt().isEmpty()){
                reviewCnt = Double.parseDouble(store.getReviewCnt().replace(",",""));
            } else {
                reviewCnt = 0;
            }
            double deviation = Math.abs(reviewCnt - average);
            sumDeviation += Math.pow(deviation, 2);
        }

        dispersion = sumDeviation / sumCnt;

        return new double[]{average, dispersion, max, min};
    }

    @Override
    public double[] reviewContentBase(List<Output> storeList) {

        double average;
        double dispersion;
        double sumDeviation = 0;
        double max = 0;
        double min = 1.7976931348623157E308;

        double size = storeList.size();
        double sumCnt = 0;

        for (Output store : storeList) {
            double reviewLength = 0;

            for (int j = 0; j < store.getReviews().size(); j++) {
                reviewLength += store.getReviews().get(j).length();
            }

            sumCnt += reviewLength;
            max = Math.max(max, reviewLength);
            min = Math.min(min, reviewLength);
        }

        average = sumCnt / size;

        for (Output store : storeList) {
            double sumReviewLength = 0;

            for (int j = 0; j < store.getReviews().size(); j++) {
                sumReviewLength += store.getReviews().get(j).length();
            }

            double deviation = Math.abs(sumReviewLength - average);
            sumDeviation += Math.pow(deviation, 2);
        }

        dispersion = sumDeviation / sumCnt;

        return new double[]{average, dispersion, max, min};
    }

    @Override
    public double[] blogBase(List<Output> storeList) {

        double average;
        double dispersion;
        double sumDeviation = 0;
        double max = 0;
        double min = 1.7976931348623157E308;

        double size = storeList.size();
        double sumCnt = 0;

        for (Output store : storeList) {
            double blogCnt;
            if(!store.getBlogCnt().isEmpty()){
                blogCnt = Double.parseDouble(store.getBlogCnt().replace(",",""));
            } else {
                blogCnt = 0;
            }
            sumCnt += blogCnt;
            max = Math.max(max, blogCnt);
            min = Math.min(min, blogCnt);
        }

        average = sumCnt / size;

        for (Output store : storeList) {
            double blogCnt;
            if(!store.getBlogCnt().isEmpty()){
                blogCnt = Double.parseDouble(store.getBlogCnt().replace(",",""));
            } else {
                blogCnt = 0;
            }
            double deviation = Math.abs(blogCnt - average);
            sumDeviation += Math.pow(deviation, 2);
        }

        dispersion = sumDeviation / sumCnt;

        return new double[]{average, dispersion, max, min};
    }

    @Override
    public double[] ratingBase(List<Output> storeList) {

        double average;
        double dispersion;
        double sumDeviation = 0;
        double max = 0;
        double min = 1.7976931348623157E308;

        double size = storeList.size();
        double sumCnt = 0;

        for (Output store : storeList) {
            String sRating = store.getRating();
            double rating;
            if(!sRating.isEmpty()) {
                StringTokenizer st = new StringTokenizer(sRating, "/");
                rating = Double.parseDouble(st.nextToken());
            } else {
                rating = 0;
            }
            sumCnt += rating;
            max = Math.max(max, rating);
            min = Math.min(min, rating);
        }

        average = sumCnt / size;

        for (Output store : storeList) {
            String sRating = store.getRating();
            double rating;
            if(!sRating.isEmpty()) {
                StringTokenizer st = new StringTokenizer(sRating, "/");
                rating = Double.parseDouble(st.nextToken());
            } else {
                rating = 0;
            }
            double deviation = Math.abs(rating - average);
            sumDeviation += Math.pow(deviation, 2);
        }

        dispersion = sumDeviation / sumCnt;

        return new double[]{average, dispersion, max, min};
    }

    @Override
    public double[] distanceBase(List<Output> storeList, Subway subway) {

        double average;
        double dispersion;
        double sumDeviation = 0;
        double max = 0;
        double min = 1.7976931348623157E308;
        double size = storeList.size();
        double sumCnt = 0;

        double subLongitude = subway.get경도();
        double subLatitude = subway.get위도();

        for (Output store : storeList) {
            double distance = getDistance(subLongitude, subLatitude, store);
            sumCnt += distance;

            max = Math.max(max, distance);
            min = Math.min(min, distance);
        }

        average = sumCnt / size;

        for (Output store : storeList) {

            double distance = getDistance(subLongitude, subLatitude, store);
            sumDeviation += Math.pow(distance, 2);
        }

        dispersion = sumDeviation / sumCnt;

        return new double[]{average, dispersion, max, min};
    }

    private double getDistance(double subLongitude, double subLatitude, Output output) {
        double longitude = Double.parseDouble(output.getLongitude());
        double latitude = Double.parseDouble(output.getLatitude());

        double x = subLongitude - longitude;
        double y = subLatitude - latitude;

        return Math.sqrt(x * x + y * y);
    }
}
