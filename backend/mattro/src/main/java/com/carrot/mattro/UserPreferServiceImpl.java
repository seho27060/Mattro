package com.carrot.mattro;

import com.carrot.mattro.DTO.store;
import com.carrot.mattro.Repository.CrawlingRepository;
import com.carrot.mattro.service.RecommendationService;
import com.carrot.mattro.service.SetStandardsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserPreferServiceImpl implements UserPreferService {
    private final List<String> koreanFoodList = List.of("한식");
    private final List<String> MeatFoodList = List.of("돼지고기 구이","소고기 구이","양꼬치","돼지고기 구이");
    private final CrawlingRepository crawlingRepository;
    private final RecommendationService recommendationService;
    private final SetStandardsService setStandardsService;

    @Override
    public List<Integer> userPrefer(String choices) {
        Boolean index0 = false;
        Boolean index1 = false;
        Boolean index2 = false;

        List<String> koreanFoodList = List.of("한식");
        List<String> meetFoodList = List.of("육류,고기요리","족발,보쌈");
        List<String> resultFoodCategoryList = new ArrayList<String>();

        if(choices.substring(0,1).equals("1")){
            index0 = true;
        }
        if(choices.substring(1,2).equals("1")){
            index1 = true;
        }
        if(choices.substring(2,3).equals("1")){
            index2 = true;
        }
        if(choices.substring(3,4).equals("1")){
            resultFoodCategoryList.addAll(koreanFoodList);
        }
        if(choices.substring(4,5).equals("1")){
            resultFoodCategoryList.addAll(meetFoodList);
        }
        List<Output> byUserPrefer = crawlingRepository.findByUserPrefer(index0, index1, index2, resultFoodCategoryList);
//        추천알고리즘 적용

        if (byUserPrefer.isEmpty()){
            return new ArrayList<>();
        } else{
            store[] storeZ = new store[byUserPrefer.size()];

            double[] reviewCountZ = recommendationService.reviewCountNormalization(setStandardsService.reviewCountBase(byUserPrefer), byUserPrefer);
            double[] reviewContentZ = recommendationService.reviewContentNormalization(setStandardsService.reviewContentBase(byUserPrefer), byUserPrefer);
            double[] reviewBlogZ = recommendationService.reviewBlogNormalization(setStandardsService.blogBase(byUserPrefer), byUserPrefer);
            double[] reviewRatingZ = recommendationService.reviewRatingNormalization(setStandardsService.ratingBase(byUserPrefer), byUserPrefer);

            for(int i = 0; i < byUserPrefer.size(); i++){
                double z = 0;

                z += reviewCountZ[i] * 0.25;
                z += reviewContentZ[i] * 0.1;
                z += reviewBlogZ[i] * 0.1;
                z += reviewRatingZ[i] * 0.25;

                storeZ[i] = new store(byUserPrefer.get(i).getStoreIdx(), z);
            }

            // z에 따른 정렬
            Arrays.sort(storeZ, (o1, o2) -> Double.compare(o2.getZ(), o1.getZ()));
            Integer limit = Math.min(storeZ.length,20);
            List<Integer> numLst = new ArrayList<>();
            for(int i = 0; i < 5; i++){
                int num = Integer.parseInt(storeZ[(int)(Math.random() * limit)].getStoreIdx());

                if(numLst.isEmpty()){
                    numLst.add(num);
                    continue;
                }

                if (!numLst.contains(num)){
                    numLst.add(num);
                } else{
                    i--;
                }
            }
            return numLst;
        }

    }

    @Override
    public List<Output> getStoreByStoreIndexList(String storeIndexStr) {
        String[] storeIndexList = storeIndexStr.split(",");
        List<Output> result = crawlingRepository.findByStoreIdxIn(storeIndexList);
        return result;
    }
}
